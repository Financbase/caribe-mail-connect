import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.119.0/node/crypto.ts";
import nacl from "npm:tweetnacl@1.0.3";
import { decode as base64Decode, encode as base64Encode } from "https://deno.land/std@0.224.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature, x-hub-signature-256, x-twilio-signature, x-twilio-email-event-webhook-signature, x-twilio-email-event-webhook-timestamp',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const serviceName = url.searchParams.get('service');

    if (!serviceName) {
      return new Response(JSON.stringify({ error: 'Service name required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const bodyText = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    const contentType = req.headers.get('content-type') || '';

    console.log(`Processing webhook for service: ${serviceName}`);

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(serviceName, bodyText, headers, url.toString(), contentType);
    if (!isValid) {
      console.log('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let webhookData: any;
    try {
      if (serviceName === 'twilio' && contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(bodyText);
        webhookData = Object.fromEntries(params.entries());
      } else {
        webhookData = JSON.parse(bodyText);
      }
    } catch (error) {
      console.log('Invalid payload');
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process webhook based on service
    let result;
    switch (serviceName) {
      case 'stripe':
        result = await processStripeWebhook(webhookData, supabaseClient);
        break;
      case 'paypal':
        result = await processPayPalWebhook(webhookData, supabaseClient);
        break;
      case 'ups':
        result = await processUPSWebhook(webhookData, supabaseClient);
        break;
      case 'fedex':
        result = await processFedExWebhook(webhookData, supabaseClient);
        break;
      case 'twilio':
        result = await processTwilioWebhook(webhookData, supabaseClient);
        break;
      case 'sendgrid':
        result = await processSendGridWebhook(webhookData, supabaseClient);
        break;
      default:
        result = { success: false, message: 'Unknown service' };
    }

    // Log webhook processing
    await supabaseClient
      .from('integration_logs')
      .insert({
        integration_id: null, // We could look this up based on service
        request_type: 'webhook',
        endpoint: serviceName,
        method: req.method,
        request_data: webhookData,
        response_data: result,
        status_code: result.success ? 200 : 400,
        error_message: result.success ? null : result.message
      });

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function verifyWebhookSignature(service: string, body: string, headers: any, requestUrl: string, contentType: string): Promise<boolean> {
  switch (service) {
    case 'stripe': {
      const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (!secret) return false;
      return verifyStripeSignature(body, headers['stripe-signature'], secret);
    }
    case 'github': {
      const secret = Deno.env.get('GITHUB_WEBHOOK_SECRET');
      if (!secret) return false;
      return verifyGitHubSignature(body, headers['x-hub-signature-256'], secret);
    }
    case 'twilio': {
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      if (!authToken) return false;
      const signature = headers['x-twilio-signature'];
      return verifyTwilioSignature(requestUrl, body, signature, authToken, contentType);
    }
    case 'sendgrid': {
      const publicKey = Deno.env.get('SENDGRID_WEBHOOK_PUBLIC_KEY');
      if (!publicKey) return false;
      const signature = headers['x-twilio-email-event-webhook-signature'];
      const timestamp = headers['x-twilio-email-event-webhook-timestamp'];
      return verifySendGridSignature(body, timestamp, signature, publicKey);
    }
    case 'paypal': {
      return false; // Disabled until certificate verification is implemented
    }
    default:
      return false; // Reject unknown/unverified services by default
  }
}

async function verifyStripeSignature(body: string, signature: string, secret?: string): Promise<boolean> {
  if (!signature || !secret) return false;

  try {
    const elements = signature.split(',');
    const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1];
    const sig = elements.find(el => el.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !sig) return false;

    const payload = `${timestamp}.${body}`;
    const expectedSig = createHmac('sha256', secret).update(payload).digest('hex');

    return sig === expectedSig;
  } catch (error) {
    console.error('Stripe signature verification failed:', error);
    return false;
  }
}

async function verifyPayPalSignature(body: string, headers: any, secret?: string): Promise<boolean> {
  // PayPal webhook verification would go here
  // This is more complex and involves certificate validation
  return false; // Disabled until implemented securely
}

async function verifyGitHubSignature(body: string, signature: string, secret?: string): Promise<boolean> {
  if (!signature || !secret) return false;

  try {
    const expectedSig = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
    return signature === expectedSig;
  } catch (error) {
    console.error('GitHub signature verification failed:', error);
    return false;
  }
}

function verifyTwilioSignature(requestUrl: string, body: string, signature: string, authToken: string, contentType: string): boolean {
  if (!signature || !authToken) return false;
  try {
    // Only support standard Twilio form-encoded webhooks
    if (!contentType.includes('application/x-www-form-urlencoded')) return false;
    const params = new URLSearchParams(body);
    const sortedKeys = Array.from(params.keys()).sort();
    let data = requestUrl;
    for (const key of sortedKeys) {
      data += key + params.get(key);
    }
    const mac = createHmac('sha1', authToken).update(data).digest();
    const expected = base64Encode(mac);
    return expected === signature;
  } catch (e) {
    console.error('Twilio signature verification failed:', e);
    return false;
  }
}

function verifySendGridSignature(body: string, timestamp: string, signature: string, publicKeyBase64: string): boolean {
  if (!timestamp || !signature || !publicKeyBase64) return false;
  try {
    const message = new TextEncoder().encode(timestamp + body);
    const sig = base64Decode(signature);
    const pub = base64Decode(publicKeyBase64);
    return nacl.sign.detached.verify(message, sig, pub);
  } catch (e) {
    console.error('SendGrid signature verification failed:', e);
    return false;
  }
}

async function processStripeWebhook(webhookData: any, supabaseClient: any) {
  const { type, data } = webhookData;

  switch (type) {
    case 'payment_intent.succeeded':
      return await handleStripePaymentSuccess(data.object, supabaseClient);
    case 'payment_intent.payment_failed':
      return await handleStripePaymentFailed(data.object, supabaseClient);
    case 'invoice.payment_succeeded':
      return await handleStripeInvoicePayment(data.object, supabaseClient);
    case 'customer.subscription.updated':
      return await handleStripeSubscriptionUpdate(data.object, supabaseClient);
    default:
      console.log(`Unhandled Stripe event: ${type}`);
      return { success: true, message: 'Event received but not processed' };
  }
}

async function processPayPalWebhook(webhookData: any, supabaseClient: any) {
  const { event_type, resource } = webhookData;

  switch (event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      return await handlePayPalPaymentCompleted(resource, supabaseClient);
    case 'PAYMENT.CAPTURE.DENIED':
      return await handlePayPalPaymentDenied(resource, supabaseClient);
    default:
      console.log(`Unhandled PayPal event: ${event_type}`);
      return { success: true, message: 'Event received but not processed' };
  }
}

async function processUPSWebhook(webhookData: any, supabaseClient: any) {
  // Process UPS tracking updates
  const { trackingNumber, statusCode, statusDescription } = webhookData;

  try {
    const { error } = await supabaseClient
      .from('packages')
      .update({
        status: mapUPSStatusCode(statusCode),
        tracking_history: webhookData,
        updated_at: new Date().toISOString()
      })
      .eq('tracking_number', trackingNumber);

    if (error) {
      return { success: false, message: `Failed to update package: ${error.message}` };
    }

    return { success: true, message: 'Package status updated' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function processFedExWebhook(webhookData: any, supabaseClient: any) {
  // Process FedEx tracking updates
  const { trackingNumber, eventType, eventDescription } = webhookData;

  try {
    const { error } = await supabaseClient
      .from('packages')
      .update({
        status: mapFedExEventType(eventType),
        tracking_history: webhookData,
        updated_at: new Date().toISOString()
      })
      .eq('tracking_number', trackingNumber);

    if (error) {
      return { success: false, message: `Failed to update package: ${error.message}` };
    }

    return { success: true, message: 'Package status updated' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function processTwilioWebhook(webhookData: any, supabaseClient: any) {
  // Process SMS delivery status updates
  const { MessageSid, MessageStatus, To } = webhookData;

  try {
    const { error } = await supabaseClient
      .from('notification_queue')
      .update({
        delivery_status: MessageStatus,
        updated_at: new Date().toISOString()
      })
      .eq('external_id', MessageSid);

    if (error) {
      return { success: false, message: `Failed to update notification: ${error.message}` };
    }

    return { success: true, message: 'Notification status updated' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function processSendGridWebhook(webhookData: any, supabaseClient: any) {
  // Process email delivery events
  if (!Array.isArray(webhookData)) {
    return { success: false, message: 'Invalid SendGrid webhook format' };
  }

  let processedCount = 0;
  const errors = [];

  for (const event of webhookData) {
    try {
      const { sg_message_id, event: eventType, email } = event;

      const { error } = await supabaseClient
        .from('notification_queue')
        .update({
          delivery_status: eventType,
          updated_at: new Date().toISOString()
        })
        .eq('external_id', sg_message_id);

      if (error) {
        errors.push(`Failed to update message ${sg_message_id}: ${error.message}`);
      } else {
        processedCount++;
      }
    } catch (error) {
      errors.push(`Error processing event: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    message: `Processed ${processedCount} events`,
    errors
  };
}

// Stripe webhook handlers
async function handleStripePaymentSuccess(paymentIntent: any, supabaseClient: any) {
  try {
    // Update payment record
    const { error } = await supabaseClient
      .from('payments')
      .upsert({
        external_id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: 'completed',
        customer_id: paymentIntent.metadata?.customer_id,
        payment_method: 'stripe',
        processed_at: new Date().toISOString(),
        metadata: paymentIntent.metadata
      });

    if (error) {
      return { success: false, message: `Failed to update payment: ${error.message}` };
    }

    // Update customer balance if applicable
    if (paymentIntent.metadata?.customer_id) {
      await supabaseClient
        .from('account_balances')
        .update({
          current_balance: 0, // Assuming payment clears balance
          last_payment_amount: paymentIntent.amount / 100,
          last_payment_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', paymentIntent.metadata.customer_id);
    }

    return { success: true, message: 'Payment processed successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function handleStripePaymentFailed(paymentIntent: any, supabaseClient: any) {
  try {
    const { error } = await supabaseClient
      .from('payments')
      .upsert({
        external_id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: 'failed',
        customer_id: paymentIntent.metadata?.customer_id,
        payment_method: 'stripe',
        processed_at: new Date().toISOString(),
        metadata: {
          ...paymentIntent.metadata,
          error: paymentIntent.last_payment_error?.message
        }
      });

    if (error) {
      return { success: false, message: `Failed to update payment: ${error.message}` };
    }

    return { success: true, message: 'Payment failure recorded' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function handleStripeInvoicePayment(invoice: any, supabaseClient: any) {
  try {
    // Update invoice status in our system
    const { error } = await supabaseClient
      .from('invoices')
      .update({
        status: 'paid',
        amount_paid: invoice.amount_paid / 100,
        updated_at: new Date().toISOString()
      })
      .eq('external_id', invoice.id);

    if (error) {
      return { success: false, message: `Failed to update invoice: ${error.message}` };
    }

    return { success: true, message: 'Invoice payment processed' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function handleStripeSubscriptionUpdate(subscription: any, supabaseClient: any) {
  try {
    // Update customer subscription status
    const { error } = await supabaseClient
      .from('customers')
      .update({
        subscription_status: subscription.status,
        subscription_id: subscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', subscription.customer);

    if (error) {
      return { success: false, message: `Failed to update subscription: ${error.message}` };
    }

    return { success: true, message: 'Subscription updated' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// PayPal webhook handlers
async function handlePayPalPaymentCompleted(resource: any, supabaseClient: any) {
  try {
    const { error } = await supabaseClient
      .from('payments')
      .upsert({
        external_id: resource.id,
        amount: parseFloat(resource.amount.value),
        status: 'completed',
        payment_method: 'paypal',
        processed_at: new Date().toISOString(),
        metadata: { paypal_data: resource }
      });

    if (error) {
      return { success: false, message: `Failed to update payment: ${error.message}` };
    }

    return { success: true, message: 'PayPal payment processed' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function handlePayPalPaymentDenied(resource: any, supabaseClient: any) {
  try {
    const { error } = await supabaseClient
      .from('payments')
      .upsert({
        external_id: resource.id,
        amount: parseFloat(resource.amount.value),
        status: 'failed',
        payment_method: 'paypal',
        processed_at: new Date().toISOString(),
        metadata: { paypal_data: resource, reason: 'denied' }
      });

    if (error) {
      return { success: false, message: `Failed to update payment: ${error.message}` };
    }

    return { success: true, message: 'PayPal payment denial recorded' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Status mapping functions
function mapUPSStatusCode(statusCode: string): string {
  const statusMap: { [key: string]: string } = {
    'I': 'in_transit',
    'D': 'delivered',
    'X': 'exception',
    'P': 'pickup'
  };
  return statusMap[statusCode] || 'unknown';
}

function mapFedExEventType(eventType: string): string {
  const eventMap: { [key: string]: string } = {
    'PU': 'pickup',
    'IT': 'in_transit',
    'OD': 'out_for_delivery',
    'DL': 'delivered',
    'EX': 'exception'
  };
  return eventMap[eventType] || 'unknown';
}