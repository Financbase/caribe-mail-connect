import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (method) {
      case 'GET':
        return await handleGet(supabaseClient, path, url)
      case 'POST':
        return await handlePost(supabaseClient, path, req)
      case 'PUT':
        return await handlePut(supabaseClient, path, req)
      case 'DELETE':
        return await handleDelete(supabaseClient, path, url)
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleGet(supabase: any, path: string, url: URL) {
  const searchParams = url.searchParams

  if (path === 'partnerships') {
    let query = supabase
      .from('delivery_partnerships')
      .select('*')

    // Apply filters
    const partnerType = searchParams.get('partner_type')
    if (partnerType) query = query.eq('partner_type', partnerType)

    const isActive = searchParams.get('is_active')
    if (isActive !== null) query = query.eq('is_active', isActive === 'true')

    const backgroundCheckStatus = searchParams.get('background_check_status')
    if (backgroundCheckStatus) query = query.eq('background_check_status', backgroundCheckStatus)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (path === 'partnership-stats') {
    const { data: partnerships } = await supabase
      .from('delivery_partnerships')
      .select('*')

    const stats = {
      total_partnerships: partnerships?.length || 0,
      active_partnerships: partnerships?.filter(p => p.is_active).length || 0,
      approved_background_checks: partnerships?.filter(p => p.background_check_status === 'approved').length || 0,
      average_rating: partnerships?.reduce((acc, p) => acc + p.rating, 0) / (partnerships?.length || 1),
      total_deliveries: partnerships?.reduce((acc, p) => acc + p.total_deliveries, 0) || 0,
      successful_deliveries: partnerships?.reduce((acc, p) => acc + p.successful_deliveries, 0) || 0
    }

    return new Response(
      JSON.stringify({ data: stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Endpoint not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handlePost(supabase: any, path: string, req: Request) {
  const body = await req.json()

  if (path === 'partnerships') {
    const { partner_name, partner_type, vehicle_type, contact_email, contact_phone } = body

    const { data, error } = await supabase
      .from('delivery_partnerships')
      .insert({
        partner_name,
        partner_type,
        vehicle_type,
        contact_email,
        contact_phone,
        rating: 0,
        total_deliveries: 0,
        successful_deliveries: 0,
        background_check_status: 'pending',
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (path === 'background-check') {
    const { partnership_id, status, expiry_date } = body

    const { data, error } = await supabase
      .from('delivery_partnerships')
      .update({
        background_check_status: status,
        background_check_expiry: expiry_date
      })
      .eq('id', partnership_id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Endpoint not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handlePut(supabase: any, path: string, req: Request) {
  const body = await req.json()

  if (path === 'partnerships') {
    const partnershipId = new URL(req.url).searchParams.get('id')
    if (!partnershipId) {
      return new Response(
        JSON.stringify({ error: 'Partnership ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = await supabase
      .from('delivery_partnerships')
      .update(body)
      .eq('id', partnershipId)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Endpoint not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleDelete(supabase: any, path: string, url: URL) {
  if (path === 'partnerships') {
    const partnershipId = url.searchParams.get('id')
    if (!partnershipId) {
      return new Response(
        JSON.stringify({ error: 'Partnership ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabase
      .from('delivery_partnerships')
      .delete()
      .eq('id', partnershipId)

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Partnership deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Endpoint not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
} 