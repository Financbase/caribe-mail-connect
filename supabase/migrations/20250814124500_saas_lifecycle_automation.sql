-- =====================================================
-- SaaS Lifecycle Automation Migration
-- Story 1.3: Unified Communication System
-- =====================================================

-- Communication Workflow Executions Table
CREATE TABLE IF NOT EXISTS public.communication_workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.communication_workflows(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  
  -- Execution details
  status TEXT CHECK (status IN ('running', 'waiting', 'completed', 'failed', 'cancelled')) DEFAULT 'running',
  current_step INTEGER DEFAULT 1,
  trigger_data JSONB DEFAULT '{}',
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  next_step_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table for workflow-generated tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Relationships
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  workflow_execution_id UUID REFERENCES public.communication_workflow_executions(id) ON DELETE SET NULL,
  
  -- Task details
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to TEXT,
  due_date TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  completed_at TIMESTAMPTZ,
  completed_by TEXT
);

-- SaaS Lifecycle Events Table
CREATE TABLE IF NOT EXISTS public.saas_lifecycle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  
  -- Automation tracking
  triggered_workflows TEXT[],
  automation_results JSONB DEFAULT '{}',
  
  -- Timing
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Engagement Metrics Table
CREATE TABLE IF NOT EXISTS public.customer_engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  
  -- Engagement metrics
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  session_duration_minutes INTEGER DEFAULT 0,
  
  -- Feature usage
  features_used TEXT[],
  feature_usage_count JSONB DEFAULT '{}',
  
  -- Communication engagement
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  sms_responded INTEGER DEFAULT 0,
  
  -- Calculated scores
  engagement_score DECIMAL(3,2) DEFAULT 0.00,
  churn_risk_score DECIMAL(3,2) DEFAULT 0.00,
  
  -- Time periods
  period_start TIMESTAMPTZ DEFAULT NOW(),
  period_end TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Health Metrics Table
CREATE TABLE IF NOT EXISTS public.subscription_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  
  -- Health indicators
  active_customers INTEGER DEFAULT 0,
  churned_customers INTEGER DEFAULT 0,
  trial_customers INTEGER DEFAULT 0,
  
  -- Revenue metrics
  monthly_recurring_revenue DECIMAL(10,2) DEFAULT 0.00,
  average_revenue_per_user DECIMAL(10,2) DEFAULT 0.00,
  customer_lifetime_value DECIMAL(10,2) DEFAULT 0.00,
  
  -- Engagement metrics
  average_engagement_score DECIMAL(3,2) DEFAULT 0.00,
  support_ticket_count INTEGER DEFAULT 0,
  feature_adoption_rate DECIMAL(3,2) DEFAULT 0.00,
  
  -- Communication metrics
  email_open_rate DECIMAL(3,2) DEFAULT 0.00,
  email_click_rate DECIMAL(3,2) DEFAULT 0.00,
  automation_success_rate DECIMAL(3,2) DEFAULT 0.00,
  
  -- Time period
  period_start TIMESTAMPTZ DEFAULT NOW(),
  period_end TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Workflow executions indexes
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON public.communication_workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_customer_id ON public.communication_workflow_executions(customer_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON public.communication_workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_next_step_at ON public.communication_workflow_executions(next_step_at) WHERE next_step_at IS NOT NULL;

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_customer_id ON public.tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_tasks_subscription_id ON public.tasks(subscription_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;

-- Lifecycle events indexes
CREATE INDEX IF NOT EXISTS idx_lifecycle_events_subscription_id ON public.saas_lifecycle_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_events_customer_id ON public.saas_lifecycle_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_lifecycle_events_type ON public.saas_lifecycle_events(event_type);
CREATE INDEX IF NOT EXISTS idx_lifecycle_events_occurred_at ON public.saas_lifecycle_events(occurred_at);

-- Engagement metrics indexes
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_customer_id ON public.customer_engagement_metrics(customer_id);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_subscription_id ON public.customer_engagement_metrics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_period ON public.customer_engagement_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_engagement_metrics_churn_risk ON public.customer_engagement_metrics(churn_risk_score);

-- Health metrics indexes
CREATE INDEX IF NOT EXISTS idx_health_metrics_subscription_id ON public.subscription_health_metrics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_period ON public.subscription_health_metrics(period_start, period_end);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.communication_workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_lifecycle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_health_metrics ENABLE ROW LEVEL SECURITY;

-- Workflow executions policies
CREATE POLICY "Users can view workflow executions for their subscription" ON public.communication_workflow_executions
  FOR SELECT USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workflow executions for their subscription" ON public.communication_workflow_executions
  FOR INSERT WITH CHECK (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workflow executions for their subscription" ON public.communication_workflow_executions
  FOR UPDATE USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Users can view tasks for their subscription" ON public.tasks
  FOR SELECT USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tasks for their subscription" ON public.tasks
  FOR ALL USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

-- Lifecycle events policies
CREATE POLICY "Users can view lifecycle events for their subscription" ON public.saas_lifecycle_events
  FOR SELECT USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert lifecycle events" ON public.saas_lifecycle_events
  FOR INSERT WITH CHECK (true);

-- Engagement metrics policies
CREATE POLICY "Users can view engagement metrics for their subscription" ON public.customer_engagement_metrics
  FOR SELECT USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage engagement metrics" ON public.customer_engagement_metrics
  FOR ALL USING (true);

-- Health metrics policies
CREATE POLICY "Users can view health metrics for their subscription" ON public.subscription_health_metrics
  FOR SELECT USING (
    subscription_id IN (
      SELECT s.id FROM public.subscriptions s
      JOIN public.subscription_users su ON s.id = su.subscription_id
      WHERE su.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage health metrics" ON public.subscription_health_metrics
  FOR ALL USING (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update engagement metrics
CREATE OR REPLACE FUNCTION update_customer_engagement_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update engagement metrics when customer activity occurs
  INSERT INTO public.customer_engagement_metrics (
    customer_id,
    subscription_id,
    last_login_at,
    login_count,
    period_start,
    period_end
  ) VALUES (
    NEW.id,
    NEW.subscription_id,
    NEW.last_activity_at,
    1,
    date_trunc('month', NOW()),
    date_trunc('month', NOW()) + interval '1 month' - interval '1 day'
  )
  ON CONFLICT (customer_id, period_start) 
  DO UPDATE SET
    last_login_at = GREATEST(customer_engagement_metrics.last_login_at, NEW.last_activity_at),
    login_count = customer_engagement_metrics.login_count + 1,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate churn risk score
CREATE OR REPLACE FUNCTION calculate_churn_risk_score(customer_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  days_since_login INTEGER;
  engagement_score DECIMAL(3,2);
  risk_score DECIMAL(3,2) := 0.00;
BEGIN
  -- Get days since last login
  SELECT EXTRACT(DAY FROM NOW() - last_activity_at)
  INTO days_since_login
  FROM public.customers
  WHERE id = customer_uuid;
  
  -- Get engagement score
  SELECT COALESCE(engagement_score, 0.00)
  INTO engagement_score
  FROM public.customer_engagement_metrics
  WHERE customer_id = customer_uuid
  AND period_start <= NOW()
  AND period_end >= NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Calculate risk score based on inactivity and engagement
  IF days_since_login > 30 THEN
    risk_score := 0.90;
  ELSIF days_since_login > 14 THEN
    risk_score := 0.70;
  ELSIF days_since_login > 7 THEN
    risk_score := 0.50;
  ELSIF engagement_score < 0.30 THEN
    risk_score := 0.60;
  ELSIF engagement_score < 0.50 THEN
    risk_score := 0.40;
  ELSE
    risk_score := 0.20;
  END IF;
  
  RETURN LEAST(risk_score, 1.00);
END;
$$ LANGUAGE plpgsql;

-- Function to trigger SaaS lifecycle events
CREATE OR REPLACE FUNCTION trigger_saas_lifecycle_event(
  p_subscription_id UUID,
  p_customer_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  -- Insert lifecycle event
  INSERT INTO public.saas_lifecycle_events (
    subscription_id,
    customer_id,
    event_type,
    event_data,
    occurred_at
  ) VALUES (
    p_subscription_id,
    p_customer_id,
    p_event_type,
    p_event_data,
    NOW()
  ) RETURNING id INTO event_id;
  
  -- Here we would trigger the appropriate workflows
  -- This would be handled by the application layer
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample SaaS lifecycle events
INSERT INTO public.saas_lifecycle_events (
  subscription_id,
  customer_id,
  event_type,
  event_data
) 
SELECT 
  '00000000-0000-0000-0000-000000000001',
  c.id,
  CASE 
    WHEN RANDOM() < 0.3 THEN 'customer_created'
    WHEN RANDOM() < 0.5 THEN 'trial_started'
    WHEN RANDOM() < 0.7 THEN 'subscription_activated'
    ELSE 'engagement_milestone'
  END,
  jsonb_build_object(
    'source', 'system',
    'timestamp', NOW(),
    'metadata', jsonb_build_object('automated', true)
  )
FROM public.customers c
WHERE c.subscription_id = '00000000-0000-0000-0000-000000000001'
LIMIT 10;

-- Insert sample engagement metrics
INSERT INTO public.customer_engagement_metrics (
  customer_id,
  subscription_id,
  last_login_at,
  login_count,
  engagement_score,
  churn_risk_score,
  period_start,
  period_end
)
SELECT 
  c.id,
  c.subscription_id,
  NOW() - (RANDOM() * interval '30 days'),
  (RANDOM() * 50)::INTEGER + 1,
  RANDOM()::DECIMAL(3,2),
  RANDOM()::DECIMAL(3,2),
  date_trunc('month', NOW()),
  date_trunc('month', NOW()) + interval '1 month' - interval '1 day'
FROM public.customers c
WHERE c.subscription_id = '00000000-0000-0000-0000-000000000001'
LIMIT 10;
