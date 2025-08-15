/**
 * Real-Time Analytics Streaming Service
 * Story 2.2: Advanced Analytics & Reporting
 * 
 * Real-time data streaming, live dashboard updates, event processing,
 * and instant analytics with WebSocket connections and live data feeds
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  RealTimeAnalytics,
  LiveMetric,
  StreamingEvent,
  AlertRule,
  PerformanceMetric,
  SystemHealth
} from '@/types/analytics';

// =====================================================
// REAL-TIME ANALYTICS SERVICE
// =====================================================

export class RealTimeAnalyticsService {
  private static subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private static eventBuffer: Map<string, StreamingEvent[]> = new Map();
  private static alertRules: Map<string, AlertRule[]> = new Map();
  private static isStreaming = false;

  /**
   * Initialize real-time analytics streaming
   */
  static async initialize(subscriptionId: string): Promise<void> {
    try {
      if (this.isStreaming) return;

      // Set up Supabase real-time subscriptions
      await this.setupRealtimeSubscriptions(subscriptionId);
      
      // Initialize event processing
      this.startEventProcessing(subscriptionId);
      
      // Start metrics collection
      this.startMetricsCollection(subscriptionId);
      
      // Load alert rules
      await this.loadAlertRules(subscriptionId);

      this.isStreaming = true;
      console.log('Real-time analytics streaming initialized');
    } catch (error) {
      console.error('Error initializing real-time analytics:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time metric updates
   */
  static subscribe(
    subscriptionId: string,
    metricType: string,
    callback: (data: LiveMetric) => void
  ): () => void {
    const key = `${subscriptionId}:${metricType}`;
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  /**
   * Publish real-time metric update
   */
  static publish(subscriptionId: string, metric: LiveMetric): void {
    const key = `${subscriptionId}:${metric.type}`;
    const subscribers = this.subscribers.get(key);
    
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(metric);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }

    // Store in event buffer for processing
    this.addToEventBuffer(subscriptionId, {
      id: `event_${Date.now()}_${Math.random()}`,
      subscription_id: subscriptionId,
      event_type: 'metric_update',
      event_data: metric,
      timestamp: new Date().toISOString(),
      processed: false
    });
  }

  /**
   * Get current real-time analytics snapshot
   */
  static async getCurrentSnapshot(subscriptionId: string): Promise<RealTimeAnalytics> {
    try {
      const [
        systemHealth,
        activeUsers,
        packageMetrics,
        revenueMetrics,
        performanceMetrics
      ] = await Promise.all([
        this.getSystemHealth(subscriptionId),
        this.getActiveUsers(subscriptionId),
        this.getPackageMetrics(subscriptionId),
        this.getRevenueMetrics(subscriptionId),
        this.getPerformanceMetrics(subscriptionId)
      ]);

      const snapshot: RealTimeAnalytics = {
        subscription_id: subscriptionId,
        timestamp: new Date().toISOString(),
        active_users: activeUsers.count,
        packages_in_transit: packageMetrics.in_transit,
        pending_deliveries: packageMetrics.pending_deliveries,
        system_health_score: systemHealth.overall_score,
        current_response_time: performanceMetrics.avg_response_time,
        error_rate_last_hour: performanceMetrics.error_rate,
        throughput_per_minute: performanceMetrics.throughput,
        revenue_today: revenueMetrics.today,
        new_customers_today: activeUsers.new_today,
        packages_processed_today: packageMetrics.processed_today,
        communications_sent_today: 0, // Would be calculated from communication logs
        active_alerts: await this.getActiveAlerts(subscriptionId),
        performance_warnings: await this.getPerformanceWarnings(subscriptionId)
      };

      return snapshot;
    } catch (error) {
      console.error('Error getting current snapshot:', error);
      throw error;
    }
  }

  /**
   * Stream live dashboard data
   */
  static async streamDashboardData(
    subscriptionId: string,
    dashboardId: string,
    callback: (data: any) => void
  ): Promise<() => void> {
    // Set up streaming for specific dashboard widgets
    const unsubscribeFunctions: (() => void)[] = [];

    // Get dashboard configuration
    const { data: dashboard } = await supabase
      .from('analytics_dashboards')
      .select('layout')
      .eq('id', dashboardId)
      .single();

    if (dashboard?.layout?.widgets) {
      for (const widget of dashboard.layout.widgets) {
        const unsubscribe = this.subscribe(subscriptionId, widget.metric_type, (metric) => {
          callback({
            widget_id: widget.id,
            metric_type: widget.metric_type,
            data: metric,
            timestamp: new Date().toISOString()
          });
        });
        
        unsubscribeFunctions.push(unsubscribe);
      }
    }

    // Return function to unsubscribe from all streams
    return () => {
      unsubscribeFunctions.forEach(fn => fn());
    };
  }

  /**
   * Create real-time alert rule
   */
  static async createAlertRule(
    subscriptionId: string,
    rule: Omit<AlertRule, 'id' | 'created_at'>
  ): Promise<AlertRule> {
    try {
      const { data, error } = await supabase
        .from('analytics_alert_rules')
        .insert({
          subscription_id: subscriptionId,
          ...rule,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add to in-memory rules
      if (!this.alertRules.has(subscriptionId)) {
        this.alertRules.set(subscriptionId, []);
      }
      this.alertRules.get(subscriptionId)!.push(data as AlertRule);

      return data as AlertRule;
    } catch (error) {
      console.error('Error creating alert rule:', error);
      throw error;
    }
  }

  /**
   * Process streaming events
   */
  static async processStreamingEvents(subscriptionId: string): Promise<void> {
    const events = this.eventBuffer.get(subscriptionId) || [];
    const unprocessedEvents = events.filter(e => !e.processed);

    for (const event of unprocessedEvents) {
      try {
        await this.processEvent(event);
        event.processed = true;
      } catch (error) {
        console.error('Error processing event:', error);
      }
    }

    // Clean up old events (keep last 1000)
    if (events.length > 1000) {
      this.eventBuffer.set(subscriptionId, events.slice(-1000));
    }
  }

  /**
   * Get live performance metrics
   */
  static async getLivePerformanceMetrics(subscriptionId: string): Promise<PerformanceMetric[]> {
    try {
      // Simulate real-time performance data
      const metrics: PerformanceMetric[] = [
        {
          metric_name: 'response_time',
          current_value: Math.random() * 200 + 50,
          threshold: 500,
          status: 'normal',
          trend: 'stable',
          timestamp: new Date().toISOString()
        },
        {
          metric_name: 'error_rate',
          current_value: Math.random() * 2,
          threshold: 5,
          status: 'normal',
          trend: 'decreasing',
          timestamp: new Date().toISOString()
        },
        {
          metric_name: 'throughput',
          current_value: Math.random() * 50 + 20,
          threshold: 10,
          status: 'good',
          trend: 'increasing',
          timestamp: new Date().toISOString()
        },
        {
          metric_name: 'cpu_usage',
          current_value: Math.random() * 40 + 30,
          threshold: 80,
          status: 'normal',
          trend: 'stable',
          timestamp: new Date().toISOString()
        },
        {
          metric_name: 'memory_usage',
          current_value: Math.random() * 30 + 40,
          threshold: 85,
          status: 'normal',
          trend: 'stable',
          timestamp: new Date().toISOString()
        }
      ];

      return metrics;
    } catch (error) {
      console.error('Error getting live performance metrics:', error);
      return [];
    }
  }

  // =====================================================
  // PRIVATE HELPER METHODS
  // =====================================================

  private static async setupRealtimeSubscriptions(subscriptionId: string): Promise<void> {
    // Set up Supabase real-time subscriptions for relevant tables
    const tables = [
      'packages',
      'customers',
      'communication_executions',
      'subscription_health_metrics'
    ];

    for (const table of tables) {
      supabase
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: table,
            filter: `subscription_id=eq.${subscriptionId}`
          }, 
          (payload) => {
            this.handleDatabaseChange(subscriptionId, table, payload);
          }
        )
        .subscribe();
    }
  }

  private static handleDatabaseChange(subscriptionId: string, table: string, payload: any): void {
    // Convert database changes to live metrics
    let metric: LiveMetric | null = null;

    switch (table) {
      case 'packages':
        if (payload.eventType === 'INSERT') {
          metric = {
            type: 'package_received',
            value: 1,
            timestamp: new Date().toISOString(),
            metadata: { package_id: payload.new.id }
          };
        }
        break;
      
      case 'customers':
        if (payload.eventType === 'INSERT') {
          metric = {
            type: 'new_customer',
            value: 1,
            timestamp: new Date().toISOString(),
            metadata: { customer_id: payload.new.id }
          };
        }
        break;
    }

    if (metric) {
      this.publish(subscriptionId, metric);
    }
  }

  private static startEventProcessing(subscriptionId: string): void {
    // Process events every 5 seconds
    setInterval(() => {
      this.processStreamingEvents(subscriptionId);
    }, 5000);
  }

  private static startMetricsCollection(subscriptionId: string): void {
    // Collect metrics every 30 seconds
    setInterval(async () => {
      try {
        const snapshot = await this.getCurrentSnapshot(subscriptionId);
        
        // Publish key metrics
        this.publish(subscriptionId, {
          type: 'system_health',
          value: snapshot.system_health_score,
          timestamp: snapshot.timestamp,
          metadata: { snapshot }
        });

        this.publish(subscriptionId, {
          type: 'active_users',
          value: snapshot.active_users,
          timestamp: snapshot.timestamp,
          metadata: {}
        });

        this.publish(subscriptionId, {
          type: 'response_time',
          value: snapshot.current_response_time,
          timestamp: snapshot.timestamp,
          metadata: {}
        });
      } catch (error) {
        console.error('Error collecting metrics:', error);
      }
    }, 30000);
  }

  private static async loadAlertRules(subscriptionId: string): Promise<void> {
    try {
      const { data: rules, error } = await supabase
        .from('analytics_alert_rules')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('is_active', true);

      if (error) throw error;

      this.alertRules.set(subscriptionId, rules || []);
    } catch (error) {
      console.error('Error loading alert rules:', error);
    }
  }

  private static addToEventBuffer(subscriptionId: string, event: StreamingEvent): void {
    if (!this.eventBuffer.has(subscriptionId)) {
      this.eventBuffer.set(subscriptionId, []);
    }
    
    this.eventBuffer.get(subscriptionId)!.push(event);
  }

  private static async processEvent(event: StreamingEvent): Promise<void> {
    // Check alert rules
    const rules = this.alertRules.get(event.subscription_id) || [];
    
    for (const rule of rules) {
      if (this.shouldTriggerAlert(event, rule)) {
        await this.triggerAlert(event, rule);
      }
    }

    // Store event for historical analysis
    await supabase
      .from('analytics_events')
      .insert({
        subscription_id: event.subscription_id,
        event_type: event.event_type,
        event_data: event.event_data,
        timestamp: event.timestamp
      });
  }

  private static shouldTriggerAlert(event: StreamingEvent, rule: AlertRule): boolean {
    if (event.event_type !== rule.metric_type) return false;

    const value = event.event_data?.value || 0;
    
    switch (rule.condition) {
      case 'greater_than':
        return value > rule.threshold;
      case 'less_than':
        return value < rule.threshold;
      case 'equals':
        return value === rule.threshold;
      default:
        return false;
    }
  }

  private static async triggerAlert(event: StreamingEvent, rule: AlertRule): Promise<void> {
    try {
      await supabase
        .from('analytics_alerts')
        .insert({
          subscription_id: event.subscription_id,
          rule_id: rule.id,
          alert_type: rule.alert_type,
          severity: rule.severity,
          message: rule.message,
          event_data: event.event_data,
          triggered_at: new Date().toISOString(),
          status: 'active'
        });

      console.log(`Alert triggered: ${rule.message}`);
    } catch (error) {
      console.error('Error triggering alert:', error);
    }
  }

  private static async getSystemHealth(subscriptionId: string): Promise<SystemHealth> {
    // Mock system health calculation
    return {
      overall_score: Math.random() * 10 + 90, // 90-100
      components: {
        database: Math.random() * 5 + 95,
        api: Math.random() * 5 + 95,
        storage: Math.random() * 5 + 95,
        network: Math.random() * 5 + 95
      },
      last_updated: new Date().toISOString()
    };
  }

  private static async getActiveUsers(subscriptionId: string): Promise<{ count: number; new_today: number }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { count: activeCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .gte('last_activity_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { count: newCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .gte('created_at', `${today}T00:00:00.000Z`);

      return {
        count: activeCount || 0,
        new_today: newCount || 0
      };
    } catch (error) {
      console.error('Error getting active users:', error);
      return { count: 0, new_today: 0 };
    }
  }

  private static async getPackageMetrics(subscriptionId: string): Promise<any> {
    try {
      const { count: inTransit } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .eq('status', 'in_transit');

      const { count: pending } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .eq('status', 'pending_delivery');

      const today = new Date().toISOString().split('T')[0];
      const { count: processedToday } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_id', subscriptionId)
        .gte('created_at', `${today}T00:00:00.000Z`);

      return {
        in_transit: inTransit || 0,
        pending_deliveries: pending || 0,
        processed_today: processedToday || 0
      };
    } catch (error) {
      console.error('Error getting package metrics:', error);
      return { in_transit: 0, pending_deliveries: 0, processed_today: 0 };
    }
  }

  private static async getRevenueMetrics(subscriptionId: string): Promise<{ today: number }> {
    // Mock revenue calculation for today
    return { today: Math.random() * 1000 + 500 };
  }

  private static async getPerformanceMetrics(subscriptionId: string): Promise<any> {
    return {
      avg_response_time: Math.random() * 200 + 50,
      error_rate: Math.random() * 2,
      throughput: Math.random() * 50 + 20
    };
  }

  private static async getActiveAlerts(subscriptionId: string): Promise<any[]> {
    try {
      const { data: alerts } = await supabase
        .from('analytics_alerts')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('status', 'active')
        .order('triggered_at', { ascending: false })
        .limit(10);

      return alerts || [];
    } catch (error) {
      console.error('Error getting active alerts:', error);
      return [];
    }
  }

  private static async getPerformanceWarnings(subscriptionId: string): Promise<any[]> {
    const metrics = await this.getLivePerformanceMetrics(subscriptionId);
    
    return metrics
      .filter(metric => metric.status === 'warning' || metric.current_value > metric.threshold * 0.8)
      .map(metric => ({
        type: 'performance_warning',
        metric: metric.metric_name,
        message: `${metric.metric_name} is approaching threshold`,
        current_value: metric.current_value,
        threshold: metric.threshold
      }));
  }

  /**
   * Cleanup resources
   */
  static cleanup(): void {
    this.subscribers.clear();
    this.eventBuffer.clear();
    this.alertRules.clear();
    this.isStreaming = false;
  }
}
