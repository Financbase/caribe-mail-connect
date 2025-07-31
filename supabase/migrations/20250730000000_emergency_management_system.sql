-- Emergency Management System Database Schema
-- Migration: 20250730000000_emergency_management_system.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Emergency Events Table
CREATE TABLE emergency_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('hurricane', 'flood', 'power', 'security', 'medical', 'fire', 'earthquake')),
    severity_level VARCHAR(20) NOT NULL CHECK (severity_level IN ('normal', 'watch', 'warning', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
    affected_areas TEXT[],
    evacuation_mode BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Contacts Table
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Resources Table
CREATE TABLE emergency_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('supplies', 'equipment', 'fuel', 'generator', 'vehicle', 'medical')),
    quantity INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(20),
    minimum_quantity INTEGER DEFAULT 0,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'low', 'critical', 'unavailable')),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hurricane Tracking Table
CREATE TABLE hurricane_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hurricane_name VARCHAR(100) NOT NULL,
    category INTEGER CHECK (category >= 1 AND category <= 5),
    wind_speed INTEGER, -- in mph
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    distance_from_pr DECIMAL(10, 2), -- in miles
    eta TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'approaching' CHECK (status IN ('approaching', 'landfall', 'passing', 'departed')),
    forecast_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Procedures Table
CREATE TABLE emergency_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_type VARCHAR(50) NOT NULL CHECK (procedure_type IN ('evacuation', 'shelter', 'communication', 'recovery', 'medical')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL, -- Array of step objects
    category VARCHAR(50), -- For hurricane categories
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Staff Status Table
CREATE TABLE emergency_staff_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'evacuated', 'unreachable')),
    location VARCHAR(255),
    role VARCHAR(100),
    emergency_event_id UUID REFERENCES emergency_events(id),
    last_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Communications Table
CREATE TABLE emergency_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_event_id UUID REFERENCES emergency_events(id),
    communication_type VARCHAR(50) NOT NULL CHECK (communication_type IN ('alert', 'update', 'instruction', 'status')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recipients JSONB, -- Array of recipient IDs or groups
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Continuity Table
CREATE TABLE business_continuity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_event_id UUID REFERENCES emergency_events(id),
    backup_site VARCHAR(255),
    data_recovery_status VARCHAR(20) DEFAULT 'pending' CHECK (data_recovery_status IN ('pending', 'in_progress', 'completed', 'failed')),
    service_status VARCHAR(20) DEFAULT 'operational' CHECK (service_status IN ('operational', 'degraded', 'critical', 'down')),
    staff_coordination_status VARCHAR(20) DEFAULT 'pending' CHECK (staff_coordination_status IN ('pending', 'in_progress', 'completed')),
    customer_communication_status VARCHAR(20) DEFAULT 'pending' CHECK (customer_communication_status IN ('pending', 'in_progress', 'completed')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Logistics Table
CREATE TABLE emergency_logistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_event_id UUID REFERENCES emergency_events(id),
    priority_packages_count INTEGER DEFAULT 0,
    emergency_supplies_status VARCHAR(20) DEFAULT 'adequate' CHECK (emergency_supplies_status IN ('adequate', 'low', 'critical')),
    generator_status VARCHAR(20) DEFAULT 'operational' CHECK (generator_status IN ('operational', 'maintenance', 'fuel_low', 'offline')),
    fuel_reserves_status VARCHAR(20) DEFAULT 'adequate' CHECK (fuel_reserves_status IN ('adequate', 'low', 'critical')),
    communication_systems_status VARCHAR(20) DEFAULT 'operational' CHECK (communication_systems_status IN ('operational', 'limited', 'down')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Emergency Recovery Table
CREATE TABLE post_emergency_recovery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_event_id UUID REFERENCES emergency_events(id),
    damage_assessment_status VARCHAR(20) DEFAULT 'pending' CHECK (damage_assessment_status IN ('pending', 'in_progress', 'completed')),
    insurance_documentation_status VARCHAR(20) DEFAULT 'pending' CHECK (insurance_documentation_status IN ('pending', 'in_progress', 'completed')),
    recovery_timeline JSONB, -- Array of recovery tasks with dates
    customer_updates_status VARCHAR(20) DEFAULT 'pending' CHECK (customer_updates_status IN ('pending', 'in_progress', 'completed')),
    lessons_learned TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Alerts Table
CREATE TABLE weather_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('hurricane', 'flood', 'storm', 'heat', 'wind', 'tornado')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('watch', 'warning', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'NOAA',
    external_id VARCHAR(100), -- External weather service ID
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Audit Log Table
CREATE TABLE emergency_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_event_id UUID REFERENCES emergency_events(id),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_emergency_events_status ON emergency_events(status, severity_level);
CREATE INDEX idx_emergency_events_type ON emergency_events(event_type);
CREATE INDEX idx_emergency_contacts_priority ON emergency_contacts(priority, is_active);
CREATE INDEX idx_emergency_resources_status ON emergency_resources(status, resource_type);
CREATE INDEX idx_hurricane_tracking_status ON hurricane_tracking(status);
CREATE INDEX idx_emergency_staff_status_user ON emergency_staff_status(user_id, status);
CREATE INDEX idx_emergency_communications_event ON emergency_communications(emergency_event_id);
CREATE INDEX idx_weather_alerts_active ON weather_alerts(is_active, severity);

-- Create spatial index for hurricane tracking
CREATE INDEX idx_hurricane_tracking_location ON hurricane_tracking USING GIST (ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326));

-- Enable Row Level Security (RLS)
ALTER TABLE emergency_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE hurricane_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_staff_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_continuity ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_emergency_recovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Emergency Events: All authenticated users can read, only admins can write
CREATE POLICY "Emergency events read access" ON emergency_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Emergency events write access" ON emergency_events FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Emergency Contacts: All authenticated users can read, only admins can write
CREATE POLICY "Emergency contacts read access" ON emergency_contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Emergency contacts write access" ON emergency_contacts FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Emergency Resources: All authenticated users can read, only admins can write
CREATE POLICY "Emergency resources read access" ON emergency_resources FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Emergency resources write access" ON emergency_resources FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Hurricane Tracking: Public read access, admin write access
CREATE POLICY "Hurricane tracking read access" ON hurricane_tracking FOR SELECT USING (true);
CREATE POLICY "Hurricane tracking write access" ON hurricane_tracking FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Emergency Procedures: All authenticated users can read, only admins can write
CREATE POLICY "Emergency procedures read access" ON emergency_procedures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Emergency procedures write access" ON emergency_procedures FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Emergency Staff Status: Users can read all, update their own status
CREATE POLICY "Emergency staff status read access" ON emergency_staff_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Emergency staff status update access" ON emergency_staff_status FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Emergency staff status insert access" ON emergency_staff_status FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Emergency Communications: All authenticated users can read, only admins can write
CREATE POLICY "Emergency communications read access" ON emergency_communications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Emergency communications write access" ON emergency_communications FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Business Continuity: All authenticated users can read, only admins can write
CREATE POLICY "Business continuity read access" ON business_continuity FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Business continuity write access" ON business_continuity FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Emergency Logistics: All authenticated users can read, only admins can write
CREATE POLICY "Emergency logistics read access" ON emergency_logistics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Emergency logistics write access" ON emergency_logistics FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Post Emergency Recovery: All authenticated users can read, only admins can write
CREATE POLICY "Post emergency recovery read access" ON post_emergency_recovery FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Post emergency recovery write access" ON post_emergency_recovery FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Weather Alerts: Public read access, admin write access
CREATE POLICY "Weather alerts read access" ON weather_alerts FOR SELECT USING (true);
CREATE POLICY "Weather alerts write access" ON weather_alerts FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Emergency Audit Log: Read-only for admins
CREATE POLICY "Emergency audit log read access" ON emergency_audit_log FOR SELECT USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));
CREATE POLICY "Emergency audit log insert access" ON emergency_audit_log FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_emergency_events_updated_at BEFORE UPDATE ON emergency_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_resources_updated_at BEFORE UPDATE ON emergency_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hurricane_tracking_updated_at BEFORE UPDATE ON hurricane_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_procedures_updated_at BEFORE UPDATE ON emergency_procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_staff_status_updated_at BEFORE UPDATE ON emergency_staff_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_continuity_updated_at BEFORE UPDATE ON business_continuity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_logistics_updated_at BEFORE UPDATE ON emergency_logistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_emergency_recovery_updated_at BEFORE UPDATE ON post_emergency_recovery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weather_alerts_updated_at BEFORE UPDATE ON weather_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample emergency contacts
INSERT INTO emergency_contacts (name, role, phone, email, priority, department) VALUES
('Centro de Emergencias', 'Coordinador Principal', '+1-787-555-0001', 'emergency@prmcms.com', 'high', 'Emergency Management'),
('Policía Local', 'Seguridad', '+1-787-555-0002', 'police@local.gov', 'high', 'Security'),
('Bomberos', 'Emergencias', '+1-787-555-0003', 'fire@local.gov', 'high', 'Fire Department'),
('Hospital Regional', 'Médico', '+1-787-555-0004', 'hospital@regional.gov', 'high', 'Medical'),
('Oficina de Manejo de Emergencias', 'Coordinación', '+1-787-555-0005', 'oem@pr.gov', 'high', 'Government'),
('Protección Civil', 'Evacuación', '+1-787-555-0006', 'civil@pr.gov', 'high', 'Civil Protection'),
('Cruz Roja', 'Asistencia', '+1-787-555-0007', 'cruzroja@pr.org', 'medium', 'Humanitarian'),
('Compañía Eléctrica', 'Servicios', '+1-787-555-0008', 'power@utility.pr', 'medium', 'Utilities'),
('Compañía de Agua', 'Servicios', '+1-787-555-0009', 'water@utility.pr', 'medium', 'Utilities'),
('Transporte de Emergencia', 'Logística', '+1-787-555-0010', 'transport@emergency.pr', 'medium', 'Logistics');

-- Insert sample emergency resources
INSERT INTO emergency_resources (name, resource_type, quantity, unit, minimum_quantity, location, status) VALUES
('Generador Principal', 'generator', 1, 'unit', 1, 'Sala de Equipos', 'available'),
('Combustible Diesel', 'fuel', 500, 'gallons', 100, 'Tanque Principal', 'available'),
('Agua Potable', 'supplies', 1000, 'bottles', 200, 'Almacén', 'available'),
('Comida de Emergencia', 'supplies', 500, 'meals', 100, 'Almacén', 'available'),
('Botiquín de Primeros Auxilios', 'medical', 10, 'kits', 5, 'Sala Médica', 'available'),
('Radio de Emergencia', 'equipment', 5, 'units', 2, 'Sala de Comunicaciones', 'available'),
('Linternas', 'equipment', 50, 'units', 20, 'Almacén', 'available'),
('Baterías', 'supplies', 200, 'packs', 50, 'Almacén', 'available'),
('Mantas de Emergencia', 'supplies', 100, 'units', 25, 'Almacén', 'available'),
('Equipo de Comunicación Satelital', 'equipment', 2, 'units', 1, 'Sala de Comunicaciones', 'available');

-- Insert sample emergency procedures
INSERT INTO emergency_procedures (procedure_type, title, description, steps, category) VALUES
('evacuation', 'Procedimiento de Evacuación - Huracán Categoría 1-2', 'Procedimiento de evacuación para huracanes de categoría 1-2', 
'[
  {"step": 1, "action": "Activar alerta de evacuación", "timeframe": "Inmediato"},
  {"step": 2, "action": "Notificar a todo el personal", "timeframe": "5 minutos"},
  {"step": 3, "action": "Asegurar documentos críticos", "timeframe": "15 minutos"},
  {"step": 4, "action": "Evacuar personal no esencial", "timeframe": "30 minutos"},
  {"step": 5, "action": "Cerrar y asegurar instalaciones", "timeframe": "45 minutos"}
]', '1-2'),

('evacuation', 'Procedimiento de Evacuación - Huracán Categoría 3-5', 'Procedimiento de evacuación para huracanes de categoría 3-5', 
'[
  {"step": 1, "action": "Activar evacuación inmediata", "timeframe": "Inmediato"},
  {"step": 2, "action": "Evacuar todo el personal", "timeframe": "15 minutos"},
  {"step": 3, "action": "Asegurar instalaciones críticas", "timeframe": "30 minutos"},
  {"step": 4, "action": "Activar modo de emergencia", "timeframe": "45 minutos"},
  {"step": 5, "action": "Establecer centro de mando alternativo", "timeframe": "1 hora"}
]', '3-5'),

('communication', 'Protocolo de Comunicación de Emergencia', 'Protocolo para comunicaciones durante emergencias', 
'[
  {"step": 1, "action": "Activar sistema de alertas", "timeframe": "Inmediato"},
  {"step": 2, "action": "Contactar personal clave", "timeframe": "5 minutos"},
  {"step": 3, "action": "Establecer cadena de mando", "timeframe": "10 minutos"},
  {"step": 4, "action": "Comunicar con autoridades", "timeframe": "15 minutos"},
  {"step": 5, "action": "Actualizar clientes", "timeframe": "30 minutos"}
]', 'all'),

('recovery', 'Plan de Recuperación Post-Emergencia', 'Plan para recuperación después de una emergencia', 
'[
  {"step": 1, "action": "Evaluar daños", "timeframe": "Inmediato"},
  {"step": 2, "action": "Contactar seguros", "timeframe": "1 hora"},
  {"step": 3, "action": "Restaurar servicios críticos", "timeframe": "4 horas"},
  {"step": 4, "action": "Reintegrar personal", "timeframe": "24 horas"},
  {"step": 5, "action": "Evaluar lecciones aprendidas", "timeframe": "1 semana"}
]', 'all');

-- Create view for emergency dashboard
CREATE VIEW emergency_dashboard AS
SELECT 
    ee.id as event_id,
    ee.event_type,
    ee.severity_level,
    ee.title,
    ee.status,
    ee.evacuation_mode,
    ee.start_time,
    ee.end_time,
    COUNT(ess.id) as staff_present,
    COUNT(ess.id) FILTER (WHERE ess.status = 'present') as staff_available,
    COUNT(er.id) FILTER (WHERE er.status = 'critical') as critical_resources,
    COUNT(wa.id) FILTER (WHERE wa.is_active = true) as active_alerts
FROM emergency_events ee
LEFT JOIN emergency_staff_status ess ON ee.id = ess.emergency_event_id
LEFT JOIN emergency_resources er ON er.status = 'critical'
LEFT JOIN weather_alerts wa ON wa.is_active = true
WHERE ee.status = 'active'
GROUP BY ee.id, ee.event_type, ee.severity_level, ee.title, ee.status, ee.evacuation_mode, ee.start_time, ee.end_time;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create emergency management functions
CREATE OR REPLACE FUNCTION activate_emergency(
    p_event_type VARCHAR(50),
    p_severity_level VARCHAR(20),
    p_title VARCHAR(255),
    p_description TEXT,
    p_location VARCHAR(255),
    p_affected_areas TEXT[]
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO emergency_events (
        event_type, 
        severity_level, 
        title, 
        description, 
        location, 
        affected_areas,
        created_by
    ) VALUES (
        p_event_type,
        p_severity_level,
        p_title,
        p_description,
        p_location,
        p_affected_areas,
        auth.uid()
    ) RETURNING id INTO v_event_id;
    
    -- Log the action
    INSERT INTO emergency_audit_log (emergency_event_id, user_id, action, details)
    VALUES (v_event_id, auth.uid(), 'emergency_activated', jsonb_build_object('event_type', p_event_type, 'severity', p_severity_level));
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION deactivate_emergency(p_event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE emergency_events 
    SET status = 'resolved', updated_at = NOW()
    WHERE id = p_event_id;
    
    -- Log the action
    INSERT INTO emergency_audit_log (emergency_event_id, user_id, action, details)
    VALUES (p_event_id, auth.uid(), 'emergency_deactivated', '{}');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get emergency status
CREATE OR REPLACE FUNCTION get_emergency_status()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'active_emergencies', (
            SELECT COUNT(*) FROM emergency_events WHERE status = 'active'
        ),
        'critical_emergencies', (
            SELECT COUNT(*) FROM emergency_events WHERE status = 'active' AND severity_level = 'critical'
        ),
        'staff_present', (
            SELECT COUNT(*) FROM emergency_staff_status WHERE status = 'present'
        ),
        'critical_resources', (
            SELECT COUNT(*) FROM emergency_resources WHERE status = 'critical'
        ),
        'active_alerts', (
            SELECT COUNT(*) FROM weather_alerts WHERE is_active = true
        ),
        'evacuation_mode', (
            SELECT EXISTS(SELECT 1 FROM emergency_events WHERE status = 'active' AND evacuation_mode = true)
        )
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 