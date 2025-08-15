/**
 * Billing Edge Cases Service
 * Story 6: Billing Integration - Edge Cases Handler
 * 
 * Handles complex billing scenarios: failed payments, plan changes,
 * cancellations, refunds, and subscription lifecycle management
 */

import { supabase } from '@/integrations/supabase/client';
import { StripeService } from './stripe';
import { EntitlementService } from './entitlements';
import type { SubscriptionPlanTier } from '@/types/subscription';

// =====================================================
// BILLING EDGE CASES TYPES
// =====================================================

export interface FailedPaymentHandler {
  subscription_id: string;
  invoice_id: string;
  attempt_count: number;
  next_retry_date: string;
  grace_period_end: string;
  notification_sent: boolean;
}

export interface PlanChangeRequest {
  subscription_id: string;
  current_plan: SubscriptionPlanTier;
  target_plan: SubscriptionPlanTier;
  change_type: 'upgrade' | 'downgrade';
  effective_date: string;
  proration_amount?: number;
}

export interface CancellationRequest {
  subscription_id: string;
  cancellation_reason: string;
  cancel_at_period_end: boolean;
  refund_requested: boolean;
  feedback?: string;
}

export interface RefundRequest {
  payment_id: string;
  amount: number;
  reason: string;
  refund_type: 'full' | 'partial';
  status: 'pending' | 'approved' | 'denied' | 'processed';
}

// =====================================================
// BILLING EDGE CASES SERVICE
// =====================================================

export class BillingEdgeCasesService {

  /**
   * Handle failed payment
   */
  static async handleFailedPayment(
    subscriptionId: string,
    invoiceId: string,
    attemptCount: number = 1
  ): Promise<boolean> {
    try {
      console.log(`Handling failed payment for subscription ${subscriptionId}, attempt ${attemptCount}`);

      // Get subscription details
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (subError || !subscription) {
        throw new Error('Subscription not found');
      }

      // Calculate grace period (7 days for first failure, 3 days for subsequent)
      const gracePeriodDays = attemptCount === 1 ? 7 : 3;
      const gracePeriodEnd = new Date();
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);

      // Calculate next retry date (1 day, 3 days, 7 days)
      const retryDays = attemptCount === 1 ? 1 : attemptCount === 2 ? 3 : 7;
      const nextRetryDate = new Date();
      nextRetryDate.setDate(nextRetryDate.getDate() + retryDays);

      // Record failed payment attempt
      const { error: insertError } = await supabase
        .from('failed_payment_attempts')
        .insert({
          subscription_id: subscriptionId,
          invoice_id: invoiceId,
          attempt_count: attemptCount,
          next_retry_date: nextRetryDate.toISOString(),
          grace_period_end: gracePeriodEnd.toISOString(),
          notification_sent: false,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Update subscription status if needed
      if (attemptCount >= 3) {
        // Suspend subscription after 3 failed attempts
        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);

        // Downgrade to free plan
        await EntitlementService.updateSubscriptionEntitlements(subscriptionId, 'free');
      }

      // Send notification to customer
      await this.sendFailedPaymentNotification(subscriptionId, attemptCount, gracePeriodEnd);

      return true;
    } catch (error) {
      console.error('Error handling failed payment:', error);
      return false;
    }
  }

  /**
   * Handle plan change request
   */
  static async handlePlanChange(
    subscriptionId: string,
    targetPlan: SubscriptionPlanTier,
    effectiveDate?: Date
  ): Promise<PlanChangeRequest | null> {
    try {
      console.log(`Processing plan change for subscription ${subscriptionId} to ${targetPlan}`);

      // Get current subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (subError || !subscription) {
        throw new Error('Subscription not found');
      }

      const currentPlan = subscription.plan_tier;
      const changeType = this.getChangeType(currentPlan, targetPlan);
      const effective = effectiveDate || new Date();

      // Calculate proration if upgrading mid-cycle
      let prorationAmount = 0;
      if (changeType === 'upgrade') {
        prorationAmount = await this.calculateProration(subscription, targetPlan);
      }

      // Create plan change request
      const planChangeRequest: PlanChangeRequest = {
        subscription_id: subscriptionId,
        current_plan: currentPlan,
        target_plan: targetPlan,
        change_type: changeType,
        effective_date: effective.toISOString(),
        proration_amount: prorationAmount
      };

      // Record plan change request
      const { error: insertError } = await supabase
        .from('plan_change_requests')
        .insert({
          ...planChangeRequest,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Process the change immediately for downgrades at period end
      if (changeType === 'downgrade') {
        await this.schedulePlanChangeAtPeriodEnd(subscriptionId, targetPlan);
      } else {
        // Process upgrade immediately
        await this.processImmediatePlanChange(subscriptionId, targetPlan);
      }

      return planChangeRequest;
    } catch (error) {
      console.error('Error handling plan change:', error);
      return null;
    }
  }

  /**
   * Handle subscription cancellation
   */
  static async handleCancellation(
    subscriptionId: string,
    cancellationData: {
      reason: string;
      cancelAtPeriodEnd: boolean;
      refundRequested: boolean;
      feedback?: string;
    }
  ): Promise<CancellationRequest | null> {
    try {
      console.log(`Processing cancellation for subscription ${subscriptionId}`);

      // Get subscription details
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (subError || !subscription) {
        throw new Error('Subscription not found');
      }

      const cancellationRequest: CancellationRequest = {
        subscription_id: subscriptionId,
        cancellation_reason: cancellationData.reason,
        cancel_at_period_end: cancellationData.cancelAtPeriodEnd,
        refund_requested: cancellationData.refundRequested,
        feedback: cancellationData.feedback
      };

      // Record cancellation request
      const { error: insertError } = await supabase
        .from('cancellation_requests')
        .insert({
          ...cancellationRequest,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Cancel subscription in Stripe
      if (subscription.stripe_subscription_id) {
        await StripeService.cancelSubscription(
          subscription.stripe_subscription_id,
          cancellationData.cancelAtPeriodEnd
        );
      }

      // Update subscription status
      const newStatus = cancellationData.cancelAtPeriodEnd ? 'cancel_at_period_end' : 'canceled';
      await supabase
        .from('subscriptions')
        .update({
          status: newStatus,
          canceled_at: cancellationData.cancelAtPeriodEnd ? null : new Date().toISOString(),
          cancel_at_period_end: cancellationData.cancelAtPeriodEnd,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      // Process refund if requested
      if (cancellationData.refundRequested) {
        await this.processRefundRequest(subscriptionId, 'cancellation');
      }

      // Send cancellation confirmation
      await this.sendCancellationConfirmation(subscriptionId, cancellationRequest);

      return cancellationRequest;
    } catch (error) {
      console.error('Error handling cancellation:', error);
      return null;
    }
  }

  /**
   * Process refund request
   */
  static async processRefundRequest(
    subscriptionId: string,
    reason: string,
    amount?: number
  ): Promise<RefundRequest | null> {
    try {
      console.log(`Processing refund request for subscription ${subscriptionId}`);

      // Get latest payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (paymentError || !payment) {
        throw new Error('No eligible payment found for refund');
      }

      const refundAmount = amount || payment.amount;
      const refundType = amount && amount < payment.amount ? 'partial' : 'full';

      const refundRequest: RefundRequest = {
        payment_id: payment.id,
        amount: refundAmount,
        reason,
        refund_type: refundType,
        status: 'pending'
      };

      // Record refund request
      const { error: insertError } = await supabase
        .from('refund_requests')
        .insert({
          ...refundRequest,
          subscription_id: subscriptionId,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Process refund in Stripe (if applicable)
      if (payment.stripe_payment_intent_id) {
        // This would integrate with Stripe refunds API
        console.log(`Processing Stripe refund for payment ${payment.stripe_payment_intent_id}`);
      }

      // Update refund status
      await supabase
        .from('refund_requests')
        .update({
          status: 'approved',
          processed_at: new Date().toISOString()
        })
        .eq('payment_id', payment.id);

      return { ...refundRequest, status: 'approved' };
    } catch (error) {
      console.error('Error processing refund request:', error);
      return null;
    }
  }

  /**
   * Handle subscription reactivation
   */
  static async handleReactivation(subscriptionId: string): Promise<boolean> {
    try {
      console.log(`Reactivating subscription ${subscriptionId}`);

      // Get subscription details
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (subError || !subscription) {
        throw new Error('Subscription not found');
      }

      // Reactivate in Stripe if needed
      if (subscription.stripe_subscription_id) {
        // This would reactivate the Stripe subscription
        console.log(`Reactivating Stripe subscription ${subscription.stripe_subscription_id}`);
      }

      // Update subscription status
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          canceled_at: null,
          cancel_at_period_end: false,
          reactivated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      // Restore entitlements
      await EntitlementService.updateSubscriptionEntitlements(
        subscriptionId,
        subscription.plan_tier
      );

      // Clear failed payment attempts
      await supabase
        .from('failed_payment_attempts')
        .delete()
        .eq('subscription_id', subscriptionId);

      return true;
    } catch (error) {
      console.error('Error handling reactivation:', error);
      return false;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static getChangeType(
    currentPlan: SubscriptionPlanTier,
    targetPlan: SubscriptionPlanTier
  ): 'upgrade' | 'downgrade' {
    const planHierarchy = { 'free': 0, 'professional': 1, 'enterprise': 2 };
    const currentLevel = planHierarchy[currentPlan] || 0;
    const targetLevel = planHierarchy[targetPlan] || 0;
    
    return targetLevel > currentLevel ? 'upgrade' : 'downgrade';
  }

  private static async calculateProration(
    subscription: any,
    targetPlan: SubscriptionPlanTier
  ): Promise<number> {
    // Mock proration calculation - would integrate with actual pricing
    const planPrices = {
      'free': 0,
      'professional': 29,
      'enterprise': 99
    };

    const currentPrice = planPrices[subscription.plan_tier] || 0;
    const targetPrice = planPrices[targetPlan] || 0;
    const priceDifference = targetPrice - currentPrice;

    // Calculate days remaining in current period
    const periodEnd = new Date(subscription.current_period_end);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const totalDays = 30; // Assume 30-day billing cycle

    return Math.round((priceDifference * daysRemaining / totalDays) * 100) / 100;
  }

  private static async schedulePlanChangeAtPeriodEnd(
    subscriptionId: string,
    targetPlan: SubscriptionPlanTier
  ): Promise<void> {
    // Schedule plan change for end of current period
    await supabase
      .from('scheduled_plan_changes')
      .insert({
        subscription_id: subscriptionId,
        target_plan: targetPlan,
        scheduled_for: new Date(), // Would calculate actual period end
        status: 'scheduled',
        created_at: new Date().toISOString()
      });
  }

  private static async processImmediatePlanChange(
    subscriptionId: string,
    targetPlan: SubscriptionPlanTier
  ): Promise<void> {
    // Update subscription immediately
    await supabase
      .from('subscriptions')
      .update({
        plan_tier: targetPlan,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);

    // Update entitlements
    await EntitlementService.updateSubscriptionEntitlements(subscriptionId, targetPlan);
  }

  private static async sendFailedPaymentNotification(
    subscriptionId: string,
    attemptCount: number,
    gracePeriodEnd: Date
  ): Promise<void> {
    // Send notification to customer about failed payment
    console.log(`Sending failed payment notification for subscription ${subscriptionId}, attempt ${attemptCount}`);
    
    // This would integrate with the communication system
    // to send email/SMS notifications to the customer
  }

  private static async sendCancellationConfirmation(
    subscriptionId: string,
    cancellationRequest: CancellationRequest
  ): Promise<void> {
    // Send cancellation confirmation to customer
    console.log(`Sending cancellation confirmation for subscription ${subscriptionId}`);
    
    // This would integrate with the communication system
    // to send confirmation email to the customer
  }
}
