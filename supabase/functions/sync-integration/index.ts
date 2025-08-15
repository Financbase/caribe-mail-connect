import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Sentry } from "../_shared/sentry.ts"; // 2025-08-13: error tracking

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
    console.log('Syncing integration:', integrationId);

    // Get integration details
    const { data: integration, error: fetchError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch integration: ${fetchError.message}`);
    }

    const syncResult = { success: false, message: '', recordsProcessed: 0, errors: [] };
    const startTime = Date.now();

    try {
      switch (integration.service_type) {
        case 'carrier':
          syncResult = await syncCarrierData(integration, supabaseClient);
          break;
        case 'payment':
          syncResult = await syncPaymentData(integration, supabaseClient);
          break;
        case 'accounting':
          syncResult = await syncAccountingData(integration, supabaseClient);
          break;
        case 'communication':
          syncResult = await syncCommunicationData(integration, supabaseClient);
          break;
        default:
          syncResult = { success: false, message: 'Unknown service type', recordsProcessed: 0, errors: [] };
      }
    } catch (error) {
      syncResult = { success: false, message: error.message, recordsProcessed: 0, errors: [error.message] };
    }

    const executionTime = Date.now() - startTime;

    // Update integration sync status
    await supabaseClient
      .from('integrations')
      .update({
        last_sync_at: new Date().toISOString(),
        last_error: syncResult.success ? null : syncResult.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', integrationId);

    // Log the sync attempt
    await supabaseClient
      .from('integration_logs')
      .insert({
        integration_id: integrationId,
        request_type: 'sync',
        status_code: syncResult.success ? 200 : 500,
        response_data: { ...syncResult, executionTime },
        execution_time_ms: executionTime,
        error_message: syncResult.success ? null : syncResult.message
      });

    return new Response(JSON.stringify(syncResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error syncing integration:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncCarrierData(integration: unknown, supabaseClient: unknown) {
  const { service_name, credentials } = integration;
  
  // Get packages that need tracking updates
  const { data: packages, error } = await supabaseClient
    .from('packages')
    .select('*')
    .in('status', ['in_transit', 'out_for_delivery'])
    .not('tracking_number', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch packages: ${error.message}`);
  }

  let updatedCount = 0;
  const errors = [];

  for (const pkg of packages) {
    try {
      let trackingData;
      
      switch (service_name) {
        case 'ups':
          trackingData = await fetchUPSTracking(pkg.tracking_number, credentials);
          break;
        case 'fedex':
          trackingData = await fetchFedExTracking(pkg.tracking_number, credentials);
          break;
        case 'usps':
          trackingData = await fetchUSPSTracking(pkg.tracking_number, credentials);
          break;
        case 'dhl':
          trackingData = await fetchDHLTracking(pkg.tracking_number, credentials);
          break;
        default:
          continue;
      }

      if (trackingData && trackingData.status !== pkg.status) {
        await supabaseClient
          .from('packages')
          .update({
            status: trackingData.status,
            tracking_history: trackingData.history,
            updated_at: new Date().toISOString()
          })
          .eq('id', pkg.id);
        
        updatedCount++;
      }
    } catch (error) {
      errors.push(`Failed to update ${pkg.tracking_number}: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    message: `Updated ${updatedCount} packages`,
    recordsProcessed: packages.length,
    errors
  };
}

async function syncPaymentData(integration: unknown, supabaseClient: unknown) {
  const { service_name, credentials } = integration;
  
  // Sync recent payment transactions
  let paymentData;
  
  switch (service_name) {
    case 'stripe':
      paymentData = await fetchStripePayments(credentials);
      break;
    case 'paypal':
      paymentData = await fetchPayPalPayments(credentials);
      break;
    default:
      return { success: false, message: 'Unknown payment service', recordsProcessed: 0, errors: [] };
  }

  // Update payment records in database
  let updatedCount = 0;
  const errors = [];

  for (const payment of paymentData) {
    try {
      const { error } = await supabaseClient
        .from('payments')
        .upsert({
          external_id: payment.id,
          amount: payment.amount,
          status: payment.status,
          customer_id: payment.customer_id,
          payment_method: service_name,
          processed_at: payment.created,
          metadata: payment.metadata
        });

      if (error) {
        errors.push(`Failed to sync payment ${payment.id}: ${error.message}`);
      } else {
        updatedCount++;
      }
    } catch (error) {
      errors.push(`Error processing payment ${payment.id}: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    message: `Synced ${updatedCount} payments`,
    recordsProcessed: paymentData.length,
    errors
  };
}

async function syncAccountingData(integration: unknown, supabaseClient: unknown) {
  const { service_name, credentials } = integration;
  
  // Get recent invoices to sync
  const { data: invoices, error } = await supabaseClient
    .from('invoices')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }

  let syncedCount = 0;
  const errors = [];

  for (const invoice of invoices) {
    try {
      let result;
      
      switch (service_name) {
        case 'quickbooks':
          result = await syncToQuickBooks(invoice, credentials);
          break;
        case 'xero':
          result = await syncToXero(invoice, credentials);
          break;
        default:
          continue;
      }

      if (result.success) {
        await supabaseClient
          .from('invoices')
          .update({
            external_id: result.externalId,
            sync_status: 'synced',
            synced_at: new Date().toISOString()
          })
          .eq('id', invoice.id);
        
        syncedCount++;
      } else {
        errors.push(`Failed to sync invoice ${invoice.invoice_number}: ${result.error}`);
      }
    } catch (error) {
      errors.push(`Error syncing invoice ${invoice.invoice_number}: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    message: `Synced ${syncedCount} invoices`,
    recordsProcessed: invoices.length,
    errors
  };
}

async function syncCommunicationData(integration: unknown, supabaseClient: unknown) {
  const { service_name, credentials } = integration;
  
  // Sync delivery status for sent notifications
  const { data: notifications, error } = await supabaseClient
    .from('notification_queue')
    .select('*')
    .eq('status', 'sent')
    .is('delivery_status', null)
    .not('external_id', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  let updatedCount = 0;
  const errors = [];

  for (const notification of notifications) {
    try {
      let deliveryStatus;
      
      switch (service_name) {
        case 'twilio':
          deliveryStatus = await fetchTwilioDeliveryStatus(notification.external_id, credentials);
          break;
        case 'sendgrid':
          deliveryStatus = await fetchSendGridDeliveryStatus(notification.external_id, credentials);
          break;
        default:
          continue;
      }

      if (deliveryStatus) {
        await supabaseClient
          .from('notification_queue')
          .update({
            delivery_status: deliveryStatus.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', notification.id);
        
        updatedCount++;
      }
    } catch (error) {
      errors.push(`Failed to update notification ${notification.id}: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    message: `Updated ${updatedCount} notifications`,
    recordsProcessed: notifications.length,
    errors
  };
}

// Carrier tracking functions
async function fetchUPSTracking(trackingNumber: string, credentials: unknown) {
  const response = await fetch(`https://onlinetools.ups.com/api/track/v1/details/${trackingNumber}`, {
    headers: {
      'Authorization': `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return {
    status: mapUPSStatus(data.trackResponse?.shipment?.[0]?.package?.[0]?.currentStatus?.type),
    history: data.trackResponse?.shipment?.[0]?.package?.[0]?.activity || []
  };
}

async function fetchFedExTracking(trackingNumber: string, credentials: unknown) {
  const response = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      trackingInfo: [{ trackingNumberInfo: { trackingNumber } }]
    })
  });
  
  if (!response.ok) return null;
  
  const data = await response.json();
  const trackingInfo = data.output?.completeTrackResults?.[0]?.trackResults?.[0];
  
  return {
    status: mapFedExStatus(trackingInfo?.latestStatusDetail?.code),
    history: trackingInfo?.scanEvents || []
  };
}

async function fetchUSPSTracking(trackingNumber: string, credentials: unknown) {
  const response = await fetch(`https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackRequest USERID="${credentials.user_id}"><TrackID ID="${trackingNumber}"></TrackID></TrackRequest>`);
  
  if (!response.ok) return null;
  
  const text = await response.text();
  // Parse XML response and extract tracking data
  return parseUSPSTrackingXML(text);
}

async function fetchDHLTracking(trackingNumber: string, credentials: unknown) {
  const response = await fetch(`https://api-eu.dhl.com/track/shipments?trackingNumber=${trackingNumber}`, {
    headers: {
      'DHL-API-Key': credentials.api_key,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) return null;
  
  const data = await response.json();
  const shipment = data.shipments?.[0];
  
  return {
    status: mapDHLStatus(shipment?.status?.statusCode),
    history: shipment?.events || []
  };
}

// Payment data fetching
async function fetchStripePayments(credentials: unknown) {
  const response = await fetch('https://api.stripe.com/v1/payment_intents?limit=50', {
    headers: {
      'Authorization': `Bearer ${credentials.secret_key}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  if (!response.ok) return [];
  
  const data = await response.json();
  return data.data.map((payment: unknown) => ({
    id: payment.id,
    amount: payment.amount / 100, // Convert from cents
    status: payment.status,
    customer_id: payment.metadata?.customer_id,
    created: new Date(payment.created * 1000).toISOString(),
    metadata: payment.metadata
  }));
}

async function fetchPayPalPayments(credentials: unknown) {
  // Get access token first
  const authResponse = await fetch('https://api.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${credentials.client_id}:${credentials.client_secret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const authData = await authResponse.json();
  
  const response = await fetch('https://api.paypal.com/v1/payments/payment', {
    headers: {
      'Authorization': `Bearer ${authData.access_token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) return [];
  
  const data = await response.json();
  return data.payments?.map((payment: unknown) => ({
    id: payment.id,
    amount: parseFloat(payment.transactions?.[0]?.amount?.total || '0'),
    status: payment.state,
    customer_id: payment.payer?.payer_info?.email,
    created: payment.create_time,
    metadata: { paypal_id: payment.id }
  })) || [];
}

// Accounting sync functions
async function syncToQuickBooks(invoice: unknown, credentials: unknown) {
  try {
    const qbInvoice = {
      Line: invoice.items?.map((item: unknown) => ({
        Amount: item.line_total,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: { value: "1", name: item.description },
          UnitPrice: item.unit_price,
          Qty: item.quantity
        }
      })) || [],
      CustomerRef: { value: invoice.customer_id }
    };

    const response = await fetch(`https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.company_id}/invoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qbInvoice)
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, externalId: data.QueryResponse?.Invoice?.[0]?.Id };
    } else {
      return { success: false, error: await response.text() };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function syncToXero(invoice: unknown, credentials: unknown) {
  try {
    const xeroInvoice = {
      Type: "ACCREC",
      Contact: { ContactID: invoice.customer_id },
      Date: invoice.issue_date,
      DueDate: invoice.due_date,
      LineItems: invoice.items?.map((item: unknown) => ({
        Description: item.description,
        Quantity: item.quantity,
        UnitAmount: item.unit_price,
        AccountCode: "200"
      })) || []
    };

    const response = await fetch('https://api.xero.com/api.xro/2.0/Invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Invoices: [xeroInvoice] })
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, externalId: data.Invoices?.[0]?.InvoiceID };
    } else {
      return { success: false, error: await response.text() };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Communication delivery status functions
async function fetchTwilioDeliveryStatus(messageId: string, credentials: unknown) {
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${credentials.account_sid}/Messages/${messageId}.json`, {
    headers: {
      'Authorization': `Basic ${btoa(`${credentials.account_sid}:${credentials.auth_token}`)}`
    }
  });
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return { status: data.status };
}

async function fetchSendGridDeliveryStatus(messageId: string, credentials: unknown) {
  const response = await fetch(`https://api.sendgrid.com/v3/messages/${messageId}`, {
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`
    }
  });
  
  if (!response.ok) return null;
  
  const data = await response.json();
  return { status: data.status };
}

// Status mapping functions
function mapUPSStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'I': 'in_transit',
    'D': 'delivered',
    'X': 'exception',
    'P': 'pickup',
    'M': 'manifest_pickup'
  };
  return statusMap[status] || 'unknown';
}

function mapFedExStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'DL': 'delivered',
    'IT': 'in_transit',
    'OD': 'out_for_delivery',
    'PU': 'pickup',
    'EX': 'exception'
  };
  return statusMap[status] || 'unknown';
}

function mapDHLStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'delivered': 'delivered',
    'transit': 'in_transit',
    'pickup': 'pickup',
    'exception': 'exception'
  };
  return statusMap[status] || 'unknown';
}

function parseUSPSTrackingXML(xml: string): any {
  // Simple XML parsing for USPS response
  // In a real implementation, you'd use a proper XML parser
  const statusMatch = xml.match(/<Status>(.*?)<\/Status>/);
  const status = statusMatch ? statusMatch[1] : 'unknown';
  
  return {
    status: mapUSPSStatus(status),
    history: [] // Extract from XML as needed
  };
}

function mapUSPSStatus(status: string): string {
  if (status.includes('Delivered')) return 'delivered';
  if (status.includes('In Transit') || status.includes('Acceptance')) return 'in_transit';
  if (status.includes('Out for Delivery')) return 'out_for_delivery';
  return 'unknown';
}