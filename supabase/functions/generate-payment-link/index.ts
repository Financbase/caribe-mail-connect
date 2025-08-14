import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { 
      amount, 
      currency = 'USD', 
      customerId, 
      description, 
      paymentMethod = 'stripe',
      metadata = {},
      expiresIn = 24 * 60 * 60 // 24 hours in seconds
    } = await req.json();

    console.log('Generating payment link:', { amount, currency, customerId, paymentMethod });

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid amount required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let paymentLink;
    let linkId;

    switch (paymentMethod) {
      case 'stripe': {
        const stripeResult = await generateStripePaymentLink(amount, currency, description, metadata, expiresIn);
        break;
      }
        paymentLink = stripeResult.url;
        linkId = stripeResult.id;
        break;
      case 'paypal': {
        const paypalResult = await generatePayPalPaymentLink(amount, currency, description, metadata);
        break;
      }
        paymentLink = paypalResult.url;
        linkId = paypalResult.id;
        break;
      case 'ath_movil': {
        const athResult = await generateATHMovilPaymentLink(amount, description, metadata);
        break;
      }
        paymentLink = athResult.url;
        linkId = athResult.id;
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unsupported payment method' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Store payment link in database
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
    
    const { data: savedLink, error: saveError } = await supabaseClient
      .from('payment_links')
      .insert({
        external_id: linkId,
        customer_id: customerId,
        amount,
        currency,
        payment_method: paymentMethod,
        description,
        url: paymentLink,
        status: 'active',
        expires_at: expiresAt,
        metadata
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving payment link:', saveError);
      return new Response(JSON.stringify({ error: 'Failed to save payment link' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      id: savedLink.id,
      url: paymentLink,
      expires_at: expiresAt,
      amount,
      currency,
      payment_method: paymentMethod
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating payment link:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateStripePaymentLink(amount: number, currency: string, description: string, metadata: unknown, expiresIn: number) {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  
  if (!stripeSecretKey) {
    throw new Error('Stripe secret key not configured');
  }

  // Create a Stripe Payment Link
  const response = await fetch('https://api.stripe.com/v1/payment_links', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'line_items[0][price_data][currency]': currency.toLowerCase(),
      'line_items[0][price_data][product_data][name]': description || 'Payment',
      'line_items[0][price_data][unit_amount]': (amount * 100).toString(), // Convert to cents
      'line_items[0][quantity]': '1',
      'metadata[customer_id]': metadata.customer_id || '',
      'metadata[invoice_id]': metadata.invoice_id || '',
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': metadata.success_url || 'https://your-domain.com/payment/success'
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Stripe API error: ${errorData}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    url: data.url
  };
}

async function generatePayPalPaymentLink(amount: number, currency: string, description: string, metadata: unknown) {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  // Get access token
  const authResponse = await fetch('https://api.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const authData = await authResponse.json();
  
  // Create payment
  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    transactions: [{
      amount: {
        total: amount.toFixed(2),
        currency: currency
      },
      description: description || 'Payment'
    }],
    redirect_urls: {
      return_url: metadata.success_url || 'https://your-domain.com/payment/success',
      cancel_url: metadata.cancel_url || 'https://your-domain.com/payment/cancel'
    }
  };

  const paymentResponse = await fetch('https://api.paypal.com/v1/payments/payment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!paymentResponse.ok) {
    const errorData = await paymentResponse.text();
    throw new Error(`PayPal API error: ${errorData}`);
  }

  const payment = await paymentResponse.json();
  const approvalUrl = payment.links.find((link: unknown) => link.rel === 'approval_url')?.href;

  return {
    id: payment.id,
    url: approvalUrl
  };
}

async function generateATHMovilPaymentLink(amount: number, description: string, metadata: unknown) {
  const apiKey = Deno.env.get('ATH_MOVIL_API_KEY');
  const merchantId = Deno.env.get('ATH_MOVIL_MERCHANT_ID');
  
  if (!apiKey || !merchantId) {
    throw new Error('ATH Móvil credentials not configured');
  }

  // Create ATH Móvil payment request
  const paymentData = {
    merchantId,
    amount: amount.toFixed(2),
    description: description || 'Pago',
    metadata: {
      ...metadata,
      reference: `PAY-${Date.now()}`
    }
  };

  const response = await fetch('https://www.athmovil.com/api/business-account/ecommerce/payment-request', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`ATH Móvil API error: ${errorData}`);
  }

  const data = await response.json();
  
  return {
    id: data.transactionId,
    url: data.paymentUrl
  };
}

// Helper function to validate payment link status
async function validatePaymentLinkStatus(linkId: string, paymentMethod: string) {
  switch (paymentMethod) {
    case 'stripe':
      return await validateStripePaymentLink(linkId);
    case 'paypal':
      return await validatePayPalPaymentLink(linkId);
    case 'ath_movil':
      return await validateATHMovilPaymentLink(linkId);
    default:
      return { valid: false, status: 'unknown' };
  }
}

async function validateStripePaymentLink(linkId: string) {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  
  if (!stripeSecretKey) {
    return { valid: false, status: 'configuration_error' };
  }

  try {
    const response = await fetch(`https://api.stripe.com/v1/payment_links/${linkId}`, {
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { valid: true, status: data.active ? 'active' : 'inactive' };
    } else {
      return { valid: false, status: 'not_found' };
    }
  } catch (error) {
    return { valid: false, status: 'error' };
  }
}

async function validatePayPalPaymentLink(linkId: string) {
  // PayPal payment validation logic
  return { valid: true, status: 'active' }; // Simplified
}

async function validateATHMovilPaymentLink(linkId: string) {
  // ATH Móvil payment validation logic
  return { valid: true, status: 'active' }; // Simplified
}