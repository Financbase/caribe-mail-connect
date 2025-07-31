import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmergencyActivationRequest {
  event_type: 'hurricane' | 'flood' | 'power' | 'security' | 'medical' | 'fire' | 'earthquake'
  severity_level: 'normal' | 'watch' | 'warning' | 'critical'
  title: string
  description?: string
  location?: string
  affected_areas?: string[]
  evacuation_mode?: boolean
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

    // Check if user has admin role
    const { data: userData } = await supabaseClient
      .from('auth.users')
      .select('raw_user_meta_data')
      .eq('id', user.id)
      .single()

    if (!userData?.raw_user_meta_data?.role || userData.raw_user_meta_data.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: EmergencyActivationRequest = await req.json()

    // Validate required fields
    if (!body.event_type || !body.severity_level || !body.title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert emergency event
    const { data: emergencyEvent, error: insertError } = await supabaseClient
      .from('emergency_events')
      .insert({
        event_type: body.event_type,
        severity_level: body.severity_level,
        title: body.title,
        description: body.description,
        location: body.location,
        affected_areas: body.affected_areas,
        evacuation_mode: body.evacuation_mode || false,
        created_by: user.id
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting emergency event:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create emergency event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send emergency notifications
    await sendEmergencyNotifications(supabaseClient, emergencyEvent)

    // Log the action
    await supabaseClient
      .from('emergency_audit_log')
      .insert({
        emergency_event_id: emergencyEvent.id,
        user_id: user.id,
        action: 'emergency_activated',
        details: {
          event_type: body.event_type,
          severity: body.severity_level,
          title: body.title
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        emergency_event: emergencyEvent,
        message: 'Emergency activated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in emergency activation:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendEmergencyNotifications(supabaseClient: any, emergencyEvent: any) {
  try {
    // Get all emergency contacts
    const { data: contacts } = await supabaseClient
      .from('emergency_contacts')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })

    // Create emergency communication record
    const { data: communication } = await supabaseClient
      .from('emergency_communications')
      .insert({
        emergency_event_id: emergencyEvent.id,
        communication_type: 'alert',
        title: `Emergency Alert: ${emergencyEvent.title}`,
        message: `Emergency ${emergencyEvent.event_type} - ${emergencyEvent.severity_level} level activated. ${emergencyEvent.description || ''}`,
        recipients: contacts?.map(c => c.id) || [],
        created_by: emergencyEvent.created_by
      })
      .select()
      .single()

    // In a real implementation, you would send actual notifications here
    // For now, we'll just log the communication
    console.log('Emergency notification sent:', {
      emergency_id: emergencyEvent.id,
      communication_id: communication?.id,
      recipients_count: contacts?.length || 0
    })

  } catch (error) {
    console.error('Error sending emergency notifications:', error)
  }
} 