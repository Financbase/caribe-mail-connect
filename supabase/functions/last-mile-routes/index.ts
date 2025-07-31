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
        return await handleGet(supabaseClient, user, path, url)
      case 'POST':
        return await handlePost(supabaseClient, user, req)
      case 'PUT':
        return await handlePut(supabaseClient, user, path, req)
      case 'DELETE':
        return await handleDelete(supabaseClient, user, path)
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

async function handleGet(supabase: any, user: any, path: string, url: URL) {
  const searchParams = url.searchParams
  
  if (path === 'routes') {
    // Get delivery routes with filters
    let query = supabase
      .from('delivery_routes')
      .select(`
        *,
        route_stops(*),
        driver_locations!inner(*)
      `)
      .eq('driver_id', user.id)

    // Apply filters
    const status = searchParams.get('status')
    if (status) query = query.eq('status', status)
    
    const territoryId = searchParams.get('territory_id')
    if (territoryId) query = query.eq('territory_id', territoryId)

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (path === 'metrics') {
    // Get last-mile metrics
    const { data: routes } = await supabase
      .from('delivery_routes')
      .select('*')
      .eq('driver_id', user.id)

    const { data: todayDeliveries } = await supabase
      .from('delivery_tracking')
      .select('*')
      .eq('driver_id', user.id)
      .gte('created_at', new Date().toISOString().split('T')[0])

    const metrics = {
      total_deliveries: routes?.length || 0,
      completed_today: todayDeliveries?.length || 0,
      average_delivery_time: routes?.reduce((acc, route) => acc + route.average_time_minutes, 0) / (routes?.length || 1),
      efficiency_score: routes?.reduce((acc, route) => acc + route.efficiency_score, 0) / (routes?.length || 1),
      active_drivers: 1, // Current user
      carbon_saved: routes?.reduce((acc, route) => acc + route.carbon_saved_kg, 0) || 0,
      total_routes: routes?.length || 0,
      active_partnerships: 0 // Will be implemented separately
    }

    return new Response(
      JSON.stringify({ data: metrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (path === 'live-tracking') {
    // Get real-time tracking data
    const { data: driverLocations } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('driver_id', user.id)
      .eq('is_online', true)
      .order('created_at', { ascending: false })
      .limit(1)

    const { data: activeRoutes } = await supabase
      .from('delivery_routes')
      .select(`
        *,
        route_stops(*)
      `)
      .eq('driver_id', user.id)
      .eq('status', 'active')

    const { data: trafficConditions } = await supabase
      .from('traffic_conditions')
      .select('*')
      .gte('expires_at', new Date().toISOString())

    const liveData = {
      driver_locations: driverLocations || [],
      active_routes: activeRoutes || [],
      route_stops: activeRoutes?.flatMap(route => route.route_stops) || [],
      traffic_conditions: trafficConditions || [],
      last_updated: new Date().toISOString()
    }

    return new Response(
      JSON.stringify({ data: liveData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Endpoint not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handlePost(supabase: any, user: any, req: Request) {
  const body = await req.json()
  const url = new URL(req.url)
  const path = url.pathname.split('/').pop()

  if (path === 'routes') {
    // Create new delivery route
    const { name, driver_id, territory_id, stops } = body

    // Insert route
    const { data: route, error: routeError } = await supabase
      .from('delivery_routes')
      .insert({
        name,
        driver_id: driver_id || user.id,
        territory_id,
        status: 'active'
      })
      .select()
      .single()

    if (routeError) throw routeError

    // Insert stops
    if (stops && stops.length > 0) {
      const stopsWithRouteId = stops.map((stop: any, index: number) => ({
        ...stop,
        route_id: route.id,
        stop_order: index + 1,
        location_point: `POINT(${stop.longitude} ${stop.latitude})`
      }))

      const { error: stopsError } = await supabase
        .from('route_stops')
        .insert(stopsWithRouteId)

      if (stopsError) throw stopsError
    }

    return new Response(
      JSON.stringify({ data: route }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (path === 'location') {
    // Update driver location
    const { latitude, longitude, heading, speed_kmh, battery_level, is_online } = body

    const { data, error } = await supabase
      .from('driver_locations')
      .insert({
        driver_id: user.id,
        latitude,
        longitude,
        heading,
        speed_kmh,
        battery_level,
        is_online: is_online ?? true,
        location_point: `POINT(${longitude} ${latitude})`
      })
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

async function handlePut(supabase: any, user: any, path: string, req: Request) {
  const body = await req.json()

  if (path === 'routes') {
    const routeId = new URL(req.url).searchParams.get('id')
    if (!routeId) {
      return new Response(
        JSON.stringify({ error: 'Route ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = await supabase
      .from('delivery_routes')
      .update(body)
      .eq('id', routeId)
      .eq('driver_id', user.id)
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

async function handleDelete(supabase: any, user: any, path: string) {
  if (path === 'routes') {
    const routeId = new URL(req.url).searchParams.get('id')
    if (!routeId) {
      return new Response(
        JSON.stringify({ error: 'Route ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabase
      .from('delivery_routes')
      .delete()
      .eq('id', routeId)
      .eq('driver_id', user.id)

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Route deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Endpoint not found' }),
    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
} 