/**
 * Enhanced Communication Types
 * Story 1.3: Unified Communication System
 * 
 * Comprehensive multi-channel communication system with customer preferences,
 * automated workflows, and subscription context integration
 */

import type { EnhancedCustomer, CustomerLifecycleStage } from './customer';

// =====================================================
// COMMUNICATION CHANNELS
// =====================================================

export type CommunicationChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app' | 'phone';

export type CommunicationStatus = 
  | 'draft'
  | 'scheduled'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'clicked'
  | 'failed'
  | 'bounced'
  | 'unsubscribed';

export type CommunicationPriority = 'low' | 'normal' | 'high' | 'urgent';

// =====================================================
// ENHANCED COMMUNICATION PREFERENCES
// =====================================================

export interface EnhancedCommunicationPreferences {
  // Channel preferences
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  push_notifications_enabled: boolean;
  phone_calls_enabled: boolean;
  
  // Language and localization
  preferred_language: 'en' | 'es';
  timezone: string;
  
  // Frequency preferences
  marketing_frequency: 'never' | 'weekly' | 'monthly' | 'quarterly';
  operational_notifications: boolean;
  package_notifications: boolean;
  billing_notifications: boolean;
  lifecycle_notifications: boolean;
  
  // Timing preferences
  preferred_contact_time: 'morning' | 'afternoon' | 'evening' | 'any';
  quiet_hours_start?: string; // HH:MM format
  quiet_hours_end?: string; // HH:MM format
  weekend_communications: boolean;
  
  // Channel-specific preferences
  email_format: 'html' | 'text';
  sms_short_format: boolean; // Prefer shorter SMS messages
  whatsapp_rich_media: boolean; // Allow images, documents in WhatsApp
  
  // Subscription preferences by type
  channel_preferences: {
    package_alerts: CommunicationChannel;
    billing_alerts: CommunicationChannel;
    marketing_messages: CommunicationChannel;
    support_messages: CommunicationChannel;
    lifecycle_messages: CommunicationChannel;
  };
  
  // Opt-out tracking
  opt_outs: {
    channel: CommunicationChannel;
    reason?: string;
    opted_out_at: string;
  }[];
}

// =====================================================
// COMMUNICATION TEMPLATES
// =====================================================

export interface CommunicationTemplate {
  id: string;
  name: string;
  description?: string;
  subscription_id: string;
  
  // Template classification
  category: CommunicationCategory;
  type: CommunicationType;
  channel: CommunicationChannel;
  language: 'en' | 'es';
  
  // Template content
  subject?: string; // For email
  content: string;
  variables: TemplateVariable[];
  
  // Template metadata
  is_active: boolean;
  is_default: boolean;
  version: number;
  
  // A/B testing
  variants?: TemplateVariant[];
  
  // Automation settings
  trigger_conditions?: TriggerCondition[];
  send_delay_minutes?: number;
  
  // Analytics
  usage_count: number;
  last_used_at?: string;
  
  // Audit fields
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by?: string;
}

export type CommunicationCategory = 
  | 'transactional'
  | 'marketing'
  | 'lifecycle'
  | 'support'
  | 'billing'
  | 'compliance';

export type CommunicationType =
  | 'welcome'
  | 'onboarding'
  | 'package_arrival'
  | 'package_ready'
  | 'package_delivered'
  | 'billing_reminder'
  | 'payment_confirmation'
  | 'subscription_renewal'
  | 'lifecycle_transition'
  | 'retention_campaign'
  | 'reactivation_campaign'
  | 'feedback_request'
  | 'support_response'
  | 'compliance_notice'
  | 'promotional'
  | 'newsletter';

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  required: boolean;
  default_value?: string;
  example_value: string;
}

export interface TemplateVariant {
  id: string;
  name: string;
  content: string;
  subject?: string;
  traffic_percentage: number;
  is_active: boolean;
  performance_metrics?: {
    sent_count: number;
    delivered_count: number;
    opened_count: number;
    clicked_count: number;
    conversion_count: number;
  };
}

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  logical_operator?: 'AND' | 'OR';
}

// =====================================================
// COMMUNICATION WORKFLOWS
// =====================================================

export interface CommunicationWorkflow {
  id: string;
  name: string;
  description?: string;
  subscription_id: string;
  
  // Workflow configuration
  trigger_type: WorkflowTriggerType;
  trigger_conditions: TriggerCondition[];
  
  // Workflow steps
  steps: WorkflowStep[];
  
  // Workflow settings
  is_active: boolean;
  max_executions_per_customer?: number;
  cooldown_period_hours?: number;
  
  // Analytics
  execution_count: number;
  success_rate: number;
  last_executed_at?: string;
  
  // Audit fields
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by?: string;
}

export type WorkflowTriggerType =
  | 'customer_created'
  | 'lifecycle_stage_changed'
  | 'package_status_changed'
  | 'payment_received'
  | 'payment_failed'
  | 'subscription_renewed'
  | 'subscription_cancelled'
  | 'inactivity_detected'
  | 'engagement_threshold'
  | 'manual_trigger'
  | 'scheduled';

export interface WorkflowStep {
  id: string;
  step_number: number;
  step_type: 'send_communication' | 'wait' | 'condition' | 'update_customer' | 'create_task';
  
  // Step configuration
  configuration: {
    template_id?: string;
    channel?: CommunicationChannel;
    wait_duration_hours?: number;
    conditions?: TriggerCondition[];
    customer_updates?: Record<string, any>;
    task_details?: {
      title: string;
      description: string;
      assigned_to?: string;
      due_date?: string;
    };
  };
  
  // Step flow control
  success_next_step?: number;
  failure_next_step?: number;
  condition_true_step?: number;
  condition_false_step?: number;
}

// =====================================================
// COMMUNICATION EXECUTION
// =====================================================

export interface CommunicationExecution {
  id: string;
  customer_id: string;
  subscription_id: string;
  
  // Communication details
  template_id?: string;
  workflow_id?: string;
  workflow_step_id?: string;
  
  // Channel and content
  channel: CommunicationChannel;
  type: CommunicationType;
  subject?: string;
  content: string;
  
  // Recipient information
  recipient_email?: string;
  recipient_phone?: string;
  recipient_whatsapp?: string;
  
  // Execution status
  status: CommunicationStatus;
  priority: CommunicationPriority;
  
  // Scheduling
  scheduled_at?: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  clicked_at?: string;
  failed_at?: string;
  
  // Provider information
  provider: 'resend' | 'twilio' | 'whatsapp_business' | 'internal';
  external_id?: string; // Provider's message ID
  
  // Error handling
  error_message?: string;
  retry_count: number;
  max_retries: number;
  
  // Analytics and tracking
  tracking_data?: {
    user_agent?: string;
    ip_address?: string;
    click_tracking_enabled: boolean;
    open_tracking_enabled: boolean;
  };
  
  // Metadata
  metadata: Record<string, any>;
  
  // Audit fields
  created_at: string;
  updated_at: string;
}

// =====================================================
// COMMUNICATION ANALYTICS
// =====================================================

export interface CommunicationAnalytics {
  id: string;
  subscription_id: string;
  period_start: string;
  period_end: string;
  
  // Overall metrics
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_failed: number;
  total_bounced: number;
  total_unsubscribed: number;
  
  // Channel breakdown
  channel_metrics: {
    [key in CommunicationChannel]?: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      failed: number;
      delivery_rate: number;
      open_rate: number;
      click_rate: number;
    };
  };
  
  // Type breakdown
  type_metrics: {
    [key in CommunicationType]?: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      conversion_rate: number;
    };
  };
  
  // Customer segment metrics
  segment_metrics: {
    customer_tier: {
      [tier: string]: {
        sent: number;
        engagement_rate: number;
      };
    };
    lifecycle_stage: {
      [stage in CustomerLifecycleStage]?: {
        sent: number;
        engagement_rate: number;
      };
    };
  };
  
  // Performance metrics
  average_delivery_time_minutes: number;
  peak_sending_hour: number;
  best_performing_template_id?: string;
  worst_performing_template_id?: string;
  
  // Cost metrics
  total_cost: number;
  cost_per_channel: {
    [key in CommunicationChannel]?: number;
  };
  
  computed_at: string;
}

// =====================================================
// API TYPES
// =====================================================

export interface SendCommunicationRequest {
  customer_id: string;
  template_id?: string;
  channel: CommunicationChannel;
  type: CommunicationType;
  subject?: string;
  content?: string;
  variables?: Record<string, any>;
  priority?: CommunicationPriority;
  scheduled_at?: string;
  metadata?: Record<string, any>;
}

export interface SendCommunicationResponse {
  success: boolean;
  execution_id?: string;
  message?: string;
  error?: string;
  estimated_delivery?: string;
}

export interface CommunicationListResponse {
  communications: CommunicationExecution[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface CommunicationStatsResponse {
  total_communications: number;
  sent_today: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  failed_rate: number;
  top_performing_channel: CommunicationChannel;
  recent_activity: CommunicationExecution[];
}
