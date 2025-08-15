/**
 * Enhanced Analytics Types
 * Story 1.5: Advanced Analytics & Reporting
 * 
 * Comprehensive business intelligence, interactive dashboards, predictive analytics,
 * and data insights across subscriptions, customers, communications, packages, and financial performance
 */

// =====================================================
// CORE ANALYTICS TYPES
// =====================================================

export type AnalyticsTimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export type AnalyticsMetricType = 
  | 'count'
  | 'sum'
  | 'average'
  | 'percentage'
  | 'rate'
  | 'ratio'
  | 'trend'
  | 'distribution';

export type AnalyticsVisualizationType = 
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'donut_chart'
  | 'area_chart'
  | 'scatter_plot'
  | 'heatmap'
  | 'gauge'
  | 'table'
  | 'metric_card'
  | 'funnel'
  | 'sankey';

export type AnalyticsDimension = 
  | 'time'
  | 'customer_tier'
  | 'lifecycle_stage'
  | 'package_status'
  | 'carrier'
  | 'communication_channel'
  | 'subscription'
  | 'location'
  | 'device_type'
  | 'user_role';

// =====================================================
// UNIFIED ANALYTICS DASHBOARD
// =====================================================

export interface UnifiedAnalyticsDashboard {
  id: string;
  subscription_id: string;
  name: string;
  description?: string;
  
  // Dashboard configuration
  layout: DashboardLayout;
  widgets: AnalyticsWidget[];
  filters: DashboardFilter[];
  
  // Access control
  is_public: boolean;
  shared_with: string[]; // User IDs
  
  // Personalization
  user_preferences: Record<string, any>;
  default_time_range: AnalyticsTimeRange;
  auto_refresh_interval?: number; // minutes
  
  // Metadata
  category: 'executive' | 'operational' | 'financial' | 'customer' | 'package' | 'communication' | 'custom';
  tags: string[];
  
  // Analytics
  view_count: number;
  last_viewed_at?: string;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  grid_size: 'small' | 'medium' | 'large';
  responsive: boolean;
}

export interface AnalyticsWidget {
  id: string;
  dashboard_id: string;
  
  // Widget configuration
  title: string;
  description?: string;
  type: AnalyticsVisualizationType;
  
  // Position and size
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  // Data configuration
  data_source: AnalyticsDataSource;
  metrics: AnalyticsMetric[];
  dimensions: AnalyticsDimension[];
  filters: WidgetFilter[];
  
  // Visualization settings
  visualization_config: VisualizationConfig;
  
  // Interactivity
  drill_down_enabled: boolean;
  click_actions: WidgetAction[];
  
  // Refresh settings
  auto_refresh: boolean;
  refresh_interval?: number; // minutes
  
  // Conditional formatting
  conditional_formatting?: ConditionalFormatting[];
  
  created_at: string;
  updated_at: string;
}

export interface AnalyticsDataSource {
  type: 'subscription' | 'customer' | 'package' | 'communication' | 'financial' | 'custom_query';
  table: string;
  joins?: DataSourceJoin[];
  aggregation_level: 'raw' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface DataSourceJoin {
  table: string;
  type: 'inner' | 'left' | 'right' | 'full';
  on: string;
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  field: string;
  type: AnalyticsMetricType;
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct_count';
  format: MetricFormat;
  target_value?: number;
  benchmark_value?: number;
}

export interface MetricFormat {
  type: 'number' | 'currency' | 'percentage' | 'duration' | 'bytes';
  decimals: number;
  prefix?: string;
  suffix?: string;
  currency?: string;
}

export interface WidgetFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'contains';
  value: any;
  is_dynamic: boolean; // Can be changed by user
}

export interface VisualizationConfig {
  colors: string[];
  theme: 'light' | 'dark' | 'auto';
  show_legend: boolean;
  show_grid: boolean;
  show_labels: boolean;
  animation_enabled: boolean;
  custom_options: Record<string, any>;
}

export interface WidgetAction {
  type: 'drill_down' | 'filter' | 'navigate' | 'export';
  target?: string;
  parameters?: Record<string, any>;
}

export interface ConditionalFormatting {
  condition: {
    field: string;
    operator: string;
    value: any;
  };
  format: {
    color?: string;
    background_color?: string;
    font_weight?: 'normal' | 'bold';
    icon?: string;
  };
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'date_range' | 'select' | 'multi_select' | 'text' | 'number_range';
  field: string;
  default_value?: any;
  options?: FilterOption[];
  is_required: boolean;
  applies_to_widgets: string[]; // Widget IDs
}

export interface FilterOption {
  label: string;
  value: any;
}

// =====================================================
// BUSINESS INTELLIGENCE METRICS
// =====================================================

export interface BusinessIntelligenceMetrics {
  subscription_id: string;
  period_start: string;
  period_end: string;
  computed_at: string;
  
  // Executive KPIs
  executive_kpis: ExecutiveKPIs;
  
  // Operational metrics
  operational_metrics: OperationalMetrics;
  
  // Financial performance
  financial_performance: FinancialPerformance;
  
  // Customer intelligence
  customer_intelligence: CustomerIntelligence;
  
  // Package analytics
  package_analytics: PackageAnalytics;
  
  // Communication effectiveness
  communication_effectiveness: CommunicationEffectiveness;
  
  // Predictive insights
  predictive_insights: PredictiveInsights;
}

export interface ExecutiveKPIs {
  // Growth metrics
  revenue_growth_rate: number;
  customer_growth_rate: number;
  package_volume_growth: number;
  
  // Profitability
  gross_margin: number;
  net_profit_margin: number;
  customer_lifetime_value: number;
  customer_acquisition_cost: number;
  
  // Efficiency
  operational_efficiency_score: number;
  customer_satisfaction_score: number;
  employee_productivity_score: number;
  
  // Market position
  market_share_estimate: number;
  competitive_advantage_score: number;
}

export interface OperationalMetrics {
  // Package operations
  package_processing_efficiency: number;
  average_package_handling_time: number;
  storage_utilization_rate: number;
  delivery_success_rate: number;
  
  // Customer service
  customer_service_response_time: number;
  issue_resolution_rate: number;
  customer_effort_score: number;
  
  // System performance
  system_uptime: number;
  api_response_time: number;
  error_rate: number;
  
  // Staff productivity
  packages_per_employee: number;
  revenue_per_employee: number;
  customer_satisfaction_per_employee: number;
}

export interface FinancialPerformance {
  // Revenue streams
  mailbox_revenue: number;
  package_handling_revenue: number;
  delivery_revenue: number;
  additional_services_revenue: number;
  
  // Cost structure
  operational_costs: number;
  staff_costs: number;
  facility_costs: number;
  technology_costs: number;
  
  // Profitability analysis
  gross_profit: number;
  operating_profit: number;
  net_profit: number;
  ebitda: number;
  
  // Cash flow
  operating_cash_flow: number;
  free_cash_flow: number;
  
  // Financial ratios
  current_ratio: number;
  debt_to_equity: number;
  return_on_assets: number;
  return_on_equity: number;
}

export interface CustomerIntelligence {
  // Segmentation analysis
  customer_segments: CustomerSegmentAnalysis[];
  
  // Lifecycle metrics
  lifecycle_conversion_rates: Record<string, number>;
  average_lifecycle_duration: Record<string, number>;
  
  // Behavior analysis
  engagement_patterns: EngagementPattern[];
  usage_patterns: UsagePattern[];
  
  // Satisfaction and loyalty
  nps_score: number;
  customer_satisfaction_trend: TrendData[];
  churn_risk_distribution: ChurnRiskDistribution;
  
  // Value analysis
  customer_value_distribution: ValueDistribution[];
  high_value_customer_characteristics: CustomerCharacteristics;
}

export interface CustomerSegmentAnalysis {
  segment_name: string;
  customer_count: number;
  percentage_of_total: number;
  average_revenue: number;
  average_lifetime_value: number;
  satisfaction_score: number;
  growth_rate: number;
}

export interface EngagementPattern {
  pattern_name: string;
  frequency: number;
  customer_count: number;
  correlation_with_satisfaction: number;
}

export interface UsagePattern {
  pattern_name: string;
  average_packages_per_month: number;
  preferred_services: string[];
  seasonal_trends: SeasonalTrend[];
}

export interface TrendData {
  period: string;
  value: number;
  change_from_previous: number;
}

export interface ChurnRiskDistribution {
  low_risk: number;
  medium_risk: number;
  high_risk: number;
  critical_risk: number;
}

export interface ValueDistribution {
  value_range: string;
  customer_count: number;
  percentage: number;
  total_revenue: number;
}

export interface CustomerCharacteristics {
  common_attributes: string[];
  behavioral_patterns: string[];
  service_preferences: string[];
}

export interface SeasonalTrend {
  month: string;
  multiplier: number;
  confidence_level: number;
}

export interface PackageAnalytics {
  // Volume and trends
  total_packages: number;
  package_volume_trend: TrendData[];
  
  // Performance metrics
  average_processing_time: number;
  delivery_performance: DeliveryPerformance;
  
  // Carrier analysis
  carrier_performance: CarrierPerformance[];
  
  // Customer satisfaction
  package_satisfaction_scores: Record<string, number>;
}

export interface DeliveryPerformance {
  on_time_delivery_rate: number;
  average_delivery_time: number;
  delivery_success_rate: number;
  customer_pickup_rate: number;
}

export interface CarrierPerformance {
  carrier_name: string;
  package_count: number;
  average_delivery_time: number;
  success_rate: number;
  customer_satisfaction: number;
  cost_efficiency: number;
}

export interface CommunicationEffectiveness {
  // Channel performance
  channel_performance: ChannelPerformance[];
  
  // Campaign effectiveness
  campaign_metrics: CampaignMetrics[];
  
  // Customer engagement
  engagement_rates: EngagementRates;
  
  // ROI analysis
  communication_roi: number;
}

export interface ChannelPerformance {
  channel: string;
  messages_sent: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  cost_per_message: number;
  roi: number;
}

export interface CampaignMetrics {
  campaign_name: string;
  campaign_type: string;
  reach: number;
  engagement_rate: number;
  conversion_rate: number;
  roi: number;
}

export interface EngagementRates {
  overall_engagement: number;
  email_engagement: number;
  sms_engagement: number;
  whatsapp_engagement: number;
  push_engagement: number;
}

export interface PredictiveInsights {
  // Revenue forecasting
  revenue_forecast: ForecastData[];
  
  // Customer predictions
  churn_predictions: ChurnPrediction[];
  customer_growth_forecast: ForecastData[];
  
  // Operational predictions
  package_volume_forecast: ForecastData[];
  capacity_requirements: CapacityForecast[];
  
  // Market insights
  market_trends: MarketTrend[];
  competitive_analysis: CompetitiveInsight[];
}

export interface ForecastData {
  period: string;
  predicted_value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  confidence_level: number;
}

export interface ChurnPrediction {
  customer_id: string;
  churn_probability: number;
  risk_factors: string[];
  recommended_actions: string[];
  predicted_churn_date?: string;
}

export interface CapacityForecast {
  resource_type: string;
  current_capacity: number;
  predicted_demand: number;
  capacity_gap: number;
  recommended_action: string;
}

export interface MarketTrend {
  trend_name: string;
  impact_level: 'low' | 'medium' | 'high';
  probability: number;
  potential_impact: string;
  recommended_response: string;
}

export interface CompetitiveInsight {
  competitor_name: string;
  market_position: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

// =====================================================
// REAL-TIME ANALYTICS
// =====================================================

export interface RealTimeAnalytics {
  subscription_id: string;
  timestamp: string;
  
  // Live metrics
  active_users: number;
  packages_in_transit: number;
  pending_deliveries: number;
  system_health_score: number;
  
  // Performance indicators
  current_response_time: number;
  error_rate_last_hour: number;
  throughput_per_minute: number;
  
  // Business activity
  revenue_today: number;
  new_customers_today: number;
  packages_processed_today: number;
  communications_sent_today: number;
  
  // Alerts and notifications
  active_alerts: SystemAlert[];
  performance_warnings: PerformanceWarning[];
}

export interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface PerformanceWarning {
  metric: string;
  current_value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
  trend: 'improving' | 'stable' | 'degrading';
}

// =====================================================
// ANALYTICS API TYPES
// =====================================================

export interface AnalyticsQuery {
  data_source: AnalyticsDataSource;
  metrics: AnalyticsMetric[];
  dimensions: AnalyticsDimension[];
  filters: WidgetFilter[];
  time_range: {
    start: string;
    end: string;
  };
  limit?: number;
  offset?: number;
}

export interface AnalyticsQueryResult {
  data: Record<string, any>[];
  total_count: number;
  execution_time_ms: number;
  cache_hit: boolean;
  metadata: {
    columns: ColumnMetadata[];
    query_hash: string;
    generated_sql?: string;
  };
}

export interface ColumnMetadata {
  name: string;
  type: string;
  format?: MetricFormat;
}

export interface CreateDashboardRequest {
  name: string;
  description?: string;
  category: string;
  layout: DashboardLayout;
  widgets: Omit<AnalyticsWidget, 'id' | 'dashboard_id' | 'created_at' | 'updated_at'>[];
  filters: Omit<DashboardFilter, 'id'>[];
  is_public?: boolean;
  default_time_range?: AnalyticsTimeRange;
}

export interface UpdateDashboardRequest {
  name?: string;
  description?: string;
  layout?: DashboardLayout;
  widgets?: AnalyticsWidget[];
  filters?: DashboardFilter[];
  is_public?: boolean;
  default_time_range?: AnalyticsTimeRange;
}

export interface AnalyticsExportRequest {
  dashboard_id?: string;
  widget_id?: string;
  query?: AnalyticsQuery;
  format: 'csv' | 'excel' | 'pdf' | 'json';
  include_metadata?: boolean;
}

export interface AnalyticsExportResponse {
  download_url: string;
  file_size: number;
  expires_at: string;
}

// =====================================================
// ADVANCED ANALYTICS TYPES
// =====================================================

export interface AnomalyDetection {
  id: string;
  metric_type: string;
  timestamp: string;
  actual_value: number;
  expected_value: number;
  deviation_score: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  potential_causes: string[];
  recommended_actions: string[];
}

export interface TrendAnalysis {
  metric_name: string;
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  trend_strength: number;
  seasonality_detected: boolean;
  seasonality_pattern?: string;
  volatility_score: number;
  patterns_detected: string[];
  forecast_accuracy: number;
  confidence_level: number;
  insights: string[];
  recommendations: string[];
}

export interface BusinessForecast {
  scenario: 'optimistic' | 'realistic' | 'pessimistic';
  revenue_forecast: ForecastData[];
  customer_forecast: ForecastData[];
  package_forecast: ForecastData[];
  cost_forecast: ForecastData[];
  key_assumptions: string[];
  risk_factors: string[];
  confidence_level: number;
}

export interface PredictiveModel {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  model_type: 'regression' | 'classification' | 'time_series' | 'clustering';
  target_variable: string;
  features: string[];
  training_data_query: string;
  hyperparameters: Record<string, any>;
  status: 'training' | 'trained' | 'deployed' | 'failed';
  accuracy?: number;
  created_by: string;
  created_at: string;
  training_completed_at?: string;
}

export interface ModelTrainingRequest {
  name: string;
  description: string;
  model_type: 'regression' | 'classification' | 'time_series' | 'clustering';
  target_variable: string;
  features: string[];
  training_data_query: string;
  hyperparameters?: Record<string, any>;
  created_by: string;
}

export interface LiveMetric {
  type: string;
  value: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface StreamingEvent {
  id: string;
  subscription_id: string;
  event_type: string;
  event_data: any;
  timestamp: string;
  processed: boolean;
}

export interface AlertRule {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  metric_type: string;
  condition: 'greater_than' | 'less_than' | 'equals';
  threshold: number;
  alert_type: 'email' | 'sms' | 'webhook' | 'dashboard';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  is_active: boolean;
  created_at: string;
}

export interface PerformanceMetric {
  metric_name: string;
  current_value: number;
  threshold: number;
  status: 'good' | 'normal' | 'warning' | 'critical';
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: string;
}

export interface SystemHealth {
  overall_score: number;
  components: {
    database: number;
    api: number;
    storage: number;
    network: number;
  };
  last_updated: string;
}
