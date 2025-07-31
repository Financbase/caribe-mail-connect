// Last-Mile Delivery TypeScript Types
// Matches the database schema and API responses

export interface DeliveryRoute {
  id: string;
  name: string;
  driver_id?: string;
  territory_id?: string;
  status: 'active' | 'inactive' | 'optimizing' | 'completed';
  efficiency_score: number;
  delivery_count: number;
  average_time_minutes: number;
  fuel_efficiency_percentage: number;
  carbon_saved_kg: number;
  created_at: string;
  updated_at: string;
}

export interface RouteStop {
  id: string;
  route_id: string;
  stop_order: number;
  location_name: string;
  address: string;
  latitude: number;
  longitude: number;
  location_point?: string; // PostGIS geometry
  estimated_arrival?: string;
  actual_arrival?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'rescheduled';
  delivery_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverLocation {
  id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  location_point?: string; // PostGIS geometry
  heading?: number;
  speed_kmh?: number;
  battery_level?: number;
  is_online: boolean;
  last_activity: string;
  created_at: string;
}

export interface DeliveryPartnership {
  id: string;
  partner_name: string;
  partner_type: 'gig_driver' | 'courier_service' | 'bike_courier' | 'walking_courier';
  vehicle_type?: string;
  contact_email?: string;
  contact_phone?: string;
  rating: number;
  total_deliveries: number;
  successful_deliveries: number;
  background_check_status: 'pending' | 'approved' | 'rejected' | 'expired';
  background_check_expiry?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryTracking {
  id: string;
  route_id: string;
  stop_id: string;
  driver_id?: string;
  partner_id?: string;
  tracking_number: string;
  customer_email?: string;
  customer_phone?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  delivery_photo_url?: string;
  customer_feedback_rating?: number;
  customer_feedback_text?: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  created_at: string;
  updated_at: string;
}

export interface EfficiencyMetrics {
  id: string;
  route_id: string;
  date: string;
  fuel_consumed_liters: number;
  distance_km: number;
  carbon_emissions_kg: number;
  carbon_saved_kg: number;
  vehicle_type?: string;
  is_electric: boolean;
  battery_consumption_kwh: number;
  created_at: string;
}

export interface TrafficCondition {
  id: string;
  route_id: string;
  latitude: number;
  longitude: number;
  location_point?: string; // PostGIS geometry
  severity: 'low' | 'medium' | 'high' | 'severe';
  description?: string;
  estimated_delay_minutes: number;
  source: string;
  created_at: string;
  expires_at?: string;
}

// API Request/Response Types
export interface CreateDeliveryRouteRequest {
  name: string;
  driver_id?: string;
  territory_id?: string;
  stops: Omit<RouteStop, 'id' | 'route_id' | 'created_at' | 'updated_at'>[];
}

export interface UpdateDeliveryRouteRequest {
  name?: string;
  status?: DeliveryRoute['status'];
  efficiency_score?: number;
  delivery_count?: number;
  average_time_minutes?: number;
  fuel_efficiency_percentage?: number;
  carbon_saved_kg?: number;
}

export interface UpdateDriverLocationRequest {
  latitude: number;
  longitude: number;
  heading?: number;
  speed_kmh?: number;
  battery_level?: number;
  is_online?: boolean;
}

export interface CreateDeliveryPartnershipRequest {
  partner_name: string;
  partner_type: DeliveryPartnership['partner_type'];
  vehicle_type?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface UpdateDeliveryTrackingRequest {
  status?: DeliveryTracking['status'];
  actual_delivery_time?: string;
  delivery_photo_url?: string;
  customer_feedback_rating?: number;
  customer_feedback_text?: string;
}

export interface RouteOptimizationRequest {
  route_id: string;
  constraints: {
    max_distance_km?: number;
    max_time_minutes?: number;
    avoid_traffic?: boolean;
    prefer_electric_routes?: boolean;
  };
}

export interface RouteOptimizationResponse {
  optimized_route: DeliveryRoute;
  stops: RouteStop[];
  estimated_duration_minutes: number;
  estimated_distance_km: number;
  carbon_savings_kg: number;
  traffic_conditions: TrafficCondition[];
}

// Dashboard Metrics Types
export interface LastMileMetrics {
  total_deliveries: number;
  completed_today: number;
  average_delivery_time: number;
  efficiency_score: number;
  active_drivers: number;
  carbon_saved: number;
  total_routes: number;
  active_partnerships: number;
}

// Real-time Tracking Types
export interface LiveTrackingData {
  driver_locations: DriverLocation[];
  active_routes: DeliveryRoute[];
  route_stops: RouteStop[];
  traffic_conditions: TrafficCondition[];
  last_updated: string;
}

// Error Types
export interface LastMileError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Filter Types
export interface DeliveryRouteFilters {
  status?: DeliveryRoute['status'];
  driver_id?: string;
  territory_id?: string;
  date_from?: string;
  date_to?: string;
  efficiency_score_min?: number;
  efficiency_score_max?: number;
}

export interface DeliveryTrackingFilters {
  status?: DeliveryTracking['status'];
  route_id?: string;
  driver_id?: string;
  partner_id?: string;
  date_from?: string;
  date_to?: string;
  tracking_number?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// WebSocket Event Types
export interface LastMileWebSocketEvent {
  type: 'location_update' | 'status_change' | 'traffic_alert' | 'route_optimization';
  data: any;
  timestamp: string;
}

// Map Types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  type: 'driver' | 'stop' | 'traffic' | 'partnership';
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  status?: string;
  data: any;
} 