-- Fix Supabase RLS Warnings Migration
-- This migration addresses all RLS security warnings by enabling RLS and creating proper policies

-- =====================================================
-- ENABLE RLS ON ALL AFFECTED TABLES
-- =====================================================

-- Enable RLS on analytics tables
ALTER TABLE public.analytics_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_query_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_intelligence_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_exports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE COMPREHENSIVE RLS POLICIES
-- =====================================================

-- Analytics Alerts Policies
CREATE POLICY "analytics_alerts_tenant_isolation" ON public.analytics_alerts
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_alerts.subscription_id
                    AND s.user_id = auth.uid()
                )
            )
            ELSE false
        END
    );

CREATE POLICY "analytics_alerts_admin_access" ON public.analytics_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- Analytics User Preferences Policies
CREATE POLICY "analytics_user_preferences_user_access" ON public.analytics_user_preferences
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN user_id = auth.uid()
            ELSE false
        END
    );

CREATE POLICY "analytics_user_preferences_tenant_access" ON public.analytics_user_preferences
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.subscriptions s
            WHERE s.id = analytics_user_preferences.subscription_id
            AND s.user_id = auth.uid()
        )
    );

-- Real Time Analytics Policies
CREATE POLICY "real_time_analytics_tenant_isolation" ON public.real_time_analytics
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = real_time_analytics.subscription_id
                    AND s.user_id = auth.uid()
                )
            )
            ELSE false
        END
    );

CREATE POLICY "real_time_analytics_admin_access" ON public.real_time_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- Analytics Query Cache Policies
CREATE POLICY "analytics_query_cache_tenant_isolation" ON public.analytics_query_cache
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_query_cache.subscription_id
                    AND s.user_id = auth.uid()
                )
            )
            ELSE false
        END
    );

CREATE POLICY "analytics_query_cache_user_access" ON public.analytics_query_cache
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- Analytics Dashboards Policies
CREATE POLICY "analytics_dashboards_tenant_isolation" ON public.analytics_dashboards
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_dashboards.subscription_id
                    AND s.user_id = auth.uid()
                )
            )
            ELSE false
        END
    );

CREATE POLICY "analytics_dashboards_owner_access" ON public.analytics_dashboards
    FOR ALL USING (
        created_by = auth.uid()
    );

CREATE POLICY "analytics_dashboards_shared_access" ON public.analytics_dashboards
    FOR SELECT USING (
        is_public = true OR 
        EXISTS (
            SELECT 1 FROM public.dashboard_shares ds
            WHERE ds.dashboard_id = analytics_dashboards.id
            AND ds.user_id = auth.uid()
        )
    );

-- Analytics Widgets Policies
CREATE POLICY "analytics_widgets_tenant_isolation" ON public.analytics_widgets
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_widgets.subscription_id
                    AND s.user_id = auth.uid()
                )
            )
            ELSE false
        END
    );

CREATE POLICY "analytics_widgets_dashboard_access" ON public.analytics_widgets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.analytics_dashboards ad
            WHERE ad.id = analytics_widgets.dashboard_id
            AND (
                ad.created_by = auth.uid() OR
                ad.is_public = true OR
                EXISTS (
                    SELECT 1 FROM public.dashboard_shares ds
                    WHERE ds.dashboard_id = ad.id
                    AND ds.user_id = auth.uid()
                )
            )
        )
    );

-- Business Intelligence Metrics Policies
CREATE POLICY "business_intelligence_metrics_tenant_isolation" ON public.business_intelligence_metrics
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = business_intelligence_metrics.subscription_id
                    AND s.user_id = auth.uid()
                )
            )
            ELSE false
        END
    );

CREATE POLICY "business_intelligence_metrics_admin_access" ON public.business_intelligence_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'super_admin', 'analyst')
        )
    );

-- Analytics Exports Policies
CREATE POLICY "analytics_exports_tenant_isolation" ON public.analytics_exports
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_exports.subscription_id
                    AND s.user_id = auth.uid()
                )
            )
            ELSE false
        END
    );

CREATE POLICY "analytics_exports_user_access" ON public.analytics_exports
    FOR ALL USING (
        created_by = auth.uid()
    );

CREATE POLICY "analytics_exports_admin_access" ON public.analytics_exports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- CREATE SUPPORTING TABLES IF THEY DON'T EXIST
-- =====================================================

-- Dashboard shares table for shared dashboard access
CREATE TABLE IF NOT EXISTS public.dashboard_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID NOT NULL REFERENCES public.analytics_dashboards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_level TEXT NOT NULL DEFAULT 'view' CHECK (permission_level IN ('view', 'edit')),
    shared_by UUID NOT NULL REFERENCES auth.users(id),
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(dashboard_id, user_id)
);

-- Enable RLS on dashboard shares
ALTER TABLE public.dashboard_shares ENABLE ROW LEVEL SECURITY;

-- Dashboard shares policies
CREATE POLICY "dashboard_shares_owner_access" ON public.dashboard_shares
    FOR ALL USING (
        shared_by = auth.uid() OR user_id = auth.uid()
    );

CREATE POLICY "dashboard_shares_admin_access" ON public.dashboard_shares
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better RLS policy performance
CREATE INDEX IF NOT EXISTS idx_analytics_alerts_subscription_id ON public.analytics_alerts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_preferences_user_id ON public.analytics_user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_preferences_subscription_id ON public.analytics_user_preferences(subscription_id);
CREATE INDEX IF NOT EXISTS idx_real_time_analytics_subscription_id ON public.real_time_analytics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_analytics_query_cache_subscription_id ON public.analytics_query_cache(subscription_id);
CREATE INDEX IF NOT EXISTS idx_analytics_query_cache_user_id ON public.analytics_query_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_dashboards_subscription_id ON public.analytics_dashboards(subscription_id);
CREATE INDEX IF NOT EXISTS idx_analytics_dashboards_created_by ON public.analytics_dashboards(created_by);
CREATE INDEX IF NOT EXISTS idx_analytics_widgets_subscription_id ON public.analytics_widgets(subscription_id);
CREATE INDEX IF NOT EXISTS idx_analytics_widgets_dashboard_id ON public.analytics_widgets(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_business_intelligence_metrics_subscription_id ON public.business_intelligence_metrics(subscription_id);
CREATE INDEX IF NOT EXISTS idx_analytics_exports_subscription_id ON public.analytics_exports(subscription_id);
CREATE INDEX IF NOT EXISTS idx_analytics_exports_created_by ON public.analytics_exports(created_by);
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_dashboard_id ON public.dashboard_shares(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_user_id ON public.dashboard_shares(user_id);

-- =====================================================
-- ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "analytics_alerts_tenant_isolation" ON public.analytics_alerts IS 'Ensures users can only access analytics alerts for their subscription';
COMMENT ON POLICY "analytics_user_preferences_user_access" ON public.analytics_user_preferences IS 'Users can only access their own preferences';
COMMENT ON POLICY "real_time_analytics_tenant_isolation" ON public.real_time_analytics IS 'Tenant isolation for real-time analytics data';
COMMENT ON POLICY "analytics_query_cache_tenant_isolation" ON public.analytics_query_cache IS 'Tenant isolation for analytics query cache';
COMMENT ON POLICY "analytics_dashboards_tenant_isolation" ON public.analytics_dashboards IS 'Tenant isolation for analytics dashboards';
COMMENT ON POLICY "analytics_widgets_tenant_isolation" ON public.analytics_widgets IS 'Tenant isolation for analytics widgets';
COMMENT ON POLICY "business_intelligence_metrics_tenant_isolation" ON public.business_intelligence_metrics IS 'Tenant isolation for BI metrics';
COMMENT ON POLICY "analytics_exports_tenant_isolation" ON public.analytics_exports IS 'Tenant isolation for analytics exports';

-- =====================================================
-- GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant permissions for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_alerts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_user_preferences TO authenticated;
GRANT SELECT ON public.real_time_analytics TO authenticated;
GRANT SELECT ON public.analytics_query_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_dashboards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_widgets TO authenticated;
GRANT SELECT ON public.business_intelligence_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_exports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dashboard_shares TO authenticated;

-- Grant full access to service role
GRANT ALL ON public.analytics_alerts TO service_role;
GRANT ALL ON public.analytics_user_preferences TO service_role;
GRANT ALL ON public.real_time_analytics TO service_role;
GRANT ALL ON public.analytics_query_cache TO service_role;
GRANT ALL ON public.analytics_dashboards TO service_role;
GRANT ALL ON public.analytics_widgets TO service_role;
GRANT ALL ON public.business_intelligence_metrics TO service_role;
GRANT ALL ON public.analytics_exports TO service_role;
GRANT ALL ON public.dashboard_shares TO service_role;
