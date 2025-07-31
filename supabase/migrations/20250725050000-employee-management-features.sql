-- Employee Management Features Migration
-- Comprehensive employee management system for PRMCMS

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
    hourly_rate DECIMAL(10,2),
    salary DECIMAL(12,2),
    commission_rate DECIMAL(5,4) DEFAULT 0.0,
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

-- Employee roles and permissions
CREATE TABLE public.employee_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    role_name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '{}',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES public.employees(id),
    is_active BOOLEAN DEFAULT true
);

-- Shifts table
CREATE TABLE public.shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id),
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start_time TIME,
    break_end_time TIME,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    shift_type VARCHAR(50) DEFAULT 'regular' CHECK (shift_type IN ('regular', 'overtime', 'holiday', 'weekend', 'night')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time clock entries
CREATE TABLE public.time_clock_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES public.shifts(id) ON DELETE CASCADE,
    clock_in TIMESTAMP WITH TIME ZONE,
    clock_out TIMESTAMP WITH TIME ZONE,
    break_start TIMESTAMP WITH TIME ZONE,
    break_end TIMESTAMP WITH TIME ZONE,
    total_work_time INTERVAL,
    total_break_time INTERVAL,
    location_id UUID REFERENCES public.locations(id),
    device_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shift swap requests
CREATE TABLE public.shift_swap_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    requested_shift_id UUID REFERENCES public.shifts(id) ON DELETE CASCADE,
    offered_shift_id UUID REFERENCES public.shifts(id) ON DELETE CASCADE,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by UUID REFERENCES public.employees(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    packages_processed INTEGER DEFAULT 0,
    packages_per_hour DECIMAL(5,2),
    customer_satisfaction_rating DECIMAL(3,2),
    attendance_score DECIMAL(3,2),
    quality_score DECIMAL(3,2),
    efficiency_score DECIMAL(3,2),
    total_score DECIMAL(3,2),
    notes TEXT,
    evaluated_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance records
CREATE TABLE public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'early_departure', 'sick', 'vacation', 'holiday')),
    clock_in_time TIME,
    clock_out_time TIME,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recognition and rewards
CREATE TABLE public.employee_recognition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    recognition_type VARCHAR(50) NOT NULL CHECK (recognition_type IN ('excellence', 'safety', 'customer_service', 'innovation', 'teamwork', 'leadership')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    points_awarded INTEGER DEFAULT 0,
    monetary_reward DECIMAL(10,2) DEFAULT 0,
    awarded_by UUID REFERENCES public.employees(id),
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training modules
CREATE TABLE public.training_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration INTEGER, -- in minutes
    video_url TEXT,
    document_url TEXT,
    quiz_questions JSONB DEFAULT '[]',
    passing_score INTEGER DEFAULT 70,
    is_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee training progress
CREATE TABLE public.employee_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    attempts INTEGER DEFAULT 0,
    certificate_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training certifications
CREATE TABLE public.training_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
    certification_number VARCHAR(100) UNIQUE,
    issued_date DATE NOT NULL,
    expiry_date DATE,
    is_valid BOOLEAN DEFAULT true,
    issued_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding checklists
CREATE TABLE public.onboarding_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
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

-- Payroll records
CREATE TABLE public.payroll_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    regular_hours DECIMAL(6,2) DEFAULT 0,
    overtime_hours DECIMAL(6,2) DEFAULT 0,
    holiday_hours DECIMAL(6,2) DEFAULT 0,
    regular_pay DECIMAL(10,2) DEFAULT 0,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    holiday_pay DECIMAL(10,2) DEFAULT 0,
    commission_pay DECIMAL(10,2) DEFAULT 0,
    tips DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    net_pay DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    processed_by UUID REFERENCES public.employees(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tip distribution
CREATE TABLE public.tip_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    distribution_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    distribution_method VARCHAR(50) DEFAULT 'cash' CHECK (distribution_method IN ('cash', 'check', 'direct_deposit')),
    service_type VARCHAR(100),
    customer_id UUID REFERENCES public.customers(id),
    package_id UUID REFERENCES public.packages(id),
    notes TEXT,
    distributed_by UUID REFERENCES public.employees(id),
    distributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee schedules (for drag-and-drop functionality)
CREATE TABLE public.employee_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id),
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    schedule_data JSONB NOT NULL, -- Store drag-and-drop schedule data
    created_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_employees_location_id ON public.employees(location_id);
CREATE INDEX idx_employees_supervisor_id ON public.employees(supervisor_id);
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_shifts_employee_id ON public.shifts(employee_id);
CREATE INDEX idx_shifts_date ON public.shifts(shift_date);
CREATE INDEX idx_shifts_location_id ON public.shifts(location_id);
CREATE INDEX idx_time_clock_employee_id ON public.time_clock_entries(employee_id);
CREATE INDEX idx_time_clock_date ON public.time_clock_entries(clock_in::date);
CREATE INDEX idx_performance_employee_id ON public.performance_metrics(employee_id);
CREATE INDEX idx_performance_date ON public.performance_metrics(metric_date);
CREATE INDEX idx_attendance_employee_id ON public.attendance_records(employee_id);
CREATE INDEX idx_attendance_date ON public.attendance_records(date);
CREATE INDEX idx_training_employee_id ON public.employee_training(employee_id);
CREATE INDEX idx_training_module_id ON public.employee_training(module_id);
CREATE INDEX idx_payroll_employee_id ON public.payroll_records(employee_id);
CREATE INDEX idx_payroll_period ON public.payroll_records(pay_period_start, pay_period_end);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_clock_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tip_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Employees can view their own data and managers can view their team
CREATE POLICY "Employees can view own data" ON public.employees
    FOR SELECT USING (auth.uid()::text = id::text OR 
                     id IN (SELECT employee_id FROM public.employee_roles WHERE role_name = 'manager' AND assigned_by::text = auth.uid()::text));

CREATE POLICY "Managers can manage employees" ON public.employees
    FOR ALL USING (id IN (SELECT employee_id FROM public.employee_roles WHERE role_name = 'manager' AND assigned_by::text = auth.uid()::text));

-- Similar policies for other tables
CREATE POLICY "Employees can view own shifts" ON public.shifts
    FOR SELECT USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Managers can manage shifts" ON public.shifts
    FOR ALL USING (employee_id IN (SELECT employee_id FROM public.employee_roles WHERE role_name = 'manager' AND assigned_by::text = auth.uid()::text));

CREATE POLICY "Employees can view own time clock" ON public.time_clock_entries
    FOR SELECT USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Employees can create own time clock entries" ON public.time_clock_entries
    FOR INSERT WITH CHECK (auth.uid()::text = employee_id::text);

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

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON public.shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_swap_requests_updated_at BEFORE UPDATE ON public.shift_swap_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON public.performance_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON public.training_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_training_updated_at BEFORE UPDATE ON public.employee_training
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_checklists_updated_at BEFORE UPDATE ON public.onboarding_checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON public.payroll_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_schedules_updated_at BEFORE UPDATE ON public.employee_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for common operations
CREATE OR REPLACE FUNCTION calculate_shift_hours(
    p_start_time TIME,
    p_end_time TIME,
    p_break_start TIME DEFAULT NULL,
    p_break_end TIME DEFAULT NULL
) RETURNS DECIMAL(4,2) AS $$
DECLARE
    total_minutes INTEGER;
    break_minutes INTEGER := 0;
BEGIN
    -- Calculate total minutes
    total_minutes := EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 60;
    
    -- Subtract break time if provided
    IF p_break_start IS NOT NULL AND p_break_end IS NOT NULL THEN
        break_minutes := EXTRACT(EPOCH FROM (p_break_end - p_break_start)) / 60;
    END IF;
    
    RETURN ROUND((total_minutes - break_minutes) / 60.0, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_overtime_hours(
    p_total_hours DECIMAL(4,2),
    p_regular_hours DECIMAL(4,2) DEFAULT 8.0
) RETURNS DECIMAL(4,2) AS $$
BEGIN
    IF p_total_hours > p_regular_hours THEN
        RETURN ROUND(p_total_hours - p_regular_hours, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_employee_id() RETURNS VARCHAR(20) AS $$
DECLARE
    new_id VARCHAR(20);
    counter INTEGER := 1;
BEGIN
    LOOP
        new_id := 'EMP' || TO_CHAR(NOW(), 'YYYY') || LPAD(counter::text, 4, '0');
        
        -- Check if ID already exists
        IF NOT EXISTS (SELECT 1 FROM public.employees WHERE employee_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Insert sample training modules
INSERT INTO public.training_modules (title, description, category, difficulty_level, estimated_duration, is_required) VALUES
('Package Handling Safety', 'Learn proper techniques for handling packages safely to prevent injuries and damage', 'Safety', 'beginner', 30, true),
('Customer Service Excellence', 'Develop skills for providing exceptional customer service', 'Customer Service', 'beginner', 45, true),
('Route Optimization', 'Learn to optimize delivery routes for maximum efficiency', 'Operations', 'intermediate', 60, false),
('Advanced Package Tracking', 'Master the IoT tracking system and troubleshooting', 'Technology', 'intermediate', 90, false),
('Leadership Fundamentals', 'Develop leadership skills for team management', 'Management', 'advanced', 120, false),
('Compliance and Regulations', 'Understand mail carrier regulations and compliance requirements', 'Compliance', 'beginner', 60, true),
('Emergency Response Procedures', 'Learn how to handle emergencies and incidents', 'Safety', 'intermediate', 45, true),
('Inventory Management', 'Master inventory tracking and management systems', 'Operations', 'intermediate', 75, false);

-- Insert sample employees
INSERT INTO public.employees (first_name, last_name, email, phone, employee_id, position, department, hire_date, hourly_rate, commission_rate, status, photo_url) VALUES
('Carlos', 'Rodríguez', 'carlos.rodriguez@prmcms.com', '+1-787-555-0101', 'EMP001', 'Driver', 'Operations', '2023-01-15', 15.50, 0.05, 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('María', 'González', 'maria.gonzalez@prmcms.com', '+1-787-555-0102', 'EMP002', 'Customer Service', 'Customer Support', '2023-02-20', 14.00, 0.03, 'active', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
('Luis', 'Martínez', 'luis.martinez@prmcms.com', '+1-787-555-0103', 'EMP003', 'Sorter', 'Operations', '2023-03-10', 13.50, 0.02, 'active', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('Ana', 'López', 'ana.lopez@prmcms.com', '+1-787-555-0104', 'EMP004', 'Manager', 'Management', '2022-11-05', 25.00, 0.08, 'active', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'),
('Roberto', 'Hernández', 'roberto.hernandez@prmcms.com', '+1-787-555-0105', 'EMP005', 'Driver', 'Operations', '2023-04-12', 15.00, 0.05, 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'),
('Carmen', 'Pérez', 'carmen.perez@prmcms.com', '+1-787-555-0106', 'EMP006', 'Customer Service', 'Customer Support', '2023-05-18', 14.50, 0.03, 'active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'),
('Miguel', 'Torres', 'miguel.torres@prmcms.com', '+1-787-555-0107', 'EMP007', 'Sorter', 'Operations', '2023-06-22', 13.75, 0.02, 'active', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'),
('Isabel', 'Rivera', 'isabel.rivera@prmcms.com', '+1-787-555-0108', 'EMP008', 'Driver', 'Operations', '2023-07-08', 15.25, 0.05, 'active', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'),
('José', 'Morales', 'jose.morales@prmcms.com', '+1-787-555-0109', 'EMP009', 'Supervisor', 'Management', '2022-09-14', 22.00, 0.06, 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('Rosa', 'Cruz', 'rosa.cruz@prmcms.com', '+1-787-555-0110', 'EMP010', 'Customer Service', 'Customer Support', '2023-08-30', 14.25, 0.03, 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'),
('Fernando', 'Ortiz', 'fernando.ortiz@prmcms.com', '+1-787-555-0111', 'EMP011', 'Driver', 'Operations', '2023-09-12', 15.75, 0.05, 'active', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'),
('Patricia', 'Reyes', 'patricia.reyes@prmcms.com', '+1-787-555-0112', 'EMP012', 'Sorter', 'Operations', '2023-10-05', 13.50, 0.02, 'active', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'),
('Ricardo', 'Santiago', 'ricardo.santiago@prmcms.com', '+1-787-555-0113', 'EMP013', 'Driver', 'Operations', '2023-11-18', 15.00, 0.05, 'active', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
('Diana', 'Vega', 'diana.vega@prmcms.com', '+1-787-555-0114', 'EMP014', 'Customer Service', 'Customer Support', '2023-12-03', 14.75, 0.03, 'active', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'),
('Eduardo', 'Mendoza', 'eduardo.mendoza@prmcms.com', '+1-787-555-0115', 'EMP015', 'Manager', 'Management', '2022-12-20', 24.50, 0.07, 'active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face');

-- Insert sample shifts
INSERT INTO public.shifts (employee_id, shift_date, start_time, end_time, break_start, break_end, position, location, status, notes) VALUES
('1', '2024-07-25', '08:00:00', '16:00:00', '12:00:00', '12:30:00', 'Driver', 'San Juan Hub', 'scheduled', 'Regular delivery route'),
('2', '2024-07-25', '09:00:00', '17:00:00', '12:30:00', '13:00:00', 'Customer Service', 'San Juan Hub', 'scheduled', 'Customer support shift'),
('3', '2024-07-25', '06:00:00', '14:00:00', '10:00:00', '10:15:00', 'Sorter', 'San Juan Hub', 'in_progress', 'Morning sorting shift'),
('4', '2024-07-25', '08:00:00', '17:00:00', '12:00:00', '13:00:00', 'Manager', 'San Juan Hub', 'scheduled', 'Management duties'),
('5', '2024-07-25', '07:00:00', '15:00:00', '11:00:00', '11:30:00', 'Driver', 'Bayamón Station', 'scheduled', 'Bayamón delivery route'),
('6', '2024-07-25', '10:00:00', '18:00:00', '13:00:00', '13:30:00', 'Customer Service', 'Bayamón Station', 'scheduled', 'Afternoon support'),
('7', '2024-07-25', '14:00:00', '22:00:00', '17:00:00', '17:15:00', 'Sorter', 'San Juan Hub', 'scheduled', 'Evening sorting'),
('8', '2024-07-25', '06:30:00', '14:30:00', '10:30:00', '11:00:00', 'Driver', 'Caguas Station', 'scheduled', 'Caguas morning route'),
('9', '2024-07-25', '08:00:00', '16:00:00', '12:00:00', '12:30:00', 'Supervisor', 'San Juan Hub', 'scheduled', 'Supervision duties'),
('10', '2024-07-25', '11:00:00', '19:00:00', '14:00:00', '14:30:00', 'Customer Service', 'Ponce Station', 'scheduled', 'Ponce support shift');

-- Insert sample time clock entries
INSERT INTO public.time_clock_entries (employee_id, clock_in, clock_out, break_start, break_end, total_hours, break_hours, notes, location, status) VALUES
('1', '2024-07-25 08:00:00', NULL, NULL, NULL, NULL, NULL, 'Started morning shift', 'San Juan Hub', 'active'),
('2', '2024-07-25 09:00:00', NULL, NULL, NULL, NULL, NULL, 'Customer service shift', 'San Juan Hub', 'active'),
('3', '2024-07-25 06:00:00', NULL, '10:00:00', '10:15:00', NULL, 0.25, 'Morning sorting', 'San Juan Hub', 'on_break'),
('4', '2024-07-25 08:00:00', NULL, NULL, NULL, NULL, NULL, 'Management shift', 'San Juan Hub', 'active'),
('5', '2024-07-25 07:00:00', '15:00:00', '11:00:00', '11:30:00', 7.5, 0.5, 'Completed Bayamón route', 'Bayamón Station', 'completed');

-- Insert sample performance metrics
INSERT INTO public.performance_metrics (employee_id, metric_type, value, target, period, metric_date, notes) VALUES
('1', 'packages_processed', 45, 50, 'daily', '2024-07-25', 'Good performance, slightly below target'),
('2', 'customer_satisfaction', 4.8, 4.5, 'daily', '2024-07-25', 'Excellent customer service'),
('3', 'efficiency', 92, 90, 'daily', '2024-07-25', 'Above target efficiency'),
('4', 'attendance', 100, 95, 'weekly', '2024-07-25', 'Perfect attendance this week'),
('5', 'packages_processed', 52, 50, 'daily', '2024-07-25', 'Exceeded daily target'),
('6', 'customer_satisfaction', 4.6, 4.5, 'daily', '2024-07-25', 'Good customer feedback'),
('7', 'training_completion', 85, 80, 'monthly', '2024-07-25', 'Training progress on track'),
('8', 'efficiency', 88, 90, 'daily', '2024-07-25', 'Slightly below efficiency target'),
('9', 'attendance', 95, 95, 'weekly', '2024-07-25', 'Met attendance target'),
('10', 'customer_satisfaction', 4.7, 4.5, 'daily', '2024-07-25', 'Strong customer service');

-- Insert sample employee recognitions
INSERT INTO public.employee_recognition (employee_id, recognition_type, title, description, points, awarded_by, awarded_date) VALUES
('1', 'excellence', 'Outstanding Driver', 'Consistently exceeds delivery targets and maintains excellent safety record', 100, 'Ana López', '2024-07-20'),
('2', 'improvement', 'Customer Service Star', 'Significant improvement in customer satisfaction scores', 75, 'Ana López', '2024-07-18'),
('3', 'milestone', '5 Years of Service', 'Celebrating 5 years of dedicated service to the company', 150, 'Management Team', '2024-07-15'),
('4', 'teamwork', 'Leadership Excellence', 'Exceptional leadership in managing team performance', 120, 'CEO', '2024-07-10'),
('5', 'innovation', 'Route Optimization', 'Developed new route optimization strategy saving 2 hours daily', 200, 'Ana López', '2024-07-05');

-- Insert sample payroll records
INSERT INTO public.payroll_records (employee_id, pay_period_start, pay_period_end, regular_hours, overtime_hours, regular_rate, overtime_rate, gross_pay, deductions, net_pay, commission_amount, tips_amount, bonus_amount, status, notes) VALUES
('1', '2024-07-15', '2024-07-21', 40.0, 5.0, 15.50, 23.25, 697.50, 139.50, 558.00, 34.88, 25.00, 0.00, 'approved', 'Weekly payroll - good performance'),
('2', '2024-07-15', '2024-07-21', 40.0, 2.0, 14.00, 21.00, 602.00, 120.40, 481.60, 18.06, 15.00, 0.00, 'approved', 'Weekly payroll - customer service'),
('3', '2024-07-15', '2024-07-21', 40.0, 0.0, 13.50, 20.25, 540.00, 108.00, 432.00, 10.80, 0.00, 0.00, 'approved', 'Weekly payroll - sorting'),
('4', '2024-07-15', '2024-07-21', 40.0, 3.0, 25.00, 37.50, 1112.50, 222.50, 890.00, 89.00, 0.00, 100.00, 'approved', 'Weekly payroll - management'),
('5', '2024-07-15', '2024-07-21', 40.0, 4.0, 15.00, 22.50, 690.00, 138.00, 552.00, 34.50, 30.00, 0.00, 'approved', 'Weekly payroll - driver');

-- Insert sample tip distributions
INSERT INTO public.tip_distributions (employee_id, date, amount, service_type, distribution_method, notes) VALUES
('1', '2024-07-25', 15.00, 'Premium Delivery', 'performance_based', 'Excellent service delivery'),
('2', '2024-07-25', 10.00, 'Customer Service', 'equal', 'Great customer interaction'),
('5', '2024-07-25', 20.00, 'Express Delivery', 'performance_based', 'Fast and efficient delivery'),
('6', '2024-07-25', 12.00, 'Customer Service', 'equal', 'Helpful customer support'),
('8', '2024-07-25', 18.00, 'Same Day Delivery', 'performance_based', 'Outstanding same-day service'); 