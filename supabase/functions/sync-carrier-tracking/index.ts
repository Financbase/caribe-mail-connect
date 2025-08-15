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

    console.log('Starting carrier tracking sync...');

    // Get all active carrier integrations
    const { data: integrations, error: integrationsError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('service_type', 'carrier')
      .eq('is_active', true)
      .eq('is_connected', true);

    if (integrationsError) {
      throw new Error(`Failed to fetch integrations: ${integrationsError.message}`);
    }

    if (!integrations || integrations.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No active carrier integrations found',
        packagesUpdated: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get packages that need tracking updates
    const { data: packages, error: packagesError } = await supabaseClient
      .from('packages')
      .select('*')
      .in('status', ['shipped', 'in_transit', 'out_for_delivery'])
      .not('tracking_number', 'is', null)
      .lt('last_tracking_update', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Not updated in last hour

    if (packagesError) {
      throw new Error(`Failed to fetch packages: ${packagesError.message}`);
    }

    if (!packages || packages.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No packages need tracking updates',
        packagesUpdated: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${packages.length} packages to update across ${integrations.length} carriers`);

    let totalUpdated = 0;
    const errors = [];
    const results = [];

    for (const integration of integrations) {
      try {
        console.log(`Processing carrier: ${integration.service_name}`);
        
        // Filter packages for this carrier
        const carrierPackages = packages.filter(pkg => 
          pkg.carrier?.toLowerCase() === integration.service_name.toLowerCase()
        );

        if (carrierPackages.length === 0) {
          continue;
        }

        const carrierResult = await syncCarrierPackages(
          integration, 
          carrierPackages, 
          supabaseClient
        );

        results.push({
          carrier: integration.service_name,
          packagesProcessed: carrierPackages.length,
          packagesUpdated: carrierResult.updated,
          errors: carrierResult.errors
        });

        totalUpdated += carrierResult.updated;
        errors.push(...carrierResult.errors);

        // Log integration sync
        await supabaseClient
          .from('integration_logs')
          .insert({
            integration_id: integration.id,
            request_type: 'sync',
            endpoint: 'tracking',
            status_code: carrierResult.errors.length > 0 ? 500 : 200,
            response_data: carrierResult,
            execution_time_ms: carrierResult.executionTime,
            error_message: carrierResult.errors.length > 0 ? carrierResult.errors.join('; ') : null
          });

      } catch (error) {
        console.error(`Error processing carrier ${integration.service_name}:`, error);
        errors.push(`${integration.service_name}: ${error.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: errors.length === 0,
      message: `Updated ${totalUpdated} packages`,
      packagesUpdated: totalUpdated,
      results,
      errors
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in carrier tracking sync:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncCarrierPackages(integration: unknown, packages: unknown[], supabaseClient: unknown) {
  const startTime = Date.now();
  let updated = 0;
  const errors = [];

  for (const pkg of packages) {
    try {
      const trackingData = await fetchTrackingData(
        integration.service_name,
        pkg.tracking_number,
        integration.credentials
      );

      if (trackingData && trackingData.status !== pkg.status) {
        // Update package with new tracking information
        const { error } = await supabaseClient
          .from('packages')
          .update({
            status: trackingData.status,
            tracking_history: trackingData.events,
            estimated_delivery: trackingData.estimatedDelivery,
            last_tracking_update: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', pkg.id);

        if (error) {
          errors.push(`Failed to update package ${pkg.tracking_number}: ${error.message}`);
          continue;
        }

        // Create notification if status changed significantly
        if (shouldNotifyStatusChange(pkg.status, trackingData.status)) {
          await createTrackingNotification(pkg, trackingData, supabaseClient);
        }

        updated++;
        console.log(`Updated package ${pkg.tracking_number}: ${pkg.status} -> ${trackingData.status}`);
      }
    } catch (error) {
      errors.push(`Error updating ${pkg.tracking_number}: ${error.message}`);
    }
  }

  return {
    updated,
    errors,
    executionTime: Date.now() - startTime
  };
}

async function fetchTrackingData(carrier: string, trackingNumber: string, credentials: unknown) {
  switch (carrier.toLowerCase()) {
    case 'ups':
      return await fetchUPSTracking(trackingNumber, credentials);
    case 'fedex':
      return await fetchFedExTracking(trackingNumber, credentials);
    case 'usps':
      return await fetchUSPSTracking(trackingNumber, credentials);
    case 'dhl':
      return await fetchDHLTracking(trackingNumber, credentials);
    default:
      throw new Error(`Unsupported carrier: ${carrier}`);
  }
}

async function fetchUPSTracking(trackingNumber: string, credentials: unknown) {
  try {
    const response = await fetch(`https://onlinetools.ups.com/api/track/v1/details/${trackingNumber}`, {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`UPS API error: ${response.status}`);
    }

    const data = await response.json();
    const shipment = data.trackResponse?.shipment?.[0];
    const package_info = shipment?.package?.[0];

    if (!package_info) {
      return null;
    }

    return {
      status: mapUPSStatus(package_info.currentStatus?.type),
      events: package_info.activity || [],
      estimatedDelivery: package_info.deliveryDate?.[0]?.date,
      location: package_info.currentStatus?.description
    };
  } catch (error) {
    console.error(`UPS tracking error for ${trackingNumber}:`, error);
    throw error;
  }
}

async function fetchFedExTracking(trackingNumber: string, credentials: unknown) {
  try {
    const response = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackingInfo: [{
          trackingNumberInfo: {
            trackingNumber: trackingNumber
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`FedEx API error: ${response.status}`);
    }

    const data = await response.json();
    const trackResult = data.output?.completeTrackResults?.[0]?.trackResults?.[0];

    if (!trackResult) {
      return null;
    }

    return {
      status: mapFedExStatus(trackResult.latestStatusDetail?.code),
      events: trackResult.scanEvents || [],
      estimatedDelivery: trackResult.estimatedDeliveryTimeWindow?.window?.ends,
      location: trackResult.latestStatusDetail?.description
    };
  } catch (error) {
    console.error(`FedEx tracking error for ${trackingNumber}:`, error);
    throw error;
  }
}

async function fetchUSPSTracking(trackingNumber: string, credentials: unknown) {
  try {
    const xmlRequest = `
      <TrackRequest USERID="${credentials.user_id}">
        <TrackID ID="${trackingNumber}"></TrackID>
      </TrackRequest>
    `;

    const response = await fetch(`https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=${encodeURIComponent(xmlRequest)}`);

    if (!response.ok) {
      throw new Error(`USPS API error: ${response.status}`);
    }

    const xmlText = await response.text();
    return parseUSPSTrackingXML(xmlText);
  } catch (error) {
    console.error(`USPS tracking error for ${trackingNumber}:`, error);
    throw error;
  }
}

async function fetchDHLTracking(trackingNumber: string, credentials: unknown) {
  try {
    const response = await fetch(`https://api-eu.dhl.com/track/shipments?trackingNumber=${trackingNumber}`, {
      headers: {
        'DHL-API-Key': credentials.api_key,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`DHL API error: ${response.status}`);
    }

    const data = await response.json();
    const shipment = data.shipments?.[0];

    if (!shipment) {
      return null;
    }

    return {
      status: mapDHLStatus(shipment.status?.statusCode),
      events: shipment.events || [],
      estimatedDelivery: shipment.estimatedTimeOfDelivery,
      location: shipment.status?.location?.address?.addressLocality
    };
  } catch (error) {
    console.error(`DHL tracking error for ${trackingNumber}:`, error);
    throw error;
  }
}

function parseUSPSTrackingXML(xml: string) {
  try {
    // Basic XML parsing for USPS response
    const statusMatch = xml.match(/<Status>(.*?)<\/Status>/);
    const status = statusMatch ? statusMatch[1] : '';
    
    const summaryMatch = xml.match(/<StatusSummary>(.*?)<\/StatusSummary>/);
    const summary = summaryMatch ? summaryMatch[1] : '';

    return {
      status: mapUSPSStatus(status),
      events: [{ description: summary, timestamp: new Date().toISOString() }],
      estimatedDelivery: null,
      location: summary
    };
  } catch (error) {
    console.error('Error parsing USPS XML:', error);
    return null;
  }
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
    'EX': 'exception',
    'SH': 'shipped'
  };
  return statusMap[status] || 'unknown';
}

function mapUSPSStatus(status: string): string {
  if (status.toLowerCase().includes('delivered')) return 'delivered';
  if (status.toLowerCase().includes('out for delivery')) return 'out_for_delivery';
  if (status.toLowerCase().includes('in transit')) return 'in_transit';
  if (status.toLowerCase().includes('acceptance')) return 'pickup';
  if (status.toLowerCase().includes('departed')) return 'in_transit';
  return 'unknown';
}

function mapDHLStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'delivered': 'delivered',
    'transit': 'in_transit',
    'pickup': 'pickup',
    'exception': 'exception'
  };
  return statusMap[status?.toLowerCase()] || 'unknown';
}

function shouldNotifyStatusChange(oldStatus: string, newStatus: string): boolean {
  const importantStatuses = ['out_for_delivery', 'delivered', 'exception'];
  return importantStatuses.includes(newStatus) && oldStatus !== newStatus;
}

async function createTrackingNotification(pkg: unknown, trackingData: unknown, supabaseClient: unknown) {
  try {
    // Get customer notification preferences
    const { data: customer } = await supabaseClient
      .from('customers')
      .select('id, first_name, last_name, email, phone')
      .eq('id', pkg.customer_id)
      .single();

    if (!customer) return;

    let message = '';
    let subject = '';

    switch (trackingData.status) {
      case 'out_for_delivery':
        subject = 'Package Out for Delivery';
        message = `Your package with tracking number ${pkg.tracking_number} is out for delivery and should arrive today.`;
        break;
      case 'delivered':
        subject = 'Package Delivered';
        message = `Your package with tracking number ${pkg.tracking_number} has been delivered.`;
        break;
      case 'exception':
        subject = 'Package Delivery Exception';
        message = `There was an issue with your package delivery (${pkg.tracking_number}). Please contact us for more information.`;
        break;
      default:
        subject = 'Package Status Update';
        message = `Your package with tracking number ${pkg.tracking_number} status has been updated to: ${trackingData.status}`;
    }

    // Create notification
    await supabaseClient
      .from('notification_queue')
      .insert({
        customer_id: customer.id,
        channel: 'email',
        recipient: customer.email,
        subject,
        content: message,
        status: 'pending',
        metadata: {
          package_id: pkg.id,
          tracking_number: pkg.tracking_number,
          new_status: trackingData.status
        }
      });

    console.log(`Created notification for package ${pkg.tracking_number} status change`);
  } catch (error) {
    console.error('Error creating tracking notification:', error);
  }
}