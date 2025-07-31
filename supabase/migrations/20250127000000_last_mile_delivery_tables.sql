-- Last-Mile Delivery Database Schema
-- Migration: 20250127000000_last_mile_delivery_tables.sql

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Delivery routes table
CREATE TABLE delivery_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    territory_id UUID,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'optimizing', 'completed')),
    efficiency_score INTEGER DEFAULT 0 CHECK (efficiency_score >= 0 AND efficiency_score <= 100),
    delivery_count INTEGER DEFAULT 0,
    average_time_minutes INTEGER DEFAULT 0,
    fuel_efficiency_percentage INTEGER DEFAULT 0 CHECK (fuel_efficiency_percentage >= 0 AND fuel_efficiency_percentage <= 100),
    carbon_saved_kg DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route stops table
CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES delivery_routes(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    location_point GEOMETRY(POINT, 4326),
    estimated_arrival TIMESTAMP WITH TIME ZONE,
    actual_arrival TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'failed', 'rescheduled')),
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver locations table for real-time tracking
CREATE TABLE driver_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    location_point GEOMETRY(POINT, 4326),
    heading DECIMAL(5,2),
    speed_kmh DECIMAL(5,2),
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    is_online BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery partnerships table
CREATE TABLE delivery_partnerships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name VARCHAR(255) NOT NULL,
    partner_type VARCHAR(50) NOT NULL CHECK (partner_type IN ('gig_driver', 'courier_service', 'bike_courier', 'walking_courier')),
    vehicle_type VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_deliveries INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    background_check_status VARCHAR(50) DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected', 'expired')),
    background_check_expiry DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery tracking table
CREATE TABLE delivery_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES delivery_routes(id) ON DELETE CASCADE,
    stop_id UUID REFERENCES route_stops(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES delivery_partnerships(id) ON DELETE SET NULL,
    tracking_number VARCHAR(100) UNIQUE,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    delivery_photo_url TEXT,
    customer_feedback_rating INTEGER CHECK (customer_feedback_rating >= 1 AND customer_feedback_rating <= 5),
    customer_feedback_text TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Efficiency metrics table
CREATE TABLE efficiency_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES delivery_routes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    fuel_consumed_liters DECIMAL(8,2) DEFAULT 0,
    distance_km DECIMAL(8,2) DEFAULT 0,
    carbon_emissions_kg DECIMAL(8,2) DEFAULT 0,
    carbon_saved_kg DECIMAL(8,2) DEFAULT 0,
    vehicle_type VARCHAR(50),
    is_electric BOOLEAN DEFAULT false,
    battery_consumption_kwh DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic conditions table
CREATE TABLE traffic_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES delivery_routes(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    location_point GEOMETRY(POINT, 4326),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'severe')),
    description TEXT,
    estimated_delay_minutes INTEGER DEFAULT 0,
    source VARCHAR(50) DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_delivery_routes_driver_id ON delivery_routes(driver_id);
CREATE INDEX idx_delivery_routes_status ON delivery_routes(status);
CREATE INDEX idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX idx_route_stops_status ON route_stops(status);
CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_location_point ON driver_locations USING GIST(location_point);
CREATE INDEX idx_delivery_tracking_route_id ON delivery_tracking(route_id);
CREATE INDEX idx_delivery_tracking_status ON delivery_tracking(status);
CREATE INDEX idx_delivery_tracking_tracking_number ON delivery_tracking(tracking_number);
CREATE INDEX idx_efficiency_metrics_route_id ON efficiency_metrics(route_id);
CREATE INDEX idx_efficiency_metrics_date ON efficiency_metrics(date);
CREATE INDEX idx_traffic_conditions_location_point ON traffic_conditions USING GIST(location_point);
CREATE INDEX idx_traffic_conditions_expires_at ON traffic_conditions(expires_at);

-- Create spatial indexes for geographic queries
CREATE INDEX idx_route_stops_location_point ON route_stops USING GIST(location_point);
CREATE INDEX idx_driver_locations_location_point_spatial ON driver_locations USING GIST(location_point);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_delivery_routes_updated_at BEFORE UPDATE ON delivery_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_route_stops_updated_at BEFORE UPDATE ON route_stops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_partnerships_updated_at BEFORE UPDATE ON delivery_partnerships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_tracking_updated_at BEFORE UPDATE ON delivery_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE efficiency_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_conditions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be enhanced with proper tenant isolation)
CREATE POLICY "Users can view their own delivery routes" ON delivery_routes FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Users can view their own route stops" ON route_stops FOR SELECT USING (route_id IN (SELECT id FROM delivery_routes WHERE driver_id = auth.uid()));
CREATE POLICY "Users can view their own location" ON driver_locations FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Users can view delivery tracking" ON delivery_tracking FOR SELECT USING (true);
CREATE POLICY "Users can view efficiency metrics" ON efficiency_metrics FOR SELECT USING (true);
CREATE POLICY "Users can view traffic conditions" ON traffic_conditions FOR SELECT USING (true); 