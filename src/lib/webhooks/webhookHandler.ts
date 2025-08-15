/**
 * Webhook Infrastructure
 * API Discipline - Webhook Infrastructure
 * 
 * Build stateless webhook handlers for external service integrations
 */

import { supabase } from '@/integrations/supabase/client';
import crypto from 'crypto';

// =====================================================
// WEBHOOK TYPES
// =====================================================

export interface WebhookEvent {
  id: string;
  source: string;
  event_type: string;
  data: any;
  headers: Record<string, string>;
  raw_body: string;
  signature?: string;
  timestamp: string;
  processed: boolean;
  processed_at?: string;
  error?: string;
  retry_count: number;
}

export interface WebhookHandler {
  source: string;
  event_types: string[];
  handler: (event: WebhookEvent) => Promise<WebhookResult>;
  verify_signature?: (payload: string, signature: string, secret: string) => boolean;
}

export interface WebhookResult {
  success: boolean;
  message?: string;
  data?: any;
  should_retry?: boolean;
}

export interface WebhookConfig {
  source: string;
  endpoint: string;
  secret: string;
  enabled: boolean;
  retry_attempts: number;
  retry_delay_ms: number;
}

// =====================================================
// WEBHOOK MANAGER
// =====================================================

export class WebhookManager {
  private static instance: WebhookManager;
  private handlers: Map<string, WebhookHandler> = new Map();
  private configs: Map<string, WebhookConfig> = new Map();

  private constructor() {
    this.initializeHandlers();
  }

  static getInstance(): WebhookManager {
    if (!WebhookManager.instance) {
      WebhookManager.instance = new WebhookManager();
    }
    return WebhookManager.instance;
  }

  /**
   * Initialize webhook handlers
   */
  private initializeHandlers(): void {
    // Stripe webhook handler
    this.registerHandler({
      source: 'stripe',
      event_types: [
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'customer.created',
        'customer.updated'
      ],
      handler: this.handleStripeWebhook.bind(this),
      verify_signature: this.verifyStripeSignature.bind(this)
    });

    // FedEx webhook handler
    this.registerHandler({
      source: 'fedex',
      event_types: [
        'shipment.created',
        'shipment.updated',
        'shipment.delivered',
        'shipment.exception'
      ],
      handler: this.handleFedExWebhook.bind(this),
      verify_signature: this.verifyGenericSignature.bind(this)
    });

    // Twilio webhook handler
    this.registerHandler({
      source: 'twilio',
      event_types: [
        'message.delivered',
        'message.failed',
        'call.completed',
        'call.failed'
      ],
      handler: this.handleTwilioWebhook.bind(this),
      verify_signature: this.verifyTwilioSignature.bind(this)
    });

    // Generic webhook handler
    this.registerHandler({
      source: 'generic',
      event_types: ['*'],
      handler: this.handleGenericWebhook.bind(this)
    });
  }

  /**
   * Register webhook handler
   */
  registerHandler(handler: WebhookHandler): void {
    this.handlers.set(handler.source, handler);
    console.log(`Registered webhook handler for: ${handler.source}`);
  }

  /**
   * Process incoming webhook
   */
  async processWebhook(
    source: string,
    headers: Record<string, string>,
    body: string
  ): Promise<WebhookResult> {
    try {
      // Create webhook event record
      const event: WebhookEvent = {
        id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source,
        event_type: this.extractEventType(source, headers, body),
        data: this.parseWebhookData(body),
        headers,
        raw_body: body,
        signature: headers['x-signature'] || headers['stripe-signature'] || headers['x-twilio-signature'],
        timestamp: new Date().toISOString(),
        processed: false,
        retry_count: 0
      };

      // Store webhook event
      await this.storeWebhookEvent(event);

      // Get handler for source
      const handler = this.handlers.get(source) || this.handlers.get('generic');
      if (!handler) {
        throw new Error(`No handler found for webhook source: ${source}`);
      }

      // Verify signature if required
      const config = this.configs.get(source);
      if (config && handler.verify_signature && event.signature) {
        const isValid = handler.verify_signature(body, event.signature, config.secret);
        if (!isValid) {
          throw new Error('Invalid webhook signature');
        }
      }

      // Process webhook
      const result = await handler.handler(event);

      // Update event record
      await this.updateWebhookEvent(event.id, {
        processed: true,
        processed_at: new Date().toISOString(),
        error: result.success ? undefined : result.message
      });

      return result;

    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        should_retry: true
      };
    }
  }

  /**
   * Stripe webhook handler
   */
  private async handleStripeWebhook(event: WebhookEvent): Promise<WebhookResult> {
    try {
      const { type, data } = event.data;

      switch (type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(data.object);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(data.object);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(data.object);
          break;

        case 'customer.created':
          await this.handleCustomerCreated(data.object);
          break;

        case 'customer.updated':
          await this.handleCustomerUpdated(data.object);
          break;

        default:
          console.log(`Unhandled Stripe event type: ${type}`);
      }

      return { success: true, message: `Processed Stripe event: ${type}` };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Stripe webhook processing failed',
        should_retry: true
      };
    }
  }

  /**
   * FedEx webhook handler
   */
  private async handleFedExWebhook(event: WebhookEvent): Promise<WebhookResult> {
    try {
      const { eventType, shipment } = event.data;

      switch (eventType) {
        case 'shipment.created':
          await this.handleShipmentCreated(shipment);
          break;

        case 'shipment.updated':
          await this.handleShipmentUpdated(shipment);
          break;

        case 'shipment.delivered':
          await this.handleShipmentDelivered(shipment);
          break;

        case 'shipment.exception':
          await this.handleShipmentException(shipment);
          break;

        default:
          console.log(`Unhandled FedEx event type: ${eventType}`);
      }

      return { success: true, message: `Processed FedEx event: ${eventType}` };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'FedEx webhook processing failed',
        should_retry: true
      };
    }
  }

  /**
   * Twilio webhook handler
   */
  private async handleTwilioWebhook(event: WebhookEvent): Promise<WebhookResult> {
    try {
      const { MessageStatus, CallStatus, MessageSid, CallSid } = event.data;

      if (MessageStatus) {
        await this.handleTwilioMessageStatus(MessageSid, MessageStatus);
      }

      if (CallStatus) {
        await this.handleTwilioCallStatus(CallSid, CallStatus);
      }

      return { success: true, message: 'Processed Twilio webhook' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Twilio webhook processing failed',
        should_retry: true
      };
    }
  }

  /**
   * Generic webhook handler
   */
  private async handleGenericWebhook(event: WebhookEvent): Promise<WebhookResult> {
    try {
      // Log the webhook for debugging
      console.log(`Generic webhook received from ${event.source}:`, event.data);

      // Store in generic webhook log
      await supabase
        .from('webhook_logs')
        .insert({
          source: event.source,
          event_type: event.event_type,
          data: event.data,
          processed_at: new Date().toISOString()
        });

      return { success: true, message: 'Generic webhook logged' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Generic webhook processing failed'
      };
    }
  }

  // =====================================================
  // SIGNATURE VERIFICATION
  // =====================================================

  private verifyStripeSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const elements = signature.split(',');
      const signatureHash = elements.find(el => el.startsWith('v1='))?.split('=')[1];
      
      if (!signatureHash) return false;

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signatureHash, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('Error verifying Stripe signature:', error);
      return false;
    }
  }

  private verifyTwilioSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha1', secret)
        .update(payload, 'utf8')
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'base64'),
        Buffer.from(expectedSignature, 'base64')
      );
    } catch (error) {
      console.error('Error verifying Twilio signature:', error);
      return false;
    }
  }

  private verifyGenericSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Error verifying generic signature:', error);
      return false;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private extractEventType(source: string, headers: Record<string, string>, body: string): string {
    try {
      const data = JSON.parse(body);
      
      switch (source) {
        case 'stripe':
          return data.type || 'unknown';
        case 'fedex':
          return data.eventType || 'unknown';
        case 'twilio':
          return data.MessageStatus ? 'message.status' : data.CallStatus ? 'call.status' : 'unknown';
        default:
          return headers['x-event-type'] || 'unknown';
      }
    } catch (error) {
      return 'unknown';
    }
  }

  private parseWebhookData(body: string): any {
    try {
      return JSON.parse(body);
    } catch (error) {
      // If not JSON, return as form data or raw string
      try {
        const params = new URLSearchParams(body);
        return Object.fromEntries(params);
      } catch {
        return { raw: body };
      }
    }
  }

  private async storeWebhookEvent(event: WebhookEvent): Promise<void> {
    const { error } = await supabase
      .from('webhook_events')
      .insert(event);

    if (error) {
      console.error('Error storing webhook event:', error);
    }
  }

  private async updateWebhookEvent(id: string, updates: Partial<WebhookEvent>): Promise<void> {
    const { error } = await supabase
      .from('webhook_events')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating webhook event:', error);
    }
  }

  // =====================================================
  // BUSINESS LOGIC HANDLERS
  // =====================================================

  private async handleSubscriptionCreated(subscription: any): Promise<void> {
    // Update subscription in database
    await supabase
      .from('subscriptions')
      .upsert({
        stripe_subscription_id: subscription.id,
        customer_id: subscription.customer,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan_id: subscription.items.data[0]?.price?.id
      });
  }

  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        plan_id: subscription.items.data[0]?.price?.id
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  private async handleSubscriptionDeleted(subscription: any): Promise<void> {
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id);
  }

  private async handlePaymentSucceeded(invoice: any): Promise<void> {
    // Log successful payment
    await supabase
      .from('billing_records')
      .insert({
        stripe_invoice_id: invoice.id,
        subscription_id: invoice.subscription,
        amount: invoice.amount_paid,
        status: 'paid',
        paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString()
      });
  }

  private async handlePaymentFailed(invoice: any): Promise<void> {
    // Log failed payment and trigger dunning process
    await supabase
      .from('billing_records')
      .insert({
        stripe_invoice_id: invoice.id,
        subscription_id: invoice.subscription,
        amount: invoice.amount_due,
        status: 'failed',
        failure_reason: invoice.last_finalization_error?.message
      });
  }

  private async handleCustomerCreated(customer: any): Promise<void> {
    // Sync customer data
    await supabase
      .from('customers')
      .upsert({
        stripe_customer_id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone
      });
  }

  private async handleCustomerUpdated(customer: any): Promise<void> {
    await supabase
      .from('customers')
      .update({
        email: customer.email,
        name: customer.name,
        phone: customer.phone
      })
      .eq('stripe_customer_id', customer.id);
  }

  private async handleShipmentCreated(shipment: any): Promise<void> {
    // Update package with shipment info
    await supabase
      .from('packages')
      .update({
        tracking_number: shipment.trackingNumber,
        status: 'in_transit',
        shipped_at: new Date().toISOString()
      })
      .eq('id', shipment.packageId);
  }

  private async handleShipmentUpdated(shipment: any): Promise<void> {
    await supabase
      .from('packages')
      .update({
        status: shipment.status,
        location: shipment.currentLocation
      })
      .eq('tracking_number', shipment.trackingNumber);
  }

  private async handleShipmentDelivered(shipment: any): Promise<void> {
    await supabase
      .from('packages')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
        delivery_location: shipment.deliveryLocation
      })
      .eq('tracking_number', shipment.trackingNumber);
  }

  private async handleShipmentException(shipment: any): Promise<void> {
    await supabase
      .from('packages')
      .update({
        status: 'exception',
        exception_reason: shipment.exceptionReason
      })
      .eq('tracking_number', shipment.trackingNumber);
  }

  private async handleTwilioMessageStatus(messageSid: string, status: string): Promise<void> {
    await supabase
      .from('communications')
      .update({
        delivery_status: status,
        delivered_at: status === 'delivered' ? new Date().toISOString() : null
      })
      .eq('external_id', messageSid);
  }

  private async handleTwilioCallStatus(callSid: string, status: string): Promise<void> {
    await supabase
      .from('communications')
      .update({
        call_status: status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('external_id', callSid);
  }
}
