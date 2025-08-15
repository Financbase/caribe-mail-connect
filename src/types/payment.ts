/**
 * Payment and Billing Types
 * Story 1.1: Unified Payment Integration
 * 
 * Integrates Stripe subscription billing with existing ATH Móvil payments
 * and Epic 2 billing infrastructure for hybrid market support
 */

import type { Subscription } from './subscription';

// =====================================================
// PAYMENT METHOD TYPES
// =====================================================

export type PaymentMethodType = 'stripe' | 'ath_movil' | 'paypal' | 'bank_transfer' | 'cash';

export type PaymentStatus = 
  | 'pending'
  | 'processing' 
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export interface BasePaymentMethod {
  id: string;
  type: PaymentMethodType;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StripePaymentMethod extends BasePaymentMethod {
  type: 'stripe';
  stripe_payment_method_id: string;
  stripe_customer_id: string;
  card_last_four?: string;
  card_brand?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface ATHMovilPaymentMethod extends BasePaymentMethod {
  type: 'ath_movil';
  phone_number: string;
  account_name: string;
  is_verified: boolean;
}

export type PaymentMethod = StripePaymentMethod | ATHMovilPaymentMethod;

// =====================================================
// SUBSCRIPTION BILLING TYPES
// =====================================================

export type BillingInterval = 'month' | 'year';

export interface SubscriptionBilling {
  id: string;
  subscription_id: string;
  stripe_subscription_id?: string;
  
  // Billing configuration
  billing_interval: BillingInterval;
  billing_cycle_anchor?: string; // ISO date
  collection_method: 'charge_automatically' | 'send_invoice';
  
  // Payment method preferences
  default_payment_method_id?: string;
  backup_payment_method_id?: string;
  
  // Billing address
  billing_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  
  // Tax information
  tax_id?: string;
  tax_exempt: boolean;
  
  // Preferences
  invoice_settings: {
    days_until_due: number;
    default_payment_method?: string;
    footer?: string;
  };
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// ENHANCED PAYMENT TYPES (BUILDING ON EXISTING)
// =====================================================

export interface EnhancedPayment {
  // Existing payment fields (preserved)
  id: string;
  invoice_id?: string;
  customer_id: string;
  location_id: string;
  payment_number: string;
  amount: number;
  payment_method: PaymentMethodType;
  payment_date: string;
  reference_number?: string;
  notes?: string;
  processed_by?: string;
  status: PaymentStatus;
  stripe_payment_intent_id?: string;
  ath_movil_transaction_id?: string;
  created_at: string;
  updated_at: string;
  
  // New subscription context fields
  subscription_id?: string;
  subscription_billing_id?: string;
  billing_type: 'one_time' | 'subscription' | 'invoice';
  
  // Enhanced metadata
  metadata: {
    payment_source: 'subscription' | 'invoice' | 'manual';
    billing_period?: {
      start: string;
      end: string;
    };
    subscription_period?: {
      current_period_start: string;
      current_period_end: string;
    };
    [key: string]: any;
  };
}

// =====================================================
// ENHANCED INVOICE TYPES (BUILDING ON EXISTING)
// =====================================================

export interface EnhancedInvoice {
  // Existing invoice fields (preserved)
  id: string;
  invoice_number: string;
  customer_id: string;
  location_id: string;
  billing_period_start: string;
  billing_period_end: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_terms?: number;
  notes?: string;
  late_fee_applied?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  
  // New subscription context fields
  subscription_id?: string;
  subscription_billing_id?: string;
  stripe_invoice_id?: string;
  
  // Invoice type classification
  invoice_type: 'subscription' | 'one_time' | 'usage' | 'manual';
  
  // Enhanced line items
  line_items: InvoiceLineItem[];
  
  // Payment information
  payments: EnhancedPayment[];
  
  // Subscription-specific fields
  subscription_details?: {
    plan_name: string;
    billing_interval: BillingInterval;
    proration_details?: {
      proration_amount: number;
      proration_reason: string;
    };
  };
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  
  // Subscription context
  subscription_item_id?: string;
  price_id?: string;
  
  // Metadata
  metadata: {
    service_type?: string;
    billing_period?: {
      start: string;
      end: string;
    };
    [key: string]: any;
  };
}

// =====================================================
// PAYMENT PROCESSING TYPES
// =====================================================

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  payment_method_types: PaymentMethodType[];
  status: PaymentStatus;
  
  // Customer information
  customer_id: string;
  subscription_id?: string;
  
  // Payment method routing
  preferred_payment_method?: PaymentMethodType;
  fallback_payment_methods?: PaymentMethodType[];
  
  // Geographic routing
  customer_location: {
    country: string;
    state?: string;
    city?: string;
  };
  
  // Metadata
  metadata: {
    invoice_id?: string;
    subscription_billing_id?: string;
    billing_type: 'subscription' | 'one_time' | 'invoice';
    [key: string]: any;
  };
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// PAYMENT ROUTING LOGIC
// =====================================================

export interface PaymentRoutingConfig {
  // Geographic routing
  puerto_rico_customers: {
    primary: PaymentMethodType;
    fallback: PaymentMethodType[];
  };
  
  // Global customers
  international_customers: {
    primary: PaymentMethodType;
    fallback: PaymentMethodType[];
  };
  
  // Subscription vs one-time routing
  subscription_payments: {
    preferred_methods: PaymentMethodType[];
    auto_retry_enabled: boolean;
    retry_schedule: number[]; // Days between retries
  };
  
  // Minimum amounts for different methods
  minimum_amounts: {
    [key in PaymentMethodType]?: number;
  };
}

// =====================================================
// WEBHOOK TYPES
// =====================================================

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
    previous_attributes?: any;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key?: string;
  };
}

export interface ATHMovilWebhookEvent {
  id: string;
  type: 'payment.completed' | 'payment.failed' | 'payment.cancelled';
  data: {
    transaction_id: string;
    amount: number;
    status: string;
    customer_phone: string;
    merchant_reference: string;
    timestamp: string;
  };
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface PaymentResponse {
  success: boolean;
  payment?: EnhancedPayment;
  error?: string;
  requires_action?: boolean;
  client_secret?: string;
  redirect_url?: string;
}

export interface SubscriptionBillingResponse {
  subscription_billing: SubscriptionBilling;
  payment_methods: PaymentMethod[];
  upcoming_invoice?: EnhancedInvoice;
  payment_history: EnhancedPayment[];
}

export interface PaymentMethodResponse {
  payment_method: PaymentMethod;
  setup_intent_client_secret?: string;
  verification_required?: boolean;
}

// =====================================================
// BILLING ANALYTICS TYPES
// =====================================================

export interface BillingMetrics {
  // Revenue metrics
  monthly_recurring_revenue: number;
  annual_recurring_revenue: number;
  average_revenue_per_user: number;
  
  // Payment success rates
  payment_success_rate: number;
  payment_success_by_method: {
    [key in PaymentMethodType]?: number;
  };
  
  // Geographic breakdown
  revenue_by_region: {
    puerto_rico: number;
    international: number;
  };
  
  // Churn and retention
  churn_rate: number;
  retention_rate: number;
  
  // Failed payments
  failed_payment_rate: number;
  dunning_recovery_rate: number;
  
  period: {
    start: string;
    end: string;
  };
}
