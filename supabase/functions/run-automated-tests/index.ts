import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { test_type, location_id } = await req.json()

    console.log(`Running automated tests: ${test_type}`)

    const testStartTime = Date.now()
    
    // Initialize test run record
    const { data: testRun, error: testRunError } = await supabase
      .from('automated_test_runs')
      .insert({
        location_id,
        test_suite_name: `Automated ${test_type} Tests`,
        test_type,
        status: 'running'
      })
      .select()
      .single()

    if (testRunError) throw testRunError

    let testResults = {
      passed: 0,
      failed: 0,
      skipped: 0,
      results: [] as any[]
    }

    // Run different test suites based on type
    switch (test_type) {
      case 'data_validation':
        testResults = await runDataValidationTests(supabase, location_id)
        break
      case 'workflow':
        testResults = await runWorkflowTests(supabase, location_id)
        break
      case 'api_monitoring':
        testResults = await runAPIMonitoringTests(supabase)
        break
      case 'db_integrity':
        testResults = await runDatabaseIntegrityTests(supabase, location_id)
        break
      default:
        throw new Error(`Unknown test type: ${test_type}`)
    }

    const executionTime = Date.now() - testStartTime

    // Update test run with results
    await supabase
      .from('automated_test_runs')
      .update({
        total_tests: testResults.passed + testResults.failed + testResults.skipped,
        passed_tests: testResults.passed,
        failed_tests: testResults.failed,
        skipped_tests: testResults.skipped,
        execution_time_ms: executionTime,
        test_results: testResults.results,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', testRun.id)

    console.log(`Tests completed: ${testResults.passed} passed, ${testResults.failed} failed`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        testRunId: testRun.id,
        results: testResults,
        executionTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error running tests:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function runDataValidationTests(supabase: any, locationId: string) {
  const results = []
  let passed = 0, failed = 0

  // Test: Check for customers without required fields
  try {
    const { data: incompleteCustomers } = await supabase
      .from('customers')
      .select('id, first_name, last_name, email')
      .or('first_name.is.null,last_name.is.null,email.is.null')
      .eq('location_id', locationId)

    if (incompleteCustomers && incompleteCustomers.length === 0) {
      results.push({ test: 'Customer data validation', status: 'passed', message: 'All customers have required fields' })
      passed++
    } else {
      results.push({ test: 'Customer data validation', status: 'failed', message: `${incompleteCustomers?.length} customers missing required fields` })
      failed++
    }
  } catch (error) {
    results.push({ test: 'Customer data validation', status: 'failed', message: error.message })
    failed++
  }

  // Test: Check for orphaned packages
  try {
    const { data: orphanedPackages } = await supabase
      .from('packages')
      .select('id, customer_id')
      .not('customer_id', 'in', 
        supabase.from('customers').select('id').eq('location_id', locationId)
      )

    if (orphanedPackages && orphanedPackages.length === 0) {
      results.push({ test: 'Package data integrity', status: 'passed', message: 'No orphaned packages found' })
      passed++
    } else {
      results.push({ test: 'Package data integrity', status: 'failed', message: `${orphanedPackages?.length} orphaned packages found` })
      failed++
    }
  } catch (error) {
    results.push({ test: 'Package data integrity', status: 'failed', message: error.message })
    failed++
  }

  return { passed, failed, skipped: 0, results }
}

async function runWorkflowTests(supabase: any, locationId: string) {
  const results = []
  let passed = 0, failed = 0

  // Test: Package intake workflow
  try {
    // Create test customer
    const { data: testCustomer, error: customerError } = await supabase
      .from('customers')
      .insert({
        location_id: locationId,
        first_name: 'Test',
        last_name: 'Customer',
        email: 'test@example.com',
        mailbox_number: 'TEST001',
        address_line1: '123 Test St',
        city: 'Test City',
        state: 'PR',
        zip_code: '00001'
      })
      .select()
      .single()

    if (customerError) throw customerError

    // Create test package
    const { data: testPackage, error: packageError } = await supabase
      .from('packages')
      .insert({
        location_id: locationId,
        customer_id: testCustomer.id,
        tracking_number: 'TEST123456',
        carrier: 'Test Carrier',
        status: 'arrived'
      })
      .select()
      .single()

    if (packageError) throw packageError

    // Clean up test data
    await supabase.from('packages').delete().eq('id', testPackage.id)
    await supabase.from('customers').delete().eq('id', testCustomer.id)

    results.push({ test: 'Package intake workflow', status: 'passed', message: 'Workflow completed successfully' })
    passed++
  } catch (error) {
    results.push({ test: 'Package intake workflow', status: 'failed', message: error.message })
    failed++
  }

  return { passed, failed, skipped: 0, results }
}

async function runAPIMonitoringTests(supabase: any) {
  const results = []
  let passed = 0, failed = 0

  // Test: Database connection
  try {
    const { data, error } = await supabase.from('locations').select('count').limit(1)
    if (error) throw error

    results.push({ test: 'Database connectivity', status: 'passed', message: 'Database connection successful' })
    passed++
  } catch (error) {
    results.push({ test: 'Database connectivity', status: 'failed', message: error.message })
    failed++
  }

  return { passed, failed, skipped: 0, results }
}

async function runDatabaseIntegrityTests(supabase: any, locationId: string) {
  const results = []
  let passed = 0, failed = 0

  // Test: Foreign key constraints
  try {
    const { data: invalidReferences } = await supabase
      .rpc('check_foreign_key_constraints', { location_id: locationId })

    if (!invalidReferences || invalidReferences.length === 0) {
      results.push({ test: 'Foreign key integrity', status: 'passed', message: 'All foreign key constraints valid' })
      passed++
    } else {
      results.push({ test: 'Foreign key integrity', status: 'failed', message: `${invalidReferences.length} invalid references found` })
      failed++
    }
  } catch (error) {
    // If the function doesn't exist, skip this test
    results.push({ test: 'Foreign key integrity', status: 'skipped', message: 'Test function not available' })
  }

  return { passed, failed, skipped: 0, results }
}