import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherAlert {
  id: string
  type: string
  severity: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  category?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch weather alerts from NOAA API for Puerto Rico
    const weatherAlerts = await fetchWeatherAlerts()

    // Process and store weather alerts
    const processedAlerts = await processWeatherAlerts(supabaseClient, weatherAlerts)

    // Check for hurricane alerts and create emergency events if needed
    await checkForHurricaneEmergencies(supabaseClient, weatherAlerts)

    return new Response(
      JSON.stringify({ 
        success: true, 
        alerts_processed: processedAlerts.length,
        message: 'Weather alerts synchronized successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in weather alert sync:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function fetchWeatherAlerts(): Promise<WeatherAlert[]> {
  try {
    // NOAA Weather API endpoint for Puerto Rico
    const response = await fetch('https://api.weather.gov/alerts/active?area=PR')
    const data = await response.json()

    if (!data.features) {
      return []
    }

    return data.features.map((feature: any) => ({
      id: feature.id,
      type: feature.properties.event,
      severity: feature.properties.severity,
      title: feature.properties.headline,
      description: feature.properties.description,
      location: feature.properties.areaDesc,
      startTime: feature.properties.effective,
      endTime: feature.properties.expires,
      category: feature.properties.category
    }))
  } catch (error) {
    console.error('Error fetching weather alerts:', error)
    return []
  }
}

async function processWeatherAlerts(supabaseClient: any, alerts: WeatherAlert[]) {
  const processedAlerts = []

  for (const alert of alerts) {
    try {
      // Check if alert already exists
      const { data: existingAlert } = await supabaseClient
        .from('weather_alerts')
        .select('id')
        .eq('external_id', alert.id)
        .single()

      if (existingAlert) {
        // Update existing alert
        const { data: updatedAlert } = await supabaseClient
          .from('weather_alerts')
          .update({
            severity: alert.severity,
            title: alert.title,
            description: alert.description,
            end_time: alert.endTime,
            updated_at: new Date().toISOString()
          })
          .eq('external_id', alert.id)
          .select()
          .single()

        processedAlerts.push(updatedAlert)
      } else {
        // Insert new alert
        const { data: newAlert } = await supabaseClient
          .from('weather_alerts')
          .insert({
            alert_type: mapAlertType(alert.type),
            severity: mapSeverity(alert.severity),
            title: alert.title,
            description: alert.description,
            location: alert.location,
            start_time: alert.startTime,
            end_time: alert.endTime,
            external_id: alert.id,
            source: 'NOAA'
          })
          .select()
          .single()

        processedAlerts.push(newAlert)
      }
    } catch (error) {
      console.error('Error processing alert:', alert.id, error)
    }
  }

  return processedAlerts
}

async function checkForHurricaneEmergencies(supabaseClient: any, alerts: WeatherAlert[]) {
  const hurricaneAlerts = alerts.filter(alert => 
    alert.type.toLowerCase().includes('hurricane') || 
    alert.type.toLowerCase().includes('tropical')
  )

  for (const hurricaneAlert of hurricaneAlerts) {
    try {
      // Check if emergency event already exists for this hurricane
      const { data: existingEmergency } = await supabaseClient
        .from('emergency_events')
        .select('id')
        .eq('event_type', 'hurricane')
        .eq('title', hurricaneAlert.title)
        .eq('status', 'active')
        .single()

      if (!existingEmergency) {
        // Create new emergency event
        const { data: emergencyEvent } = await supabaseClient
          .from('emergency_events')
          .insert({
            event_type: 'hurricane',
            severity_level: mapSeverity(hurricaneAlert.severity),
            title: hurricaneAlert.title,
            description: hurricaneAlert.description,
            location: hurricaneAlert.location,
            start_time: hurricaneAlert.startTime,
            end_time: hurricaneAlert.endTime,
            evacuation_mode: hurricaneAlert.severity === 'Extreme' || hurricaneAlert.severity === 'Severe'
          })
          .select()
          .single()

        // Create hurricane tracking record
        if (emergencyEvent) {
          await supabaseClient
            .from('hurricane_tracking')
            .insert({
              hurricane_name: extractHurricaneName(hurricaneAlert.title),
              category: extractHurricaneCategory(hurricaneAlert.description),
              status: 'approaching',
              forecast_data: {
                alert: hurricaneAlert
              }
            })
        }
      }
    } catch (error) {
      console.error('Error creating hurricane emergency:', error)
    }
  }
}

function mapAlertType(noaaType: string): string {
  const typeMap: { [key: string]: string } = {
    'Hurricane': 'hurricane',
    'Tropical Storm': 'hurricane',
    'Flood': 'flood',
    'Flash Flood': 'flood',
    'Severe Thunderstorm': 'storm',
    'Heat': 'heat',
    'Wind': 'wind',
    'Tornado': 'tornado'
  }

  return typeMap[noaaType] || 'storm'
}

function mapSeverity(noaaSeverity: string): string {
  const severityMap: { [key: string]: string } = {
    'Minor': 'watch',
    'Moderate': 'warning',
    'Severe': 'critical',
    'Extreme': 'critical'
  }

  return severityMap[noaaSeverity] || 'warning'
}

function extractHurricaneName(title: string): string {
  // Extract hurricane name from title like "Hurricane Warning for Hurricane Maria"
  const match = title.match(/Hurricane\s+([A-Za-z]+)/i)
  return match ? match[1] : 'Unknown'
}

function extractHurricaneCategory(description: string): number {
  // Extract category from description
  const match = description.match(/Category\s+(\d+)/i)
  return match ? parseInt(match[1]) : 1
} 