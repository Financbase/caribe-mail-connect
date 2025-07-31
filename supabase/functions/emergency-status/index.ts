import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get comprehensive emergency status
    const emergencyStatus = await getEmergencyStatus(supabaseClient)

    return new Response(
      JSON.stringify({ 
        success: true, 
        emergency_status: emergencyStatus
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting emergency status:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getEmergencyStatus(supabaseClient: any) {
  try {
    // Get active emergency events
    const { data: activeEmergencies } = await supabaseClient
      .from('emergency_events')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    // Get staff status
    const { data: staffStatus } = await supabaseClient
      .from('emergency_staff_status')
      .select('*')
      .order('updated_at', { ascending: false })

    // Get critical resources
    const { data: criticalResources } = await supabaseClient
      .from('emergency_resources')
      .select('*')
      .in('status', ['low', 'critical'])

    // Get active weather alerts
    const { data: weatherAlerts } = await supabaseClient
      .from('weather_alerts')
      .select('*')
      .eq('is_active', true)
      .order('severity', { ascending: false })

    // Get latest hurricane tracking
    const { data: hurricaneTracking } = await supabaseClient
      .from('hurricane_tracking')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)

    // Get business continuity status
    const { data: businessContinuity } = await supabaseClient
      .from('business_continuity')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)

    // Get emergency logistics status
    const { data: emergencyLogistics } = await supabaseClient
      .from('emergency_logistics')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)

    // Calculate summary metrics
    const staffPresent = staffStatus?.filter(s => s.status === 'present').length || 0
    const totalStaff = staffStatus?.length || 0
    const criticalResourceCount = criticalResources?.length || 0
    const activeAlertCount = weatherAlerts?.length || 0
    const evacuationMode = activeEmergencies?.some(e => e.evacuation_mode) || false

    // Determine overall system status
    let systemStatus = 'operational'
    if (activeEmergencies?.some(e => e.severity_level === 'critical')) {
      systemStatus = 'critical'
    } else if (activeEmergencies?.length > 0 || criticalResourceCount > 0) {
      systemStatus = 'degraded'
    }

    // Determine communications status
    let communicationsStatus = 'active'
    if (evacuationMode) {
      communicationsStatus = 'limited'
    }

    // Determine power status
    let powerStatus = 'normal'
    if (activeEmergencies?.some(e => e.event_type === 'power')) {
      powerStatus = 'backup'
    }

    return {
      // Overall status
      isActive: activeEmergencies?.length > 0 || false,
      systemStatus,
      communicationsStatus,
      powerStatus,
      evacuationMode,

      // Metrics
      activeEmergencies: activeEmergencies?.length || 0,
      staffPresent,
      totalStaff,
      criticalResources: criticalResourceCount,
      activeAlerts: activeAlertCount,

      // Detailed data
      emergencyEvents: activeEmergencies || [],
      staffStatus: staffStatus || [],
      criticalResources: criticalResources || [],
      weatherAlerts: weatherAlerts || [],
      hurricaneTracking: hurricaneTracking?.[0] || null,
      businessContinuity: businessContinuity?.[0] || null,
      emergencyLogistics: emergencyLogistics?.[0] || null,

      // Timestamps
      lastUpdated: new Date().toISOString()
    }

  } catch (error) {
    console.error('Error getting emergency status:', error)
    return {
      isActive: false,
      systemStatus: 'unknown',
      communicationsStatus: 'unknown',
      powerStatus: 'unknown',
      evacuationMode: false,
      activeEmergencies: 0,
      staffPresent: 0,
      totalStaff: 0,
      criticalResources: 0,
      activeAlerts: 0,
      emergencyEvents: [],
      staffStatus: [],
      criticalResources: [],
      weatherAlerts: [],
      hurricaneTracking: null,
      businessContinuity: null,
      emergencyLogistics: null,
      lastUpdated: new Date().toISOString()
    }
  }
} 