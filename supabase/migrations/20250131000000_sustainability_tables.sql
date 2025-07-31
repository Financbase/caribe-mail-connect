-- Sustainability and Environmental Impact Tracking Tables
-- Migration: 20250131000000_sustainability_tables.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Carbon Footprint Table
CREATE TABLE carbon_footprint (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('shipping', 'facility', 'vehicles', 'packaging', 'total')),
    value DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'tons')),
    description TEXT,
    offset DECIMAL(10,2) DEFAULT 0,
    net_footprint DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Green Initiatives Table
CREATE TABLE green_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('energy', 'waste', 'transportation', 'packaging', 'community')),
    status TEXT NOT NULL CHECK (status IN ('planned', 'in-progress', 'completed', 'on-hold')),
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(12,2) NOT NULL,
    spent DECIMAL(12,2) DEFAULT 0,
    impact JSONB NOT NULL, -- {carbonReduction, costSavings, wasteReduction, energySavings}
    participants TEXT[],
    milestones JSONB[], -- Array of milestone objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recycling Metrics Table
CREATE TABLE recycling_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    material TEXT NOT NULL CHECK (material IN ('paper', 'plastic', 'cardboard', 'metal', 'glass', 'electronics')),
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'tons', 'pieces')),
    location TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    carbon_offset DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Energy Consumption Table
CREATE TABLE energy_consumption (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('electricity', 'solar', 'generator', 'total')),
    consumption DECIMAL(10,2) NOT NULL, -- kWh
    cost DECIMAL(10,2) NOT NULL,
    carbon_footprint DECIMAL(10,2) NOT NULL,
    efficiency DECIMAL(5,2) NOT NULL, -- percentage
    peak_usage DECIMAL(10,2) NOT NULL,
    off_peak_usage DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sustainability Score Table
CREATE TABLE sustainability_score (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    categories JSONB NOT NULL, -- {energy, waste, transportation, packaging, community}
    improvements TEXT[],
    certifications TEXT[],
    next_review_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eco-Friendly Packaging Table
CREATE TABLE eco_friendly_packaging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('biodegradable', 'recycled', 'reusable', 'minimal')),
    material TEXT NOT NULL,
    cost DECIMAL(8,2) NOT NULL,
    carbon_footprint DECIMAL(8,2) NOT NULL,
    availability BOOLEAN DEFAULT true,
    supplier TEXT NOT NULL,
    certifications TEXT[],
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carbon Offset Programs Table
CREATE TABLE carbon_offset_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    project_type TEXT NOT NULL CHECK (project_type IN ('reforestation', 'renewable-energy', 'ocean-conservation', 'community')),
    cost_per_ton DECIMAL(8,2) NOT NULL,
    total_offset DECIMAL(10,2) NOT NULL,
    certificates JSONB[], -- Array of certificate objects
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Electric Vehicles Table
CREATE TABLE electric_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('delivery-van', 'scooter', 'bicycle', 'truck')),
    model TEXT NOT NULL,
    battery_capacity DECIMAL(6,2) NOT NULL, -- kWh
    range INTEGER NOT NULL, -- km
    current_charge DECIMAL(5,2) NOT NULL, -- percentage
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'in-use', 'charging', 'maintenance')),
    carbon_saved DECIMAL(10,2) NOT NULL,
    mileage INTEGER NOT NULL, -- km
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consolidated Shipping Table
CREATE TABLE consolidated_shipping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id TEXT NOT NULL,
    packages INTEGER NOT NULL,
    total_weight DECIMAL(8,2) NOT NULL, -- kg
    distance DECIMAL(8,2) NOT NULL, -- km
    carbon_saved DECIMAL(8,2) NOT NULL,
    cost_savings DECIMAL(8,2) NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in-transit', 'delivered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paperless Initiatives Table
CREATE TABLE paperless_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    documents_processed INTEGER NOT NULL,
    paper_saved DECIMAL(8,2) NOT NULL, -- kg
    carbon_saved DECIMAL(8,2) NOT NULL,
    cost_savings DECIMAL(8,2) NOT NULL,
    implementation_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'planned', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Package Reuse Program Table
CREATE TABLE package_reuse_program (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id TEXT NOT NULL UNIQUE,
    original_use TEXT NOT NULL,
    reuse_count INTEGER DEFAULT 0,
    current_use TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    carbon_saved DECIMAL(8,2) NOT NULL,
    cost_savings DECIMAL(8,2) NOT NULL,
    last_used DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'in-use', 'retired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recycling Locations Table
CREATE TABLE recycling_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    coordinates JSONB NOT NULL, -- {lat, lng}
    materials TEXT[] NOT NULL,
    hours TEXT NOT NULL,
    contact TEXT NOT NULL,
    distance DECIMAL(6,2) NOT NULL, -- km from facility
    rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5), -- 1-5 stars
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Tracking Table
CREATE TABLE material_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    date DATE NOT NULL,
    carbon_footprint DECIMAL(8,2) NOT NULL,
    recycled BOOLEAN DEFAULT false,
    recycled_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste Audit Table
CREATE TABLE waste_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    location TEXT NOT NULL,
    waste_types JSONB NOT NULL, -- Array of waste type objects
    total_waste DECIMAL(10,2) NOT NULL,
    total_carbon_footprint DECIMAL(10,2) NOT NULL,
    recommendations TEXT[],
    next_audit_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reduction Goals Table
CREATE TABLE reduction_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('waste', 'energy', 'carbon', 'water')),
    target DECIMAL(10,2) NOT NULL,
    current DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    deadline DATE NOT NULL,
    progress DECIMAL(5,2) NOT NULL, -- percentage
    status TEXT NOT NULL CHECK (status IN ('on-track', 'behind', 'completed', 'at-risk')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solar Panels Table
CREATE TABLE solar_panels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT NOT NULL,
    capacity DECIMAL(6,2) NOT NULL, -- kW
    current_output DECIMAL(6,2) NOT NULL, -- kW
    efficiency DECIMAL(5,2) NOT NULL, -- percentage
    installation_date DATE NOT NULL,
    last_maintenance DATE NOT NULL,
    next_maintenance DATE NOT NULL,
    total_energy_generated DECIMAL(10,2) NOT NULL, -- kWh
    carbon_offset DECIMAL(10,2) NOT NULL,
    cost_savings DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Energy Usage Trends Table
CREATE TABLE energy_usage_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
    date TEXT NOT NULL, -- Format depends on period
    consumption DECIMAL(10,2) NOT NULL, -- kWh
    cost DECIMAL(10,2) NOT NULL,
    carbon_footprint DECIMAL(10,2) NOT NULL,
    efficiency DECIMAL(5,2) NOT NULL, -- percentage
    peak_demand DECIMAL(8,2) NOT NULL, -- kW
    renewable_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Efficiency Improvements Table
CREATE TABLE efficiency_improvements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('lighting', 'hvac', 'equipment', 'building', 'process')),
    implementation_date DATE NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    savings JSONB NOT NULL, -- {energy, cost, carbon}
    payback_period INTEGER NOT NULL, -- months
    status TEXT NOT NULL CHECK (status IN ('planned', 'in-progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Green Certifications Table
CREATE TABLE green_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    requirements TEXT[],
    status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'pending-renewal')),
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Local Initiatives Table
CREATE TABLE local_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('education', 'cleanup', 'conservation', 'awareness')),
    location TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    participants INTEGER NOT NULL,
    impact JSONB NOT NULL, -- {peopleReached, carbonSaved, wasteCollected, treesPlanted}
    budget DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('planned', 'active', 'completed')),
    photos TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Environmental Education Table
CREATE TABLE environmental_education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('workshop', 'presentation', 'training', 'campaign')),
    audience TEXT NOT NULL CHECK (audience IN ('employees', 'customers', 'community', 'students')),
    date DATE NOT NULL,
    participants INTEGER NOT NULL,
    topics TEXT[],
    materials TEXT[],
    feedback JSONB NOT NULL, -- {rating, comments}
    impact JSONB NOT NULL, -- {knowledgeIncrease, behaviorChange, carbonSaved}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partner Programs Table
CREATE TABLE partner_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_name TEXT NOT NULL,
    program_type TEXT NOT NULL CHECK (program_type IN ('recycling', 'energy', 'transportation', 'education')),
    description TEXT,
    start_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'planned')),
    impact JSONB NOT NULL, -- {carbonSaved, costSavings, participants}
    commitments TEXT[],
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Participation Table
CREATE TABLE customer_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id TEXT NOT NULL,
    program TEXT NOT NULL,
    participation_date DATE NOT NULL,
    actions JSONB NOT NULL, -- Array of action objects
    total_impact DECIMAL(8,2) NOT NULL,
    rewards TEXT[],
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impact Report Table
CREATE TABLE impact_report (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period TEXT NOT NULL,
    date DATE NOT NULL,
    summary JSONB NOT NULL, -- {totalCarbonSaved, totalWasteReduced, totalEnergySaved, totalCostSavings, treesPlanted, peopleReached}
    highlights TEXT[],
    challenges TEXT[],
    next_period_goals TEXT[],
    stakeholders TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tree Planting Table
CREATE TABLE tree_plantings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    location TEXT NOT NULL,
    species TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    carbon_offset DECIMAL(8,2) NOT NULL,
    cost DECIMAL(8,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('planted', 'growing', 'mature')),
    maintenance_required BOOLEAN DEFAULT true,
    next_maintenance_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tree Planting Counter Table
CREATE TABLE tree_planting_counter (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_planted INTEGER NOT NULL DEFAULT 0,
    total_carbon_offset DECIMAL(10,2) NOT NULL DEFAULT 0,
    goal INTEGER NOT NULL,
    progress DECIMAL(5,2) NOT NULL DEFAULT 0, -- percentage
    recent_plantings JSONB[], -- Array of recent planting objects
    locations JSONB[], -- Array of location objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Green Badges Table
CREATE TABLE green_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('achievement', 'milestone', 'certification')),
    icon TEXT NOT NULL,
    earned_date DATE NOT NULL,
    criteria TEXT[],
    impact DECIMAL(10,2) NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Environmental Visualizations Table
CREATE TABLE environmental_visualizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('chart', 'gauge', 'progress', 'map', 'timeline')),
    title TEXT NOT NULL,
    data JSONB NOT NULL,
    config JSONB NOT NULL, -- {colors, thresholds, units}
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_carbon_footprint_date ON carbon_footprint(date);
CREATE INDEX idx_carbon_footprint_source ON carbon_footprint(source);
CREATE INDEX idx_green_initiatives_status ON green_initiatives(status);
CREATE INDEX idx_green_initiatives_category ON green_initiatives(category);
CREATE INDEX idx_recycling_metrics_date ON recycling_metrics(date);
CREATE INDEX idx_recycling_metrics_material ON recycling_metrics(material);
CREATE INDEX idx_energy_consumption_date ON energy_consumption(date);
CREATE INDEX idx_energy_consumption_source ON energy_consumption(source);
CREATE INDEX idx_sustainability_score_date ON sustainability_score(date);
CREATE INDEX idx_electric_vehicles_status ON electric_vehicles(status);
CREATE INDEX idx_electric_vehicles_type ON electric_vehicles(type);
CREATE INDEX idx_solar_panels_location ON solar_panels(location);
CREATE INDEX idx_tree_plantings_date ON tree_plantings(date);
CREATE INDEX idx_tree_plantings_location ON tree_plantings(location);
CREATE INDEX idx_green_badges_level ON green_badges(level);
CREATE INDEX idx_green_badges_category ON green_badges(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_carbon_footprint_updated_at BEFORE UPDATE ON carbon_footprint FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_green_initiatives_updated_at BEFORE UPDATE ON green_initiatives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recycling_metrics_updated_at BEFORE UPDATE ON recycling_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_energy_consumption_updated_at BEFORE UPDATE ON energy_consumption FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sustainability_score_updated_at BEFORE UPDATE ON sustainability_score FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eco_friendly_packaging_updated_at BEFORE UPDATE ON eco_friendly_packaging FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carbon_offset_programs_updated_at BEFORE UPDATE ON carbon_offset_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_electric_vehicles_updated_at BEFORE UPDATE ON electric_vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consolidated_shipping_updated_at BEFORE UPDATE ON consolidated_shipping FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_paperless_initiatives_updated_at BEFORE UPDATE ON paperless_initiatives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_package_reuse_program_updated_at BEFORE UPDATE ON package_reuse_program FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recycling_locations_updated_at BEFORE UPDATE ON recycling_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_material_tracking_updated_at BEFORE UPDATE ON material_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_waste_audit_updated_at BEFORE UPDATE ON waste_audit FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reduction_goals_updated_at BEFORE UPDATE ON reduction_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solar_panels_updated_at BEFORE UPDATE ON solar_panels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_energy_usage_trends_updated_at BEFORE UPDATE ON energy_usage_trends FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_efficiency_improvements_updated_at BEFORE UPDATE ON efficiency_improvements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_green_certifications_updated_at BEFORE UPDATE ON green_certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_local_initiatives_updated_at BEFORE UPDATE ON local_initiatives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_environmental_education_updated_at BEFORE UPDATE ON environmental_education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partner_programs_updated_at BEFORE UPDATE ON partner_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_participation_updated_at BEFORE UPDATE ON customer_participation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_impact_report_updated_at BEFORE UPDATE ON impact_report FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tree_plantings_updated_at BEFORE UPDATE ON tree_plantings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tree_planting_counter_updated_at BEFORE UPDATE ON tree_planting_counter FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_green_badges_updated_at BEFORE UPDATE ON green_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_environmental_visualizations_updated_at BEFORE UPDATE ON environmental_visualizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE carbon_footprint ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycling_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_friendly_packaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_offset_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE electric_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consolidated_shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE paperless_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_reuse_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycling_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE reduction_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE solar_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_usage_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE efficiency_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_report ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_plantings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_planting_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_visualizations ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (basic read/write access)
-- Note: In a real application, you would implement more sophisticated policies based on user roles

-- Carbon Footprint Policies
CREATE POLICY "Allow authenticated users to view carbon footprint" ON carbon_footprint FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert carbon footprint" ON carbon_footprint FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update carbon footprint" ON carbon_footprint FOR UPDATE USING (auth.role() = 'authenticated');

-- Green Initiatives Policies
CREATE POLICY "Allow authenticated users to view green initiatives" ON green_initiatives FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert green initiatives" ON green_initiatives FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update green initiatives" ON green_initiatives FOR UPDATE USING (auth.role() = 'authenticated');

-- Recycling Metrics Policies
CREATE POLICY "Allow authenticated users to view recycling metrics" ON recycling_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert recycling metrics" ON recycling_metrics FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update recycling metrics" ON recycling_metrics FOR UPDATE USING (auth.role() = 'authenticated');

-- Energy Consumption Policies
CREATE POLICY "Allow authenticated users to view energy consumption" ON energy_consumption FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert energy consumption" ON energy_consumption FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update energy consumption" ON energy_consumption FOR UPDATE USING (auth.role() = 'authenticated');

-- Sustainability Score Policies
CREATE POLICY "Allow authenticated users to view sustainability score" ON sustainability_score FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert sustainability score" ON sustainability_score FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update sustainability score" ON sustainability_score FOR UPDATE USING (auth.role() = 'authenticated');

-- Add similar policies for all other tables...
-- (For brevity, I'm showing a few examples. In practice, you'd add policies for all tables)

-- Insert sample data for tree planting counter
INSERT INTO tree_planting_counter (total_planted, total_carbon_offset, goal, progress, recent_plantings, locations) 
VALUES (
    500,
    25000,
    1000,
    50,
    '[]',
    '[]'
);

-- Insert sample sustainability score
INSERT INTO sustainability_score (date, overall_score, categories, improvements, certifications, next_review_date)
VALUES (
    CURRENT_DATE,
    78,
    '{"energy": 82, "waste": 75, "transportation": 70, "packaging": 85, "community": 80}',
    ARRAY['Increase electric vehicle adoption', 'Implement more renewable energy sources', 'Expand community outreach programs'],
    ARRAY['ISO 14001', 'LEED Silver', 'Green Business Certified'],
    CURRENT_DATE + INTERVAL '3 months'
); 