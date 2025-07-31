import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type {
  DeliveryRoute,
  RouteStop,
  DriverLocation,
  DeliveryPartnership,
  DeliveryTracking,
  EfficiencyMetrics,
  TrafficCondition,
  LastMileMetrics,
  LiveTrackingData,
  CreateDeliveryRouteRequest,
  UpdateDeliveryRouteRequest,
  UpdateDriverLocationRequest,
  CreateDeliveryPartnershipRequest,
  UpdateDeliveryTrackingRequest,
  DeliveryRouteFilters,
  DeliveryTrackingFilters
} from '@/types/last-mile'

// Base API functions
const lastMileApi = {
  // Routes
  async getRoutes(filters?: DeliveryRouteFilters) {
    let query = supabase
      .from('delivery_routes')
      .select(`
        *,
        route_stops(*),
        driver_locations!inner(*)
      `)

    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.driver_id) query = query.eq('driver_id', filters.driver_id)
    if (filters?.territory_id) query = query.eq('territory_id', filters.territory_id)
    if (filters?.date_from) query = query.gte('created_at', filters.date_from)
    if (filters?.date_to) query = query.lte('created_at', filters.date_to)
    if (filters?.efficiency_score_min) query = query.gte('efficiency_score', filters.efficiency_score_min)
    if (filters?.efficiency_score_max) query = query.lte('efficiency_score', filters.efficiency_score_max)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createRoute(routeData: CreateDeliveryRouteRequest) {
    const { name, driver_id, territory_id, stops } = routeData

    // Insert route
    const { data: route, error: routeError } = await supabase
      .from('delivery_routes')
      .insert({
        name,
        driver_id,
        territory_id,
        status: 'active'
      })
      .select()
      .single()

    if (routeError) throw routeError

    // Insert stops
    if (stops && stops.length > 0) {
      const stopsWithRouteId = stops.map((stop, index) => ({
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

    return route
  },

  async updateRoute(routeId: string, updates: UpdateDeliveryRouteRequest) {
    const { data, error } = await supabase
      .from('delivery_routes')
      .update(updates)
      .eq('id', routeId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteRoute(routeId: string) {
    const { error } = await supabase
      .from('delivery_routes')
      .delete()
      .eq('id', routeId)

    if (error) throw error
    return { success: true }
  },

  // Metrics
  async getMetrics(): Promise<LastMileMetrics> {
    const { data: routes } = await supabase
      .from('delivery_routes')
      .select('*')

    const { data: todayDeliveries } = await supabase
      .from('delivery_tracking')
      .select('*')
      .gte('created_at', new Date().toISOString().split('T')[0])

    const { data: partnerships } = await supabase
      .from('delivery_partnerships')
      .select('*')
      .eq('is_active', true)

    return {
      total_deliveries: routes?.length || 0,
      completed_today: todayDeliveries?.length || 0,
      average_delivery_time: routes?.reduce((acc, route) => acc + route.average_time_minutes, 0) / (routes?.length || 1),
      efficiency_score: routes?.reduce((acc, route) => acc + route.efficiency_score, 0) / (routes?.length || 1),
      active_drivers: 1, // Current user
      carbon_saved: routes?.reduce((acc, route) => acc + route.carbon_saved_kg, 0) || 0,
      total_routes: routes?.length || 0,
      active_partnerships: partnerships?.length || 0
    }
  },

  // Live Tracking
  async getLiveTracking(): Promise<LiveTrackingData> {
    const { data: driverLocations } = await supabase
      .from('driver_locations')
      .select('*')
      .eq('is_online', true)
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: activeRoutes } = await supabase
      .from('delivery_routes')
      .select(`
        *,
        route_stops(*)
      `)
      .eq('status', 'active')

    const { data: trafficConditions } = await supabase
      .from('traffic_conditions')
      .select('*')
      .gte('expires_at', new Date().toISOString())

    return {
      driver_locations: driverLocations || [],
      active_routes: activeRoutes || [],
      route_stops: activeRoutes?.flatMap(route => route.route_stops) || [],
      traffic_conditions: trafficConditions || [],
      last_updated: new Date().toISOString()
    }
  },

  // Driver Location
  async updateDriverLocation(locationData: UpdateDriverLocationRequest) {
    const { data, error } = await supabase
      .from('driver_locations')
      .insert({
        ...locationData,
        location_point: `POINT(${locationData.longitude} ${locationData.latitude})`
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Partnerships
  async getPartnerships() {
    const { data, error } = await supabase
      .from('delivery_partnerships')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createPartnership(partnershipData: CreateDeliveryPartnershipRequest) {
    const { data, error } = await supabase
      .from('delivery_partnerships')
      .insert({
        ...partnershipData,
        rating: 0,
        total_deliveries: 0,
        successful_deliveries: 0,
        background_check_status: 'pending',
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePartnership(partnershipId: string, updates: Partial<DeliveryPartnership>) {
    const { data, error } = await supabase
      .from('delivery_partnerships')
      .update(updates)
      .eq('id', partnershipId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deletePartnership(partnershipId: string) {
    const { error } = await supabase
      .from('delivery_partnerships')
      .delete()
      .eq('id', partnershipId)

    if (error) throw error
    return { success: true }
  },

  // Tracking
  async getDeliveryTracking(filters?: DeliveryTrackingFilters) {
    let query = supabase
      .from('delivery_tracking')
      .select('*')

    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.route_id) query = query.eq('route_id', filters.route_id)
    if (filters?.driver_id) query = query.eq('driver_id', filters.driver_id)
    if (filters?.partner_id) query = query.eq('partner_id', filters.partner_id)
    if (filters?.tracking_number) query = query.eq('tracking_number', filters.tracking_number)
    if (filters?.date_from) query = query.gte('created_at', filters.date_from)
    if (filters?.date_to) query = query.lte('created_at', filters.date_to)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updateDeliveryTracking(trackingId: string, updates: UpdateDeliveryTrackingRequest) {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .update(updates)
      .eq('id', trackingId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Custom Hooks
export function useLastMileMetrics() {
  return useQuery({
    queryKey: ['last-mile-metrics'],
    queryFn: lastMileApi.getMetrics,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  })
}

export function useDeliveryRoutes(filters?: DeliveryRouteFilters) {
  return useQuery({
    queryKey: ['delivery-routes', filters],
    queryFn: () => lastMileApi.getRoutes(filters),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000
  })
}

export function useLiveTracking() {
  return useQuery({
    queryKey: ['live-tracking'],
    queryFn: lastMileApi.getLiveTracking,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    staleTime: 5000
  })
}

export function useDeliveryPartnerships() {
  return useQuery({
    queryKey: ['delivery-partnerships'],
    queryFn: lastMileApi.getPartnerships,
    refetchInterval: 120000, // Refetch every 2 minutes
    staleTime: 60000
  })
}

export function useDeliveryTracking(filters?: DeliveryTrackingFilters) {
  return useQuery({
    queryKey: ['delivery-tracking', filters],
    queryFn: () => lastMileApi.getDeliveryTracking(filters),
    refetchInterval: 30000,
    staleTime: 15000
  })
}

// Mutations
export function useCreateDeliveryRoute() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lastMileApi.createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-routes'] })
      queryClient.invalidateQueries({ queryKey: ['last-mile-metrics'] })
    }
  })
}

export function useUpdateDeliveryRoute() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ routeId, updates }: { routeId: string; updates: UpdateDeliveryRouteRequest }) =>
      lastMileApi.updateRoute(routeId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-routes'] })
      queryClient.invalidateQueries({ queryKey: ['last-mile-metrics'] })
    }
  })
}

export function useDeleteDeliveryRoute() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lastMileApi.deleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-routes'] })
      queryClient.invalidateQueries({ queryKey: ['last-mile-metrics'] })
    }
  })
}

export function useUpdateDriverLocation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lastMileApi.updateDriverLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-tracking'] })
    }
  })
}

export function useCreateDeliveryPartnership() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lastMileApi.createPartnership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-partnerships'] })
      queryClient.invalidateQueries({ queryKey: ['last-mile-metrics'] })
    }
  })
}

export function useUpdateDeliveryPartnership() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ partnershipId, updates }: { partnershipId: string; updates: Partial<DeliveryPartnership> }) =>
      lastMileApi.updatePartnership(partnershipId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-partnerships'] })
    }
  })
}

export function useDeleteDeliveryPartnership() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: lastMileApi.deletePartnership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-partnerships'] })
      queryClient.invalidateQueries({ queryKey: ['last-mile-metrics'] })
    }
  })
}

export function useUpdateDeliveryTracking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ trackingId, updates }: { trackingId: string; updates: UpdateDeliveryTrackingRequest }) =>
      lastMileApi.updateDeliveryTracking(trackingId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-tracking'] })
    }
  })
} 