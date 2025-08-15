-- Verification Script for RLS Fixes
-- This script verifies that all RLS warnings have been addressed

-- =====================================================
-- CHECK RLS STATUS ON ALL TABLES
-- =====================================================

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

-- =====================================================
-- CHECK POLICIES ON ALL TABLES
-- =====================================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN '✅ Has USING clause'
        ELSE '⚠️ No USING clause'
    END as using_clause_status,
    CASE 
        WHEN with_check IS NOT NULL THEN '✅ Has WITH CHECK clause'
        ELSE 'ℹ️ No WITH CHECK clause'
    END as with_check_status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
    'analytics_alerts',
    'analytics_user_preferences', 
    'real_time_analytics',
    'analytics_query_cache',
    'analytics_dashboards',
    'analytics_widgets',
    'business_intelligence_metrics',
    'analytics_exports',
    'dashboard_shares'
)
ORDER BY tablename, policyname;

-- =====================================================
-- CHECK FOR MISSING POLICIES
-- =====================================================

WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'analytics_alerts',
        'analytics_user_preferences', 
        'real_time_analytics',
        'analytics_query_cache',
        'analytics_dashboards',
        'analytics_widgets',
        'business_intelligence_metrics',
        'analytics_exports'
    ]) as table_name
),
tables_with_policies AS (
    SELECT DISTINCT tablename 
    FROM pg_policies 
    WHERE schemaname = 'public'
)
SELECT 
    et.table_name,
    CASE 
        WHEN twp.tablename IS NOT NULL THEN '✅ Has Policies'
        ELSE '❌ Missing Policies'
    END as policy_status
FROM expected_tables et
LEFT JOIN tables_with_policies twp ON et.table_name = twp.tablename
ORDER BY et.table_name;

-- =====================================================
-- CHECK INDEXES FOR PERFORMANCE
-- =====================================================

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef,
    '✅ Index exists' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN (
    'analytics_alerts',
    'analytics_user_preferences', 
    'real_time_analytics',
    'analytics_query_cache',
    'analytics_dashboards',
    'analytics_widgets',
    'business_intelligence_metrics',
    'analytics_exports',
    'dashboard_shares'
)
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =====================================================
-- CHECK PERMISSIONS
-- =====================================================

SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable,
    '✅ Permission granted' as status
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name IN (
    'analytics_alerts',
    'analytics_user_preferences', 
    'real_time_analytics',
    'analytics_query_cache',
    'analytics_dashboards',
    'analytics_widgets',
    'business_intelligence_metrics',
    'analytics_exports',
    'dashboard_shares'
)
AND grantee IN ('authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- =====================================================
-- SUMMARY REPORT
-- =====================================================

WITH rls_status AS (
    SELECT 
        COUNT(*) as total_tables,
        COUNT(*) FILTER (WHERE rowsecurity = true) as rls_enabled_tables,
        COUNT(*) FILTER (WHERE rowsecurity = false) as rls_disabled_tables
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
),
policy_status AS (
    SELECT 
        COUNT(DISTINCT tablename) as tables_with_policies,
        COUNT(*) as total_policies
    FROM pg_policies 
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
)
SELECT 
    '🔒 RLS SECURITY SUMMARY' as section,
    rs.total_tables as "Total Tables",
    rs.rls_enabled_tables as "RLS Enabled",
    rs.rls_disabled_tables as "RLS Disabled",
    ps.tables_with_policies as "Tables with Policies",
    ps.total_policies as "Total Policies",
    CASE 
        WHEN rs.rls_disabled_tables = 0 AND ps.tables_with_policies = rs.total_tables 
        THEN '✅ ALL WARNINGS FIXED'
        ELSE '⚠️ ISSUES REMAINING'
    END as "Overall Status"
FROM rls_status rs, policy_status ps;

-- =====================================================
-- SPECIFIC WARNING CHECKS
-- =====================================================

-- Check for the specific warnings mentioned in the file
SELECT 
    'Policy Exists RLS Disabled Check' as check_type,
    tablename,
    CASE 
        WHEN rowsecurity = true THEN '✅ FIXED: RLS is now enabled'
        ELSE '❌ ISSUE: RLS still disabled despite policies'
    END as status
FROM pg_tables pt
WHERE schemaname = 'public' 
AND tablename IN ('analytics_alerts', 'analytics_user_preferences')
AND EXISTS (
    SELECT 1 FROM pg_policies pp 
    WHERE pp.schemaname = pt.schemaname 
    AND pp.tablename = pt.tablename
);

SELECT 
    'RLS Disabled in Public Check' as check_type,
    tablename,
    CASE 
        WHEN rowsecurity = true THEN '✅ FIXED: RLS is now enabled'
        ELSE '❌ ISSUE: RLS still disabled'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'real_time_analytics',
    'analytics_query_cache',
    'analytics_dashboards',
    'analytics_widgets',
    'business_intelligence_metrics',
    'analytics_exports',
    'analytics_user_preferences',
    'analytics_alerts'
);
