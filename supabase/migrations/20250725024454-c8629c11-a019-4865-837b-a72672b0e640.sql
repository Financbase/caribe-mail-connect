-- Performance monitoring tables
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  user_id UUID REFERENCES auth.users(id),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,3) NOT NULL,
  metric_unit TEXT,
  page_url TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance budgets and alerts
CREATE TABLE public.performance_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.locations(id),
  metric_name TEXT NOT NULL,
  budget_value DECIMAL(10,3) NOT NULL,
  alert_threshold DECIMAL(10,3) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- API performance tracking
CREATE TABLE public.api_performance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_time INTEGER NOT NULL, -- in milliseconds
  status_code INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  location_id UUID REFERENCES public.locations(id),
  request_size INTEGER,
  response_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bundle analysis results
CREATE TABLE public.bundle_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  build_id TEXT NOT NULL,
  total_size INTEGER NOT NULL, -- in bytes
  js_size INTEGER NOT NULL,
  css_size INTEGER NOT NULL,
  assets_size INTEGER NOT NULL,
  chunks JSONB,
  analysis_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance alerts
CREATE TABLE public.performance_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL, -- 'budget_violation', 'slow_query', 'high_memory', etc.
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  metric_name TEXT,
  metric_value DECIMAL(10,3),
  threshold_value DECIMAL(10,3),
  location_id UUID REFERENCES public.locations(id),
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_performance_metrics_location_created ON public.performance_metrics(location_id, created_at DESC);
CREATE INDEX idx_performance_metrics_metric_name ON public.performance_metrics(metric_name);
CREATE INDEX idx_api_performance_logs_endpoint ON public.api_performance_logs(endpoint, created_at DESC);
CREATE INDEX idx_api_performance_logs_response_time ON public.api_performance_logs(response_time);
CREATE INDEX idx_performance_alerts_unresolved ON public.performance_alerts(is_resolved, created_at DESC) WHERE is_resolved = false;

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Performance metrics - staff can view all, others can view their own location
CREATE POLICY "Staff can view all performance metrics" 
ON public.performance_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Users can insert their own performance metrics" 
ON public.performance_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Performance budgets - admin and managers only
CREATE POLICY "Managers can manage performance budgets" 
ON public.performance_budgets 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- API performance logs
CREATE POLICY "Staff can view API performance logs" 
ON public.api_performance_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Users can insert API performance logs" 
ON public.api_performance_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Bundle analysis - admin only
CREATE POLICY "Admins can manage bundle analysis" 
ON public.bundle_analysis 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Performance alerts
CREATE POLICY "Staff can view performance alerts" 
ON public.performance_alerts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "System can create performance alerts" 
ON public.performance_alerts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Staff can resolve performance alerts" 
ON public.performance_alerts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'staff')
  )
);

-- Trigger for updating timestamps
CREATE TRIGGER update_performance_budgets_updated_at
BEFORE UPDATE ON public.performance_budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();