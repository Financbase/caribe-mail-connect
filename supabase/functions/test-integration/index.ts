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

    const { integrationId } = await req.json();
    console.log('Testing integration:', integrationId);

    // Get integration details
    const { data: integration, error: fetchError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch integration: ${fetchError.message}`);
    }

    const testResult = { success: false, message: '', responseTime: 0 };
    const startTime = Date.now();

    try {
      switch (integration.service_type) {
        case 'carrier':
          testResult = await testCarrierIntegration(integration);
          break;
        case 'payment':
          testResult = await testPaymentIntegration(integration);
          break;
        case 'accounting':
          testResult = await testAccountingIntegration(integration);
          break;
        case 'communication':
          testResult = await testCommunicationIntegration(integration);
          break;
        default:
          testResult = { success: false, message: 'Unknown service type', responseTime: 0 };
      }
    } catch (error) {
      testResult = { success: false, message: error.message, responseTime: 0 };
    }

    testResult.responseTime = Date.now() - startTime;

    // Update integration status
    await supabaseClient
      .from('integrations')
      .update({
        is_connected: testResult.success,
        last_error: testResult.success ? null : testResult.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', integrationId);

    // Log the test attempt
    await supabaseClient
      .from('integration_logs')
      .insert({
        integration_id: integrationId,
        request_type: 'test',
        status_code: testResult.success ? 200 : 400,
        response_data: testResult,
        execution_time_ms: testResult.responseTime,
        error_message: testResult.success ? null : testResult.message
      });

    return new Response(JSON.stringify(testResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error testing integration:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function testCarrierIntegration(integration: unknown) {
  const { service_name, credentials } = integration;
  
  switch (service_name) {
    case 'ups':
      return testUPSConnection(credentials);
    case 'fedex':
      return testFedExConnection(credentials);
    case 'usps':
      return testUSPSConnection(credentials);
    case 'dhl':
      return testDHLConnection(credentials);
    default:
      return { success: false, message: 'Unknown carrier service' };
  }
}

async function testPaymentIntegration(integration: unknown) {
  const { service_name, credentials } = integration;
  
  switch (service_name) {
    case 'stripe':
      return testStripeConnection(credentials);
    case 'paypal':
      return testPayPalConnection(credentials);
    case 'ath_movil':
      return testATHMovilConnection(credentials);
    default:
      return { success: false, message: 'Unknown payment service' };
  }
}

async function testAccountingIntegration(integration: unknown) {
  const { service_name, credentials } = integration;
  
  switch (service_name) {
    case 'quickbooks':
      return testQuickBooksConnection(credentials);
    case 'xero':
      return testXeroConnection(credentials);
    default:
      return { success: false, message: 'Unknown accounting service' };
  }
}

async function testCommunicationIntegration(integration: unknown) {
  const { service_name, credentials } = integration;
  
  switch (service_name) {
    case 'twilio':
      return testTwilioConnection(credentials);
    case 'sendgrid':
      return testSendGridConnection(credentials);
    case 'whatsapp':
      return testWhatsAppConnection(credentials);
    default:
      return { success: false, message: 'Unknown communication service' };
  }
}

// Individual service test functions
async function testUPSConnection(credentials: unknown) {
  try {
    const response = await fetch('https://onlinetools.ups.com/api/track/v1/details', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'UPS connection successful' : 'UPS connection failed' };
  } catch (error) {
    return { success: false, message: `UPS test failed: ${error.message}` };
  }
}

async function testFedExConnection(credentials: unknown) {
  try {
    // FedEx Web Services test endpoint
    const response = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trackingInfo: [{ trackingNumberInfo: { trackingNumber: 'TEST' } }] })
    });
    return { success: response.ok, message: response.ok ? 'FedEx connection successful' : 'FedEx connection failed' };
  } catch (error) {
    return { success: false, message: `FedEx test failed: ${error.message}` };
  }
}

async function testUSPSConnection(credentials: unknown) {
  try {
    const response = await fetch(`https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackRequest USERID="${credentials.user_id}"><TrackID ID="TEST"></TrackID></TrackRequest>`);
    return { success: response.ok, message: response.ok ? 'USPS connection successful' : 'USPS connection failed' };
  } catch (error) {
    return { success: false, message: `USPS test failed: ${error.message}` };
  }
}

async function testDHLConnection(credentials: unknown) {
  try {
    const response = await fetch('https://api-eu.dhl.com/track/shipments', {
      method: 'GET',
      headers: {
        'DHL-API-Key': credentials.api_key,
        'Content-Type': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'DHL connection successful' : 'DHL connection failed' };
  } catch (error) {
    return { success: false, message: `DHL test failed: ${error.message}` };
  }
}

async function testStripeConnection(credentials: unknown) {
  try {
    const response = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${credentials.secret_key}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return { success: response.ok, message: response.ok ? 'Stripe connection successful' : 'Stripe connection failed' };
  } catch (error) {
    return { success: false, message: `Stripe test failed: ${error.message}` };
  }
}

async function testPayPalConnection(credentials: unknown) {
  try {
    const authResponse = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${credentials.client_id}:${credentials.client_secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    return { success: authResponse.ok, message: authResponse.ok ? 'PayPal connection successful' : 'PayPal connection failed' };
  } catch (error) {
    return { success: false, message: `PayPal test failed: ${error.message}` };
  }
}

async function testATHMovilConnection(credentials: unknown) {
  try {
    // ATH Móvil test endpoint
    const response = await fetch('https://www.athmovil.com/api/business-account/ecommerce/status', {
      headers: {
        'Authorization': `Bearer ${credentials.api_key}`,
        'Content-Type': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'ATH Móvil connection successful' : 'ATH Móvil connection failed' };
  } catch (error) {
    return { success: false, message: `ATH Móvil test failed: ${error.message}` };
  }
}

async function testQuickBooksConnection(credentials: unknown) {
  try {
    const response = await fetch(`https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.company_id}/companyinfo/${credentials.company_id}`, {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Accept': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'QuickBooks connection successful' : 'QuickBooks connection failed' };
  } catch (error) {
    return { success: false, message: `QuickBooks test failed: ${error.message}` };
  }
}

async function testXeroConnection(credentials: unknown) {
  try {
    const response = await fetch('https://api.xero.com/api.xro/2.0/Organisation', {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Accept': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'Xero connection successful' : 'Xero connection failed' };
  } catch (error) {
    return { success: false, message: `Xero test failed: ${error.message}` };
  }
}

async function testTwilioConnection(credentials: unknown) {
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${credentials.account_sid}.json`, {
      headers: {
        'Authorization': `Basic ${btoa(`${credentials.account_sid}:${credentials.auth_token}`)}`,
        'Content-Type': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'Twilio connection successful' : 'Twilio connection failed' };
  } catch (error) {
    return { success: false, message: `Twilio test failed: ${error.message}` };
  }
}

async function testSendGridConnection(credentials: unknown) {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
      headers: {
        'Authorization': `Bearer ${credentials.api_key}`,
        'Content-Type': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'SendGrid connection successful' : 'SendGrid connection failed' };
  } catch (error) {
    return { success: false, message: `SendGrid test failed: ${error.message}` };
  }
}

async function testWhatsAppConnection(credentials: unknown) {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${credentials.phone_number_id}`, {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    return { success: response.ok, message: response.ok ? 'WhatsApp connection successful' : 'WhatsApp connection failed' };
  } catch (error) {
    return { success: false, message: `WhatsApp test failed: ${error.message}` };
  }
}