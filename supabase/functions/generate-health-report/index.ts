import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Sentry } from "../_shared/sentry.ts"; // 2025-08-13: error tracking

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseConfig {
  url: string
  key: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting health report generation...')

    // Get all locations
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('id, name')

    if (locationsError) throw locationsError

    for (const location of locations) {
      console.log(`Generating health report for location: ${location.name}`)

      // Get system health metrics for the last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      const { data: healthMetrics } = await supabase
        .from('system_health_metrics')
        .select('*')
        .eq('location_id', location.id)
        .gte('recorded_at', yesterday)

      const { data: failedProcesses } = await supabase
        .from('failed_processes')
        .select('*')
        .eq('location_id', location.id)
        .eq('status', 'open')

      const { data: errorReports } = await supabase
        .from('user_error_reports')
        .select('*')
        .eq('location_id', location.id)
        .gte('reported_at', yesterday)

      const { data: performanceMetrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('location_id', location.id)
        .gte('recorded_at', yesterday)

      const { data: testRuns } = await supabase
        .from('automated_test_runs')
        .select('*')
        .eq('location_id', location.id)
        .gte('started_at', yesterday)

      // Calculate health scores
      const criticalMetrics = healthMetrics?.filter(m => m.status === 'critical').length || 0
      const warningMetrics = healthMetrics?.filter(m => m.status === 'warning').length || 0
      const totalFailedProcesses = failedProcesses?.length || 0
      const totalErrorReports = errorReports?.length || 0

      const passedTests = testRuns?.reduce((acc, run) => acc + run.passed_tests, 0) || 0
      const totalTests = testRuns?.reduce((acc, run) => acc + run.total_tests, 0) || 0
      const testPassRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 100

      const avgResponseTime = performanceMetrics?.length > 0 
        ? performanceMetrics.reduce((acc, m) => acc + (m.response_time_ms || 0), 0) / performanceMetrics.length 
        : 0

      // Calculate overall health score
      let healthScore = 100
      healthScore -= criticalMetrics * 20
      healthScore -= warningMetrics * 5
      healthScore -= totalFailedProcesses * 10
      healthScore -= totalErrorReports * 2
      healthScore = Math.max(0, healthScore)

      const performanceScore = avgResponseTime < 200 ? 100 : avgResponseTime < 500 ? 80 : 60

      // Detect anomalies
      const anomalies = []
      if (criticalMetrics > 0) anomalies.push(`${criticalMetrics} critical system metrics`)
      if (totalFailedProcesses > 5) anomalies.push(`High number of failed processes: ${totalFailedProcesses}`)
      if (avgResponseTime > 1000) anomalies.push(`Poor response time: ${avgResponseTime.toFixed(0)}ms`)
      if (testPassRate < 90) anomalies.push(`Low test pass rate: ${testPassRate.toFixed(1)}%`)

      // Generate recommendations
      const recommendations = []
      if (criticalMetrics > 0) recommendations.push('Investigate critical system metrics immediately')
      if (totalFailedProcesses > 3) recommendations.push('Review and resolve failed processes')
      if (avgResponseTime > 500) recommendations.push('Optimize system performance')
      if (testPassRate < 95) recommendations.push('Review and fix failing tests')

      // Insert daily health report
      await supabase
        .from('daily_health_reports')
        .insert({
          location_id: location.id,
          report_date: new Date().toISOString().split('T')[0],
          overall_health_score: healthScore,
          system_uptime_percentage: 100 - (criticalMetrics * 5),
          error_count: totalErrorReports,
          performance_score: performanceScore,
          critical_issues_count: criticalMetrics,
          warnings_count: warningMetrics,
          tests_passed_percentage: testPassRate,
          anomalies_detected: anomalies,
          recommendations: recommendations,
          report_data: {
            healthMetrics: healthMetrics?.length || 0,
            failedProcesses: totalFailedProcesses,
            errorReports: totalErrorReports,
            avgResponseTime,
            testRuns: testRuns?.length || 0
          }
        })

      console.log(`Health report generated for ${location.name}: ${healthScore.toFixed(1)}% health score`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Health reports generated for ${locations.length} locations` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    Sentry.captureException(error)
    console.error('Error generating health report:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})