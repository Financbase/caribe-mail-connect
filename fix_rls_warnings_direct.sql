-- Direct RLS Fix for Supabase Warnings
-- Run this script directly in your Supabase SQL Editor or via psql

-- =====================================================
-- ENABLE RLS ON ALL AFFECTED TABLES
-- =====================================================

-- Enable RLS on tables mentioned in warnings
ALTER TABLE IF EXISTS public.analytics_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.real_time_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_query_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_intelligence_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_exports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DROP EXISTING POLICIES IF THEY EXIST
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "analytics_alerts_access" ON public.analytics_alerts;
DROP POLICY IF EXISTS "analytics_user_preferences_access" ON public.analytics_user_preferences;

-- Drop any other existing policies on these tables
DROP POLICY IF EXISTS "analytics_alerts_tenant_isolation" ON public.analytics_alerts;
DROP POLICY IF EXISTS "analytics_user_preferences_user_access" ON public.analytics_user_preferences;
DROP POLICY IF EXISTS "real_time_analytics_tenant_isolation" ON public.real_time_analytics;
DROP POLICY IF EXISTS "analytics_query_cache_tenant_isolation" ON public.analytics_query_cache;
DROP POLICY IF EXISTS "analytics_dashboards_tenant_isolation" ON public.analytics_dashboards;
DROP POLICY IF EXISTS "analytics_widgets_tenant_isolation" ON public.analytics_widgets;
DROP POLICY IF EXISTS "business_intelligence_metrics_tenant_isolation" ON public.business_intelligence_metrics;
DROP POLICY IF EXISTS "analytics_exports_tenant_isolation" ON public.analytics_exports;

-- =====================================================
-- CREATE COMPREHENSIVE RLS POLICIES
-- =====================================================

-- Analytics Alerts Policies
CREATE POLICY "analytics_alerts_tenant_isolation" ON public.analytics_alerts
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                -- Allow access if user owns the subscription
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_alerts.subscription_id
                    AND s.user_id = auth.uid()
                )
                OR
                -- Allow access if user is admin
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin')
                )
            )
            ELSE false
        END
    );

-- Analytics User Preferences Policies
CREATE POLICY "analytics_user_preferences_user_access" ON public.analytics_user_preferences
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                user_id = auth.uid()
                OR
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin')
                )
            )
            ELSE false
        END
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
                OR
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin')
                )
            )
            ELSE false
        END
    );

-- Analytics Query Cache Policies
CREATE POLICY "analytics_query_cache_tenant_isolation" ON public.analytics_query_cache
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                user_id = auth.uid()
                OR
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_query_cache.subscription_id
                    AND s.user_id = auth.uid()
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin')
                )
            )
            ELSE false
        END
    );

-- Analytics Dashboards Policies
CREATE POLICY "analytics_dashboards_tenant_isolation" ON public.analytics_dashboards
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                created_by = auth.uid()
                OR
                is_public = true
                OR
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_dashboards.subscription_id
                    AND s.user_id = auth.uid()
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin')
                )
            )
            ELSE false
        END
    );

-- Analytics Widgets Policies
CREATE POLICY "analytics_widgets_tenant_isolation" ON public.analytics_widgets
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                EXISTS (
                    SELECT 1 FROM public.analytics_dashboards ad
                    WHERE ad.id = analytics_widgets.dashboard_id
                    AND (
                        ad.created_by = auth.uid() 
                        OR ad.is_public = true
                        OR EXISTS (
                            SELECT 1 FROM public.subscriptions s
                            WHERE s.id = ad.subscription_id
                            AND s.user_id = auth.uid()
                        )
                    )
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin')
                )
            )
            ELSE false
        END
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
                OR
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin', 'analyst')
                )
            )
            ELSE false
        END
    );

-- Analytics Exports Policies
CREATE POLICY "analytics_exports_tenant_isolation" ON public.analytics_exports
    FOR ALL USING (
        CASE 
            WHEN auth.role() = 'service_role' THEN true
            WHEN auth.role() = 'authenticated' THEN (
                created_by = auth.uid()
                OR
                EXISTS (
                    SELECT 1 FROM public.subscriptions s
                    WHERE s.id = analytics_exports.subscription_id
                    AND s.user_id = auth.uid()
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.user_roles ur
                    WHERE ur.user_id = auth.uid()
                    AND ur.role IN ('admin', 'super_admin')
                )
            )
            ELSE false
        END
    );

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

-- Grant full access to service role
GRANT ALL ON public.analytics_alerts TO service_role;
GRANT ALL ON public.analytics_user_preferences TO service_role;
GRANT ALL ON public.real_time_analytics TO service_role;
GRANT ALL ON public.analytics_query_cache TO service_role;
GRANT ALL ON public.analytics_dashboards TO service_role;
GRANT ALL ON public.analytics_widgets TO service_role;
GRANT ALL ON public.business_intelligence_metrics TO service_role;
GRANT ALL ON public.analytics_exports TO service_role;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'analytics_alerts',
    'analytics_user_preferences', 
    'real_time_analytics',
    'analytics_query_cache',
    'analytics_dashboards',
    'analytics_widgets',
    'business_intelligence_metrics',
    'analytics_exports'
)
ORDER BY tablename;
