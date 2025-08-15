/**
 * Unified Communication Service
 * Story 1.3: Unified Communication System
 * 
 * Comprehensive multi-channel communication service with intelligent routing,
 * customer preferences, and provider management
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  CommunicationChannel,
  CommunicationTemplate,
  CommunicationWorkflow,
  CommunicationExecution,
  SendCommunicationRequest,
  SendCommunicationResponse,
  CommunicationAnalytics,
  EnhancedCommunicationPreferences
} from '@/types/communication';
import type { EnhancedCustomer } from '@/types/customer';
import { SaaSLifecycleAutomationService } from './saasLifecycleAutomation';
import { SaaSTemplatesService } from './saasTemplates';

// =====================================================
// COMMUNICATION SERVICE
// =====================================================

export class CommunicationService {
  
  /**
   * Send communication to customer with intelligent channel routing
   */
  static async sendCommunication(request: SendCommunicationRequest): Promise<SendCommunicationResponse> {
    try {
      // Get customer and their preferences
      const customer = await this.getCustomerWithPreferences(request.customer_id);
      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }

      // Determine optimal channel if not specified
      const channel = request.channel || await this.getOptimalChannel(customer, request.type);
      
      // Validate channel is enabled for customer
      if (!this.isChannelEnabled(customer, channel)) {
        return { success: false, error: `Channel ${channel} is disabled for this customer` };
      }

      // Get or create template
      let template: CommunicationTemplate | null = null;
      if (request.template_id) {
        template = await this.getTemplate(request.template_id);
      } else if (request.content) {
        // Use provided content directly
      } else {
        template = await this.getDefaultTemplate(customer.subscription_id!, request.type, channel, customer.communication_preferences.preferred_language);
      }

      // Prepare communication content
      const content = request.content || (template ? this.renderTemplate(template, request.variables || {}) : '');
      const subject = request.subject || template?.subject;

      // Create communication execution record
      const execution = await this.createExecution({
        customer_id: request.customer_id,
        subscription_id: customer.subscription_id!,
        template_id: template?.id,
        channel,
        type: request.type,
        subject,
        content,
        recipient_email: channel === 'email' ? customer.email : undefined,
        recipient_phone: channel === 'sms' ? customer.phone : undefined,
        recipient_whatsapp: channel === 'whatsapp' ? customer.phone : undefined,
        priority: request.priority || 'normal',
        scheduled_at: request.scheduled_at,
        metadata: request.metadata || {}
      });

      if (!execution) {
        return { success: false, error: 'Failed to create communication execution' };
      }

      // Send via appropriate provider
      const result = await this.sendViaProvider(execution, customer);
      
      return {
        success: result.success,
        execution_id: execution.id,
        message: result.message,
        error: result.error,
        estimated_delivery: result.estimated_delivery
      };

    } catch (error) {
      console.error('Error sending communication:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send communication'
      };
    }
  }

  /**
   * Get customer with communication preferences
   */
  private static async getCustomerWithPreferences(customerId: string): Promise<EnhancedCustomer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error || !data) return null;

      return data as EnhancedCustomer;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  }

  /**
   * Determine optimal communication channel for customer
   */
  private static async getOptimalChannel(
    customer: EnhancedCustomer, 
    type: string
  ): Promise<CommunicationChannel> {
    const preferences = customer.communication_preferences as EnhancedCommunicationPreferences;
    
    // Check channel preferences by message type
    if (preferences?.channel_preferences) {
      switch (type) {
        case 'package_arrival':
        case 'package_ready':
        case 'package_delivered':
          return preferences.channel_preferences.package_alerts || 'email';
        case 'billing_reminder':
        case 'payment_confirmation':
          return preferences.channel_preferences.billing_alerts || 'email';
        case 'promotional':
        case 'newsletter':
          return preferences.channel_preferences.marketing_messages || 'email';
        case 'support_response':
          return preferences.channel_preferences.support_messages || 'email';
        default:
          return preferences.channel_preferences.package_alerts || 'email';
      }
    }

    // Fallback to enabled channels in priority order
    if (preferences?.whatsapp_enabled) return 'whatsapp';
    if (preferences?.email_enabled) return 'email';
    if (preferences?.sms_enabled) return 'sms';
    
    return 'email'; // Final fallback
  }

  /**
   * Check if channel is enabled for customer
   */
  private static isChannelEnabled(customer: EnhancedCustomer, channel: CommunicationChannel): boolean {
    const preferences = customer.communication_preferences as EnhancedCommunicationPreferences;
    
    switch (channel) {
      case 'email':
        return preferences?.email_enabled !== false;
      case 'sms':
        return preferences?.sms_enabled === true;
      case 'whatsapp':
        return preferences?.whatsapp_enabled === true;
      case 'push':
        return preferences?.push_notifications_enabled === true;
      default:
        return true;
    }
  }

  /**
   * Get communication template
   */
  static async getTemplate(templateId: string): Promise<CommunicationTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('id', templateId)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return data as CommunicationTemplate;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  /**
   * Get default template for type, channel, and language
   */
  static async getDefaultTemplate(
    subscriptionId: string,
    type: string,
    channel: CommunicationChannel,
    language: 'en' | 'es'
  ): Promise<CommunicationTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('type', type)
        .eq('channel', channel)
        .eq('language', language)
        .eq('is_active', true)
        .eq('is_default', true)
        .single();

      if (error || !data) {
        // Fallback to English if Spanish not found
        if (language === 'es') {
          return this.getDefaultTemplate(subscriptionId, type, channel, 'en');
        }
        return null;
      }

      return data as CommunicationTemplate;
    } catch (error) {
      console.error('Error fetching default template:', error);
      return null;
    }
  }

  /**
   * Render template with variables
   */
  private static renderTemplate(template: CommunicationTemplate, variables: Record<string, any>): string {
    let content = template.content;
    
    // Replace template variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, String(value));
    });

    return content;
  }

  /**
   * Create communication execution record
   */
  private static async createExecution(executionData: Partial<CommunicationExecution>): Promise<CommunicationExecution | null> {
    try {
      const { data, error } = await supabase
        .from('customer_communications')
        .insert({
          customer_id: executionData.customer_id,
          subscription_id: executionData.subscription_id,
          type: executionData.type,
          channel: executionData.channel,
          subject: executionData.subject,
          content: executionData.content,
          recipient_email: executionData.recipient_email,
          recipient_phone: executionData.recipient_phone,
          recipient_whatsapp: executionData.recipient_whatsapp,
          priority: executionData.priority || 'normal',
          status: 'queued',
          scheduled_at: executionData.scheduled_at,
          metadata: executionData.metadata || {},
          retry_count: 0,
          max_retries: 3
        })
        .select()
        .single();

      if (error) throw error;

      return data as CommunicationExecution;
    } catch (error) {
      console.error('Error creating execution:', error);
      return null;
    }
  }

  /**
   * Send communication via appropriate provider
   */
  private static async sendViaProvider(
    execution: CommunicationExecution, 
    customer: EnhancedCustomer
  ): Promise<{ success: boolean; message?: string; error?: string; estimated_delivery?: string }> {
    try {
      // Get active provider for channel
      const provider = await this.getActiveProvider(customer.subscription_id!, execution.channel);
      if (!provider) {
        return { success: false, error: `No active provider found for ${execution.channel}` };
      }

      // Update execution status
      await this.updateExecutionStatus(execution.id, 'sending');

      // Send via Edge Function
      const { data, error } = await supabase.functions.invoke('send-communication', {
        body: {
          execution_id: execution.id,
          provider: provider.provider_name,
          channel: execution.channel,
          recipient: this.getRecipientForChannel(execution, execution.channel),
          subject: execution.subject,
          content: execution.content,
          metadata: execution.metadata
        }
      });

      if (error) {
        await this.updateExecutionStatus(execution.id, 'failed', error.message);
        return { success: false, error: error.message };
      }

      // Update execution with provider response
      await this.updateExecutionWithProviderResponse(execution.id, data);

      return {
        success: true,
        message: 'Communication sent successfully',
        estimated_delivery: data.estimated_delivery
      };

    } catch (error) {
      console.error('Error sending via provider:', error);
      await this.updateExecutionStatus(execution.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
      return { success: false, error: 'Failed to send communication' };
    }
  }

  /**
   * Get active provider for channel
   */
  private static async getActiveProvider(subscriptionId: string, channel: CommunicationChannel) {
    try {
      const { data, error } = await supabase
        .from('communication_providers')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('channel', channel)
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .limit(1)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error fetching provider:', error);
      return null;
    }
  }

  /**
   * Get recipient address for channel
   */
  private static getRecipientForChannel(execution: CommunicationExecution, channel: CommunicationChannel): string {
    switch (channel) {
      case 'email':
        return execution.recipient_email || '';
      case 'sms':
      case 'whatsapp':
        return execution.recipient_phone || execution.recipient_whatsapp || '';
      default:
        return '';
    }
  }

  /**
   * Update execution status
   */
  private static async updateExecutionStatus(
    executionId: string, 
    status: string, 
    errorMessage?: string
  ): Promise<void> {
    try {
      const updateData: any = { status };
      
      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
      } else if (status === 'failed') {
        updateData.failed_at = new Date().toISOString();
        if (errorMessage) {
          updateData.error_message = errorMessage;
        }
      }

      await supabase
        .from('customer_communications')
        .update(updateData)
        .eq('id', executionId);
    } catch (error) {
      console.error('Error updating execution status:', error);
    }
  }

  /**
   * Update execution with provider response
   */
  private static async updateExecutionWithProviderResponse(
    executionId: string, 
    providerResponse: any
  ): Promise<void> {
    try {
      await supabase
        .from('customer_communications')
        .update({
          external_id: providerResponse.external_id,
          provider: providerResponse.provider,
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', executionId);
    } catch (error) {
      console.error('Error updating execution with provider response:', error);
    }
  }

  /**
   * Get communication analytics
   */
  static async getAnalytics(
    subscriptionId: string,
    startDate: string,
    endDate: string
  ): Promise<CommunicationAnalytics | null> {
    try {
      const { data, error } = await supabase
        .from('communication_analytics')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('period_start', startDate)
        .eq('period_end', endDate)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Compute analytics if not cached
        return await this.computeAnalytics(subscriptionId, startDate, endDate);
      }

      return data as CommunicationAnalytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  /**
   * Compute communication analytics
   */
  private static async computeAnalytics(
    subscriptionId: string,
    startDate: string,
    endDate: string
  ): Promise<CommunicationAnalytics | null> {
    try {
      // Get communication data for period
      const { data: communications, error } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      // Compute metrics
      const analytics = this.calculateAnalyticsMetrics(communications || [], subscriptionId, startDate, endDate);

      // Cache analytics
      await supabase
        .from('communication_analytics')
        .upsert(analytics);

      return analytics;
    } catch (error) {
      console.error('Error computing analytics:', error);
      return null;
    }
  }

  /**
   * Calculate analytics metrics from communication data
   */
  private static calculateAnalyticsMetrics(
    communications: any[],
    subscriptionId: string,
    startDate: string,
    endDate: string
  ): CommunicationAnalytics {
    const totalSent = communications.filter(c => c.status === 'sent' || c.status === 'delivered').length;
    const totalDelivered = communications.filter(c => c.status === 'delivered').length;
    const totalOpened = communications.filter(c => c.status === 'read').length;
    const totalFailed = communications.filter(c => c.status === 'failed').length;

    // Channel breakdown
    const channelMetrics: any = {};
    ['email', 'sms', 'whatsapp'].forEach(channel => {
      const channelComms = communications.filter(c => c.channel === channel);
      const sent = channelComms.filter(c => c.status === 'sent' || c.status === 'delivered').length;
      const delivered = channelComms.filter(c => c.status === 'delivered').length;
      const opened = channelComms.filter(c => c.status === 'read').length;
      
      channelMetrics[channel] = {
        sent,
        delivered,
        opened,
        failed: channelComms.filter(c => c.status === 'failed').length,
        delivery_rate: sent > 0 ? (delivered / sent) * 100 : 0,
        open_rate: delivered > 0 ? (opened / delivered) * 100 : 0
      };
    });

    return {
      id: '', // Will be generated by database
      subscription_id: subscriptionId,
      period_start: startDate,
      period_end: endDate,
      total_sent: totalSent,
      total_delivered: totalDelivered,
      total_opened: totalOpened,
      total_clicked: 0, // Would need click tracking
      total_failed: totalFailed,
      total_bounced: 0, // Would need bounce tracking
      total_unsubscribed: 0, // Would need unsubscribe tracking
      channel_metrics: channelMetrics,
      type_metrics: {},
      segment_metrics: {},
      average_delivery_time_minutes: 0,
      peak_sending_hour: new Date().getHours(),
      total_cost: 0,
      cost_per_channel: {},
      computed_at: new Date().toISOString()
    };
  }

  // =====================================================
  // SAAS LIFECYCLE AUTOMATION INTEGRATION
  // =====================================================

  /**
   * Initialize SaaS lifecycle automation for a subscription
   */
  static async initializeSaaSLifecycle(subscriptionId: string): Promise<boolean> {
    try {
      // Initialize default workflows
      const workflowsInitialized = await SaaSLifecycleAutomationService.initializeDefaultWorkflows(subscriptionId);

      // Initialize default templates
      const templatesInitialized = await SaaSTemplatesService.initializeDefaultTemplates(subscriptionId);

      return workflowsInitialized && templatesInitialized;
    } catch (error) {
      console.error('Error initializing SaaS lifecycle automation:', error);
      return false;
    }
  }

  /**
   * Trigger SaaS lifecycle event
   */
  static async triggerLifecycleEvent(
    subscriptionId: string,
    customerId: string,
    eventType: string,
    eventData: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      // Record the lifecycle event
      const { error: eventError } = await supabase
        .from('saas_lifecycle_events')
        .insert({
          subscription_id: subscriptionId,
          customer_id: customerId,
          event_type: eventType,
          event_data: eventData,
          occurred_at: new Date().toISOString()
        });

      if (eventError) throw eventError;

      // Trigger automation workflows
      const automationTriggered = await SaaSLifecycleAutomationService.executeTrigger(
        subscriptionId,
        eventType as any,
        customerId,
        eventData
      );

      return automationTriggered;
    } catch (error) {
      console.error('Error triggering lifecycle event:', error);
      return false;
    }
  }

  /**
   * Send SaaS lifecycle communication
   */
  static async sendLifecycleCommunication(
    customerId: string,
    subscriptionId: string,
    communicationType: string,
    channel: CommunicationChannel = 'email',
    variables: Record<string, any> = {}
  ): Promise<SendCommunicationResponse> {
    try {
      // Get customer for language preference
      const customer = await this.getCustomerWithPreferences(customerId);
      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }

      const language = customer.communication_preferences?.language || 'en';

      // Get appropriate template
      const template = await SaaSTemplatesService.getTemplate(
        subscriptionId,
        communicationType,
        channel,
        language as 'en' | 'es'
      );

      if (!template) {
        return { success: false, error: `Template not found for type: ${communicationType}` };
      }

      // Render template with variables
      const renderedContent = SaaSTemplatesService.renderTemplate(template, {
        customer_name: customer.first_name,
        customer_email: customer.email,
        ...variables
      });

      // Send communication
      return await this.sendCommunication({
        customer_id: customerId,
        channel,
        type: communicationType as any,
        subject: template.subject,
        content: renderedContent,
        metadata: {
          template_id: template.id,
          lifecycle_automation: true,
          variables
        }
      });
    } catch (error) {
      console.error('Error sending lifecycle communication:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update customer engagement metrics
   */
  static async updateEngagementMetrics(
    customerId: string,
    subscriptionId: string,
    engagementData: {
      email_opened?: boolean;
      email_clicked?: boolean;
      sms_responded?: boolean;
      login_occurred?: boolean;
      feature_used?: string;
    }
  ): Promise<boolean> {
    try {
      const currentPeriod = {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      };

      // Get or create engagement metrics for current period
      const { data: existingMetrics, error: fetchError } = await supabase
        .from('customer_engagement_metrics')
        .select('*')
        .eq('customer_id', customerId)
        .eq('subscription_id', subscriptionId)
        .gte('period_start', currentPeriod.start.toISOString())
        .lte('period_end', currentPeriod.end.toISOString())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const updates: any = {
        updated_at: new Date().toISOString()
      };

      if (engagementData.email_opened) {
        updates.emails_opened = (existingMetrics?.emails_opened || 0) + 1;
      }

      if (engagementData.email_clicked) {
        updates.emails_clicked = (existingMetrics?.emails_clicked || 0) + 1;
      }

      if (engagementData.sms_responded) {
        updates.sms_responded = (existingMetrics?.sms_responded || 0) + 1;
      }

      if (engagementData.login_occurred) {
        updates.last_login_at = new Date().toISOString();
        updates.login_count = (existingMetrics?.login_count || 0) + 1;
      }

      if (engagementData.feature_used) {
        const featuresUsed = existingMetrics?.features_used || [];
        if (!featuresUsed.includes(engagementData.feature_used)) {
          updates.features_used = [...featuresUsed, engagementData.feature_used];
        }

        const featureUsageCount = existingMetrics?.feature_usage_count || {};
        updates.feature_usage_count = {
          ...featureUsageCount,
          [engagementData.feature_used]: (featureUsageCount[engagementData.feature_used] || 0) + 1
        };
      }

      if (existingMetrics) {
        // Update existing metrics
        const { error: updateError } = await supabase
          .from('customer_engagement_metrics')
          .update(updates)
          .eq('id', existingMetrics.id);

        if (updateError) throw updateError;
      } else {
        // Create new metrics record
        const { error: insertError } = await supabase
          .from('customer_engagement_metrics')
          .insert({
            customer_id: customerId,
            subscription_id: subscriptionId,
            period_start: currentPeriod.start.toISOString(),
            period_end: currentPeriod.end.toISOString(),
            ...updates
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error updating engagement metrics:', error);
      return false;
    }
  }

  /**
   * Calculate and update churn risk score
   */
  static async calculateChurnRisk(customerId: string): Promise<number> {
    try {
      // This would use the database function we created
      const { data, error } = await supabase
        .rpc('calculate_churn_risk_score', { customer_uuid: customerId });

      if (error) throw error;

      const churnRisk = data || 0;

      // Update the engagement metrics with the new churn risk score
      const currentPeriod = {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      };

      await supabase
        .from('customer_engagement_metrics')
        .update({ churn_risk_score: churnRisk })
        .eq('customer_id', customerId)
        .gte('period_start', currentPeriod.start.toISOString())
        .lte('period_end', currentPeriod.end.toISOString());

      // Trigger churn prevention workflow if risk is high
      if (churnRisk > 0.7) {
        const { data: customer } = await supabase
          .from('customers')
          .select('subscription_id')
          .eq('id', customerId)
          .single();

        if (customer) {
          await this.triggerLifecycleEvent(
            customer.subscription_id,
            customerId,
            'high_churn_risk_detected',
            { churn_risk_score: churnRisk }
          );
        }
      }

      return churnRisk;
    } catch (error) {
      console.error('Error calculating churn risk:', error);
      return 0;
    }
  }
}
