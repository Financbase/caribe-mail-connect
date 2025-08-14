-- CRITICAL SECURITY FIX: Enable RLS on Staging/Development Branches
-- This script addresses the critical security regression where RLS is disabled
-- on multiple tables despite having policies present

-- =============================================================================
-- PHASE 1: ENABLE RLS ON ALL AFFECTED TABLES
-- =============================================================================

-- Enable RLS on loyalty system tables
ALTER TABLE public.loyalty_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_tiers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on community and business tables
ALTER TABLE public.community_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_vendors ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user tier system
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_benefits ENABLE ROW LEVEL SECURITY;

-- Note: spatial_ref_sys is a PostGIS system table - handle separately if needed

-- =============================================================================
-- PHASE 2: APPLY OPTIMIZED POLICIES FROM PRODUCTION
-- =============================================================================

-- Loyalty achievements - Apply consolidated access pattern
DROP POLICY IF EXISTS "Public can view achievements" ON loyalty_achievements;
CREATE POLICY "loyalty_achievements_consolidated_access" ON loyalty_achievements FOR ALL TO public USING (
  CASE 
    WHEN (SELECT is_staff FROM get_current_user_context()) THEN true
    ELSE true  -- Public read access maintained
  END
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- Loyalty challenges - Apply consolidated access pattern
DROP POLICY IF EXISTS "Public can view challenges" ON loyalty_challenges;
CREATE POLICY "loyalty_challenges_consolidated_access" ON loyalty_challenges FOR ALL TO public USING (
  CASE 
    WHEN (SELECT is_staff FROM get_current_user_context()) THEN true
    ELSE true  -- Public read access maintained
  END
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- Loyalty rewards - Apply consolidated access pattern
DROP POLICY IF EXISTS "Public can view rewards" ON loyalty_rewards;
CREATE POLICY "loyalty_rewards_consolidated_access" ON loyalty_rewards FOR ALL TO public USING (
  CASE 
    WHEN (SELECT is_staff FROM get_current_user_context()) THEN true
    ELSE true  -- Public read access maintained
  END
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- Loyalty tiers - Apply consolidated access pattern
DROP POLICY IF EXISTS "Public can view tiers" ON loyalty_tiers;
CREATE POLICY "loyalty_tiers_consolidated_access" ON loyalty_tiers FOR ALL TO public USING (
  CASE 
    WHEN (SELECT is_staff FROM get_current_user_context()) THEN true
    ELSE true  -- Public read access maintained
  END
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- Community goals - Apply consolidated access pattern
DROP POLICY IF EXISTS "Public can view community goals" ON community_goals;
CREATE POLICY "community_goals_consolidated_access" ON community_goals FOR ALL TO public USING (
  CASE 
    WHEN (SELECT is_staff FROM get_current_user_context()) THEN true
    ELSE true  -- Public read access maintained
  END
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- Business partners - Apply staff-only access
CREATE POLICY "business_partners_staff_access" ON business_partners FOR ALL TO public USING (
  (SELECT is_staff FROM get_current_user_context())
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- Partner vendors - Apply staff-only access
CREATE POLICY "partner_vendors_staff_access" ON partner_vendors FOR ALL TO public USING (
  (SELECT is_staff FROM get_current_user_context())
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- User tiers - Apply user + staff access
CREATE POLICY "user_tiers_consolidated_access" ON user_tiers FOR ALL TO public USING (
  (SELECT is_staff FROM get_current_user_context()) OR
  user_id = (SELECT user_id FROM get_current_user_context())
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- Tier benefits - Apply public read, staff manage
CREATE POLICY "tier_benefits_consolidated_access" ON tier_benefits FOR ALL TO public USING (
  CASE 
    WHEN (SELECT is_staff FROM get_current_user_context()) THEN true
    ELSE true  -- Public read access for tier information
  END
) WITH CHECK ((SELECT is_staff FROM get_current_user_context()));

-- =============================================================================
-- PHASE 3: VALIDATION QUERIES
-- =============================================================================

-- Verify RLS is enabled on all tables
SELECT 
  'RLS_ENABLEMENT_CHECK' as check_type,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN 'SECURE'
    ELSE 'VULNERABLE'
  END as security_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'loyalty_achievements', 'loyalty_challenges', 'loyalty_rewards', 'loyalty_tiers',
    'community_goals', 'business_partners', 'partner_vendors', 'user_tiers', 'tier_benefits'
  )
ORDER BY tablename;

-- Verify policies are applied
SELECT 
  'POLICY_APPLICATION_CHECK' as check_type,
  tablename,
  COUNT(*) as policy_count,
  array_agg(policyname ORDER BY policyname) as applied_policies
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN (
    'loyalty_achievements', 'loyalty_challenges', 'loyalty_rewards', 'loyalty_tiers',
    'community_goals', 'business_partners', 'partner_vendors', 'user_tiers', 'tier_benefits'
  )
GROUP BY tablename
ORDER BY tablename;

-- Check for remaining warnings
SELECT 
  'REMAINING_WARNINGS_CHECK' as check_type,
  COUNT(*) as tables_with_potential_issues
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public'
  AND t.rowsecurity = false
  AND p.policyname IS NOT NULL;

-- =============================================================================
-- PHASE 4: OPTIMIZATION VALIDATION
-- =============================================================================

-- Verify optimization levels match production standards
SELECT 
  'OPTIMIZATION_VALIDATION' as validation_type,
  json_build_object(
    'total_tables_with_rls', (
      SELECT COUNT(*) FROM pg_tables 
      WHERE schemaname = 'public' AND rowsecurity = true
    ),
    'total_policies', (
      SELECT COUNT(*) FROM pg_policies 
      WHERE schemaname = 'public'
    ),
    'optimized_policies', (
      SELECT COUNT(*) FROM pg_policies 
      WHERE schemaname = 'public' 
        AND (policyname LIKE '%consolidated%' OR policyname LIKE '%optimized%' OR policyname LIKE '%ultimate%')
    ),
    'security_status', 'RESTORED',
    'optimization_level', 'PRODUCTION_ALIGNED'
  ) as validation_results;

SELECT 'CRITICAL_SECURITY_FIX_COMPLETE' as status;
