-- Migration: Hybrid Tenant Architecture for SaaS Transformation
-- Story 1.0: Implement subscription + location hybrid multi-tenant model
-- Date: 2025-08-14
-- Author: BMad Orchestrator

-- =====================================================
-- SUBSCRIPTION ORGANIZATIONS (PRIMARY TENANTS)
-- =====================================================

-- Create subscription organizations table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  plan_tier TEXT NOT NULL CHECK (plan_tier IN ('starter', 'professional', 'enterprise', 'custom')),
  
  -- Stripe integration
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  
  -- Subscription status and billing
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  
  -- Organization settings
  settings JSONB DEFAULT '{}',
  billing_email TEXT,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create subscription feature entitlements table
CREATE TABLE public.subscription_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  
  -- Feature control
  feature_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  usage_limit INTEGER, -- NULL = unlimited
  current_usage INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(subscription_id, feature_key)
);

-- Create subscription users table (organization membership)
CREATE TABLE public.subscription_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Organization role
  subscription_role TEXT NOT NULL DEFAULT 'member' CHECK (subscription_role IN ('owner', 'admin', 'member')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(subscription_id, user_id)
);

-- =====================================================
-- ENHANCE EXISTING TABLES WITH SUBSCRIPTION CONTEXT
-- =====================================================

-- Add subscription_id to locations table (preserving existing structure)
ALTER TABLE public.locations 
ADD COLUMN subscription_id UUID REFERENCES public.subscriptions(id);

-- Add subscription_id to customers table (preserving existing structure)
ALTER TABLE public.customers 
ADD COLUMN subscription_id UUID REFERENCES public.subscriptions(id);

-- Create indexes for performance
CREATE INDEX idx_locations_subscription_id ON public.locations(subscription_id);
CREATE INDEX idx_customers_subscription_id ON public.customers(subscription_id);
CREATE INDEX idx_subscription_entitlements_subscription_feature ON public.subscription_entitlements(subscription_id, feature_key);
CREATE INDEX idx_subscription_users_subscription_user ON public.subscription_users(subscription_id, user_id);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_users ENABLE ROW LEVEL SECURITY;

-- Subscription-level isolation policies
CREATE POLICY "subscription_isolation" ON public.subscriptions
  FOR ALL USING (
    id IN (
      SELECT subscription_id 
      FROM public.subscription_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Subscription entitlements policies
CREATE POLICY "subscription_entitlements_access" ON public.subscription_entitlements
  FOR ALL USING (
    subscription_id IN (
      SELECT subscription_id 
      FROM public.subscription_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Subscription users policies
CREATE POLICY "subscription_users_access" ON public.subscription_users
  FOR ALL USING (
    subscription_id IN (
      SELECT subscription_id 
      FROM public.subscription_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Enhanced location policies (additive to existing)
CREATE POLICY "subscription_location_access" ON public.locations
  FOR ALL USING (
    subscription_id IS NULL OR -- Preserve existing locations without subscription
    subscription_id IN (
      SELECT subscription_id 
      FROM public.subscription_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Enhanced customer policies (additive to existing)
CREATE POLICY "subscription_customer_access" ON public.customers
  FOR ALL USING (
    subscription_id IS NULL OR -- Preserve existing customers without subscription
    subscription_id IN (
      SELECT subscription_id 
      FROM public.subscription_users 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get current user's subscription ID
CREATE OR REPLACE FUNCTION public.get_current_subscription_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sub_id UUID;
BEGIN
  SELECT subscription_id INTO sub_id
  FROM public.subscription_users
  WHERE user_id = auth.uid() 
    AND status = 'active'
  LIMIT 1;
  
  RETURN sub_id;
END;
$$;

-- Function to check feature entitlement
CREATE OR REPLACE FUNCTION public.check_feature_entitlement(feature_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_entitled BOOLEAN := false;
  sub_id UUID;
BEGIN
  -- Get current subscription
  sub_id := public.get_current_subscription_id();
  
  IF sub_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check entitlement
  SELECT is_enabled INTO is_entitled
  FROM public.subscription_entitlements
  WHERE subscription_id = sub_id 
    AND feature_key = check_feature_entitlement.feature_key;
  
  RETURN COALESCE(is_entitled, false);
END;
$$;

-- Function to increment feature usage
CREATE OR REPLACE FUNCTION public.increment_feature_usage(feature_key TEXT, increment_by INTEGER DEFAULT 1)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sub_id UUID;
  current_limit INTEGER;
  current_usage INTEGER;
BEGIN
  -- Get current subscription
  sub_id := public.get_current_subscription_id();
  
  IF sub_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get current usage and limit
  SELECT usage_limit, current_usage 
  INTO current_limit, current_usage
  FROM public.subscription_entitlements
  WHERE subscription_id = sub_id 
    AND feature_key = increment_feature_usage.feature_key;
  
  -- Check if increment would exceed limit
  IF current_limit IS NOT NULL AND (current_usage + increment_by) > current_limit THEN
    RETURN false;
  END IF;
  
  -- Increment usage
  UPDATE public.subscription_entitlements
  SET current_usage = current_usage + increment_by,
      updated_at = now()
  WHERE subscription_id = sub_id 
    AND feature_key = increment_feature_usage.feature_key;
  
  RETURN true;
END;
$$;

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to new tables
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_entitlements_updated_at
  BEFORE UPDATE ON public.subscription_entitlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_users_updated_at
  BEFORE UPDATE ON public.subscription_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- DEFAULT SUBSCRIPTION FOR EXISTING DATA
-- =====================================================

-- Create a default subscription for existing data migration
INSERT INTO public.subscriptions (
  id,
  organization_name,
  plan_tier,
  status,
  settings,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'PRMCMS Legacy Organization',
  'enterprise',
  'active',
  '{"legacy": true, "migration_date": "2025-08-14"}',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Migrate existing locations to default subscription
UPDATE public.locations 
SET subscription_id = '00000000-0000-0000-0000-000000000001'
WHERE subscription_id IS NULL;

-- Migrate existing customers to default subscription  
UPDATE public.customers 
SET subscription_id = '00000000-0000-0000-0000-000000000001'
WHERE subscription_id IS NULL;

-- Create default entitlements for legacy subscription
INSERT INTO public.subscription_entitlements (subscription_id, feature_key, is_enabled, usage_limit)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'unlimited_locations', true, NULL),
  ('00000000-0000-0000-0000-000000000001', 'unlimited_customers', true, NULL),
  ('00000000-0000-0000-0000-000000000001', 'advanced_analytics', true, NULL),
  ('00000000-0000-0000-0000-000000000001', 'api_access', true, NULL),
  ('00000000-0000-0000-0000-000000000001', 'custom_integrations', true, NULL)
ON CONFLICT (subscription_id, feature_key) DO NOTHING;
