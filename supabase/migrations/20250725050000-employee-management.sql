-- Employee Management System Migration
-- Comprehensive employee management features for PRMCMS

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Employees table
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    photo_url TEXT,
    date_of_birth DATE,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location_id UUID REFERENCES public.locations(id),
    supervisor_id UUID REFERENCES public.employees(id),
    hourly_rate DECIMAL(10,2) NOT NULL,
    overtime_rate DECIMAL(10,2) DEFAULT 1.5,
    commission_rate DECIMAL(5,4) DEFAULT 0.0000,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated', 'on_leave')),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Puerto Rico',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee shifts table
CREATE TABLE public.employee_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start_time TIME,
    break_end_time TIME,
    shift_type VARCHAR(50) DEFAULT 'regular' CHECK (shift_type IN ('regular', 'overtime', 'holiday', 'weekend', 'night')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    clock_in_time TIMESTAMP WITH TIME ZONE,
    clock_out_time TIMESTAMP WITH TIME ZONE,
    break_clock_in_time TIMESTAMP WITH TIME ZONE,
    break_clock_out_time TIMESTAMP WITH TIME ZONE,
    total_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, shift_date)
);

-- Shift swap requests table
CREATE TABLE public.shift_swap_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.employees(id),
    requested_shift_id UUID NOT NULL REFERENCES public.employee_shifts(id),
    offered_shift_id UUID NOT NULL REFERENCES public.employee_shifts(id),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by UUID REFERENCES public.employees(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee performance metrics table
CREATE TABLE public.employee_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    packages_processed INTEGER DEFAULT 0,
    packages_per_hour DECIMAL(5,2),
    customer_satisfaction_rating DECIMAL(3,2) CHECK (customer_satisfaction_rating >= 0 AND customer_satisfaction_rating <= 5),
    attendance_score DECIMAL(3,2) DEFAULT 1.0 CHECK (attendance_score >= 0 AND attendance_score <= 1),
    training_completion_rate DECIMAL(5,4) DEFAULT 0.0000 CHECK (training_completion_rate >= 0 AND training_completion_rate <= 1),
    safety_incidents INTEGER DEFAULT 0,
    quality_score DECIMAL(3,2) DEFAULT 1.0 CHECK (quality_score >= 0 AND quality_score <= 1),
    notes TEXT,
    evaluated_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Employee recognition/rewards table
CREATE TABLE public.employee_recognition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    recognition_type VARCHAR(50) NOT NULL CHECK (recognition_type IN ('employee_of_month', 'safety_award', 'customer_service', 'efficiency', 'teamwork', 'innovation', 'attendance', 'training_completion')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    reward_amount DECIMAL(10,2) DEFAULT 0,
    reward_type VARCHAR(50) DEFAULT 'monetary' CHECK (reward_type IN ('monetary', 'gift_card', 'time_off', 'certificate', 'other')),
    awarded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    awarded_by UUID REFERENCES public.employees(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training modules table
CREATE TABLE public.training_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration_minutes INTEGER NOT NULL,
    video_url TEXT,
    document_url TEXT,
    quiz_questions JSONB,
    passing_score INTEGER DEFAULT 80,
    is_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee training progress table
CREATE TABLE public.employee_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    training_module_id UUID NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    quiz_score INTEGER,
    attempts INTEGER DEFAULT 0,
    certificate_url TEXT,
    notes TEXT,
    assigned_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, training_module_id)
);

-- Onboarding checklists table
CREATE TABLE public.onboarding_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    checklist_item VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES public.employees(id),
    notes TEXT,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll periods table
CREATE TABLE public.payroll_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    pay_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'processing', 'completed', 'cancelled')),
    total_employees INTEGER DEFAULT 0,
    total_hours DECIMAL(10,2) DEFAULT 0,
    total_overtime_hours DECIMAL(10,2) DEFAULT 0,
    total_pay DECIMAL(12,2) DEFAULT 0,
    total_commission DECIMAL(10,2) DEFAULT 0,
    total_tips DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(period_start_date, period_end_date)
);

-- Employee payroll records table
CREATE TABLE public.employee_payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    payroll_period_id UUID NOT NULL REFERENCES public.payroll_periods(id) ON DELETE CASCADE,
    regular_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    holiday_hours DECIMAL(5,2) DEFAULT 0,
    regular_pay DECIMAL(10,2) DEFAULT 0,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    holiday_pay DECIMAL(10,2) DEFAULT 0,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    tips_amount DECIMAL(10,2) DEFAULT 0,
    bonuses DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    net_pay DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    payment_method VARCHAR(50) DEFAULT 'direct_deposit',
    payment_reference VARCHAR(100),
    notes TEXT,
    processed_by UUID REFERENCES public.employees(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, payroll_period_id)
);

-- Time clock entries table
CREATE TABLE public.time_clock_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    entry_type VARCHAR(20) NOT NULL CHECK (entry_type IN ('clock_in', 'clock_out', 'break_start', 'break_end')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    location_id UUID REFERENCES public.locations(id),
    device_id VARCHAR(100),
    ip_address INET,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_employees_location_id ON public.employees(location_id);
CREATE INDEX idx_employees_supervisor_id ON public.employees(supervisor_id);
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_employee_shifts_employee_id ON public.employee_shifts(employee_id);
CREATE INDEX idx_employee_shifts_date ON public.employee_shifts(shift_date);
CREATE INDEX idx_employee_shifts_status ON public.employee_shifts(status);
CREATE INDEX idx_shift_swap_requests_requester_id ON public.shift_swap_requests(requester_id);
CREATE INDEX idx_shift_swap_requests_status ON public.shift_swap_requests(status);
CREATE INDEX idx_employee_performance_employee_id ON public.employee_performance(employee_id);
CREATE INDEX idx_employee_performance_date ON public.employee_performance(date);
CREATE INDEX idx_employee_training_employee_id ON public.employee_training(employee_id);
CREATE INDEX idx_employee_training_status ON public.employee_training(status);
CREATE INDEX idx_payroll_periods_status ON public.payroll_periods(status);
CREATE INDEX idx_employee_payroll_employee_id ON public.employee_payroll(employee_id);
CREATE INDEX idx_employee_payroll_period_id ON public.employee_payroll(payroll_period_id);
CREATE INDEX idx_time_clock_entries_employee_id ON public.time_clock_entries(employee_id);
CREATE INDEX idx_time_clock_entries_timestamp ON public.time_clock_entries(timestamp);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_clock_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Employees policies
CREATE POLICY "Employees can view their own data" ON public.employees
    FOR SELECT USING (auth.uid()::text = id::text OR auth.uid()::text IN (
        SELECT id::text FROM public.employees WHERE supervisor_id::text = auth.uid()::text
    ));

CREATE POLICY "Managers can view all employees" ON public.employees
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

CREATE POLICY "HR can manage employees" ON public.employees
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('HR Manager', 'HR Specialist')
    ));

-- Employee shifts policies
CREATE POLICY "Employees can view their own shifts" ON public.employee_shifts
    FOR SELECT USING (employee_id::text = auth.uid()::text);

CREATE POLICY "Managers can view all shifts" ON public.employee_shifts
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

CREATE POLICY "Managers can manage shifts" ON public.employee_shifts
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

-- Performance policies
CREATE POLICY "Employees can view their own performance" ON public.employee_performance
    FOR SELECT USING (employee_id::text = auth.uid()::text);

CREATE POLICY "Managers can view all performance" ON public.employee_performance
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

CREATE POLICY "Managers can manage performance" ON public.employee_performance
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

-- Training policies
CREATE POLICY "Employees can view their own training" ON public.employee_training
    FOR SELECT USING (employee_id::text = auth.uid()::text);

CREATE POLICY "Managers can view all training" ON public.employee_training
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

CREATE POLICY "Managers can manage training" ON public.employee_training
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

-- Payroll policies (restricted to HR and managers)
CREATE POLICY "HR can manage payroll" ON public.employee_payroll
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('HR Manager', 'HR Specialist', 'Manager')
    ));

-- Time clock policies
CREATE POLICY "Employees can view their own time entries" ON public.time_clock_entries
    FOR SELECT USING (employee_id::text = auth.uid()::text);

CREATE POLICY "Employees can create their own time entries" ON public.time_clock_entries
    FOR INSERT WITH CHECK (employee_id::text = auth.uid()::text);

CREATE POLICY "Managers can view all time entries" ON public.time_clock_entries
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.employees WHERE id::text = auth.uid()::text AND position IN ('Manager', 'Supervisor', 'HR Manager')
    ));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_shifts_updated_at BEFORE UPDATE ON public.employee_shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_swap_requests_updated_at BEFORE UPDATE ON public.shift_swap_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_performance_updated_at BEFORE UPDATE ON public.employee_performance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_recognition_updated_at BEFORE UPDATE ON public.employee_recognition
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON public.training_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_training_updated_at BEFORE UPDATE ON public.employee_training
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_checklists_updated_at BEFORE UPDATE ON public.onboarding_checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_periods_updated_at BEFORE UPDATE ON public.payroll_periods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_payroll_updated_at BEFORE UPDATE ON public.employee_payroll
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for common operations
CREATE OR REPLACE FUNCTION calculate_shift_hours(
    p_shift_id UUID
) RETURNS DECIMAL(5,2) AS $$
DECLARE
    shift_record RECORD;
    total_hours DECIMAL(5,2) := 0;
    overtime_hours DECIMAL(5,2) := 0;
BEGIN
    SELECT * INTO shift_record FROM public.employee_shifts WHERE id = p_shift_id;
    
    IF shift_record.clock_in_time IS NOT NULL AND shift_record.clock_out_time IS NOT NULL THEN
        -- Calculate total hours excluding break time
        total_hours := EXTRACT(EPOCH FROM (shift_record.clock_out_time - shift_record.clock_in_time)) / 3600;
        
        -- Subtract break time if taken
        IF shift_record.break_clock_in_time IS NOT NULL AND shift_record.break_clock_out_time IS NOT NULL THEN
            total_hours := total_hours - (EXTRACT(EPOCH FROM (shift_record.break_clock_out_time - shift_record.break_clock_in_time)) / 3600);
        END IF;
        
        -- Calculate overtime (hours over 8 per day)
        IF total_hours > 8 THEN
            overtime_hours := total_hours - 8;
            total_hours := 8;
        END IF;
        
        -- Update the shift record
        UPDATE public.employee_shifts 
        SET total_hours = total_hours, overtime_hours = overtime_hours
        WHERE id = p_shift_id;
    END IF;
    
    RETURN total_hours + overtime_hours;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_employee_id() RETURNS VARCHAR(20) AS $$
DECLARE
    new_id VARCHAR(20);
    counter INTEGER := 1;
BEGIN
    LOOP
        new_id := 'EMP' || LPAD(counter::text, 4, '0');
        
        -- Check if ID already exists
        IF NOT EXISTS (SELECT 1 FROM public.employees WHERE employee_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Insert sample training modules
INSERT INTO public.training_modules (title, description, category, difficulty_level, estimated_duration_minutes, is_required, quiz_questions) VALUES
('Safety Protocols', 'Learn about workplace safety procedures and emergency protocols', 'Safety', 'beginner', 30, true, '[]'),
('Customer Service Excellence', 'Best practices for delivering exceptional customer service', 'Customer Service', 'beginner', 45, true, '[]'),
('Package Handling Procedures', 'Proper techniques for handling and sorting packages', 'Operations', 'beginner', 60, true, '[]'),
('Route Optimization', 'Learn to optimize delivery routes for efficiency', 'Operations', 'intermediate', 90, false, '[]'),
('Advanced Inventory Management', 'Advanced techniques for inventory tracking and management', 'Inventory', 'advanced', 120, false, '[]'),
('Compliance and Regulations', 'Understanding legal requirements and compliance standards', 'Compliance', 'intermediate', 75, true, '[]'),
('Technology Systems', 'Training on company software and technology tools', 'Technology', 'beginner', 60, true, '[]'),
('Leadership Skills', 'Developing leadership and team management skills', 'Leadership', 'advanced', 150, false, '[]');

-- Insert sample employees with mock data
INSERT INTO public.employees (employee_id, first_name, last_name, email, phone, photo_url, date_of_birth, hire_date, position, department, location_id, hourly_rate, commission_rate, status, emergency_contact_name, emergency_contact_phone, address, city, state, zip_code) VALUES
('EMP0001', 'María', 'González', 'maria.gonzalez@caribemail.com', '+1-787-555-0101', 'https://ui-avatars.com/api/?name=María+González&background=random', '1985-03-15', '2023-01-15', 'Manager', 'Operations', NULL, 25.00, 0.0500, 'active', 'Carlos González', '+1-787-555-0102', '123 Calle Principal', 'San Juan', 'PR', '00901'),
('EMP0002', 'José', 'Rodríguez', 'jose.rodriguez@caribemail.com', '+1-787-555-0103', 'https://ui-avatars.com/api/?name=José+Rodríguez&background=random', '1990-07-22', '2023-02-01', 'Driver', 'Delivery', NULL, 18.50, 0.0300, 'active', 'Ana Rodríguez', '+1-787-555-0104', '456 Avenida Central', 'Bayamón', 'PR', '00961'),
('EMP0003', 'Ana', 'Martínez', 'ana.martinez@caribemail.com', '+1-787-555-0105', 'https://ui-avatars.com/api/?name=Ana+Martínez&background=random', '1988-11-08', '2023-01-20', 'Customer Service Representative', 'Customer Service', NULL, 16.00, 0.0200, 'active', 'Luis Martínez', '+1-787-555-0106', '789 Calle del Sol', 'Caguas', 'PR', '00725'),
('EMP0004', 'Carlos', 'López', 'carlos.lopez@caribemail.com', '+1-787-555-0107', 'https://ui-avatars.com/api/?name=Carlos+López&background=random', '1992-04-12', '2023-03-10', 'Package Handler', 'Operations', NULL, 15.00, 0.0100, 'active', 'Sofia López', '+1-787-555-0108', '321 Calle Luna', 'Ponce', 'PR', '00716'),
('EMP0005', 'Isabella', 'Pérez', 'isabella.perez@caribemail.com', '+1-787-555-0109', 'https://ui-avatars.com/api/?name=Isabella+Pérez&background=random', '1987-09-30', '2023-02-15', 'HR Manager', 'Human Resources', NULL, 28.00, 0.0000, 'active', 'Miguel Pérez', '+1-787-555-0110', '654 Avenida Libertad', 'Mayagüez', 'PR', '00680'),
('EMP0006', 'Miguel', 'Torres', 'miguel.torres@caribemail.com', '+1-787-555-0111', 'https://ui-avatars.com/api/?name=Miguel+Torres&background=random', '1991-12-05', '2023-04-01', 'Driver', 'Delivery', NULL, 18.50, 0.0300, 'active', 'Carmen Torres', '+1-787-555-0112', '987 Calle Estrella', 'Arecibo', 'PR', '00612'),
('EMP0007', 'Carmen', 'Rivera', 'carmen.rivera@caribemail.com', '+1-787-555-0113', 'https://ui-avatars.com/api/?name=Carmen+Rivera&background=random', '1989-06-18', '2023-03-20', 'Package Handler', 'Operations', NULL, 15.00, 0.0100, 'active', 'Roberto Rivera', '+1-787-555-0114', '147 Calle Mar', 'Fajardo', 'PR', '00738'),
('EMP0008', 'Roberto', 'Sánchez', 'roberto.sanchez@caribemail.com', '+1-787-555-0115', 'https://ui-avatars.com/api/?name=Roberto+Sánchez&background=random', '1993-01-25', '2023-05-01', 'Customer Service Representative', 'Customer Service', NULL, 16.00, 0.0200, 'active', 'Elena Sánchez', '+1-787-555-0116', '258 Calle Viento', 'Humacao', 'PR', '00791'),
('EMP0009', 'Elena', 'Cruz', 'elena.cruz@caribemail.com', '+1-787-555-0117', 'https://ui-avatars.com/api/?name=Elena+Cruz&background=random', '1986-08-14', '2023-04-15', 'Supervisor', 'Operations', NULL, 22.00, 0.0400, 'active', 'Fernando Cruz', '+1-787-555-0118', '369 Calle Tierra', 'Aguadilla', 'PR', '00603'),
('EMP0010', 'Fernando', 'Ortiz', 'fernando.ortiz@caribemail.com', '+1-787-555-0119', 'https://ui-avatars.com/api/?name=Fernando+Ortiz&background=random', '1990-10-03', '2023-06-01', 'Driver', 'Delivery', NULL, 18.50, 0.0300, 'active', 'Patricia Ortiz', '+1-787-555-0120', '741 Calle Agua', 'Cayey', 'PR', '00736'),
('EMP0011', 'Patricia', 'Morales', 'patricia.morales@caribemail.com', '+1-787-555-0121', 'https://ui-avatars.com/api/?name=Patricia+Morales&background=random', '1988-05-20', '2023-05-15', 'Package Handler', 'Operations', NULL, 15.00, 0.0100, 'active', 'Ricardo Morales', '+1-787-555-0122', '852 Calle Fuego', 'Guayama', 'PR', '00784'),
('EMP0012', 'Ricardo', 'Jiménez', 'ricardo.jimenez@caribemail.com', '+1-787-555-0123', 'https://ui-avatars.com/api/?name=Ricardo+Jiménez&background=random', '1992-07-11', '2023-07-01', 'Customer Service Representative', 'Customer Service', NULL, 16.00, 0.0200, 'active', 'Diana Jiménez', '+1-787-555-0124', '963 Calle Aire', 'Coamo', 'PR', '00769'),
('EMP0013', 'Diana', 'Vargas', 'diana.vargas@caribemail.com', '+1-787-555-0125', 'https://ui-avatars.com/api/?name=Diana+Vargas&background=random', '1987-12-28', '2023-06-15', 'Driver', 'Delivery', NULL, 18.50, 0.0300, 'active', 'Alejandro Vargas', '+1-787-555-0126', '159 Calle Luz', 'San Germán', 'PR', '00683'),
('EMP0014', 'Alejandro', 'Herrera', 'alejandro.herrera@caribemail.com', '+1-787-555-0127', 'https://ui-avatars.com/api/?name=Alejandro+Herrera&background=random', '1991-03-09', '2023-08-01', 'Package Handler', 'Operations', NULL, 15.00, 0.0100, 'active', 'Valentina Herrera', '+1-787-555-0128', '357 Calle Sombra', 'Vega Baja', 'PR', '00693'),
('EMP0015', 'Valentina', 'Reyes', 'valentina.reyes@caribemail.com', '+1-787-555-0129', 'https://ui-avatars.com/api/?name=Valentina+Reyes&background=random', '1989-11-16', '2023-07-15', 'HR Specialist', 'Human Resources', NULL, 20.00, 0.0000, 'active', 'Gabriel Reyes', '+1-787-555-0130', '486 Calle Esperanza', 'Manatí', 'PR', '00674');

-- Update supervisor relationships
UPDATE public.employees SET supervisor_id = (SELECT id FROM public.employees WHERE employee_id = 'EMP0001') WHERE employee_id IN ('EMP0002', 'EMP0003', 'EMP0004', 'EMP0006', 'EMP0007', 'EMP0008', 'EMP0010', 'EMP0011', 'EMP0012', 'EMP0013', 'EMP0014');
UPDATE public.employees SET supervisor_id = (SELECT id FROM public.employees WHERE employee_id = 'EMP0009') WHERE employee_id IN ('EMP0002', 'EMP0006', 'EMP0010', 'EMP0013');
UPDATE public.employees SET supervisor_id = (SELECT id FROM public.employees WHERE employee_id = 'EMP0005') WHERE employee_id = 'EMP0015'; 