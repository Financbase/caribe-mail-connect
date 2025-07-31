// Import from deps.ts for better dependency management
import { serve, createServiceRoleClient, handleError } from './deps.js';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'
};

// Define request and response types
interface TestRequest {
  test_type: string;
  location_id: string;
  [key: string]: unknown;
}

// Test result types
type TestStatus = 'passed' | 'failed' | 'skipped';

interface TestResult {
  name: string;
  status: TestStatus;
  duration: number;
  error?: string;
  details?: unknown;
}

interface TestResults {
  passed: number;
  failed: number;
  skipped: number;
  tests: TestResult[];
  duration: number;
  test_run_id?: string;
  test_type: string;
  location_id: string;
}

// Helper function to create a test result
function createTestResult(
  name: string, 
  status: TestStatus, 
  duration: number, 
  error?: string, 
  details?: unknown
): TestResult {
  const result: TestResult = {
    name,
    status,
    duration,
  };
  
  if (error) {
    result.error = error;
  }
  
  if (details) {
    result.details = details;
  }
  
  return result;
}

// Helper function to run a test case
async function runTest<T>(
  testName: string, 
  testFn: () => Promise<T>,
  results: TestResults
): Promise<T | null> {
  const startTime = Date.now();
  
  try {
    const result = await testFn();
    const duration = Date.now() - startTime;
    
    results.tests.push(createTestResult(testName, 'passed', duration));
    results.passed++;
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    results.tests.push(createTestResult(
      testName, 
      'failed', 
      duration, 
      errorMessage,
      errorStack
    ));
    results.failed++;
    
    return null;
  }
}

// Test functions

async function runWorkflowTests(supabase: any, locationId: string, results: TestResults): Promise<void> {
  await runTest('Workflow: Check location exists', async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('id')
      .eq('id', locationId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Location not found');
    
    return data;
  }, results);

  // Add more workflow tests as needed
}

async function runAPIMonitoringTests(supabase: any, results: TestResults): Promise<void> {
  await runTest('API: Check health endpoint', async () => {
    const response = await fetch('https://api.example.com/health');
    if (!response.ok) {
      throw new Error(`API health check failed with status ${response.status}`);
    }
    return response.json();
  }, results);

  // Add more API tests as needed
}

async function runDatabaseIntegrityTests(supabase: any, locationId: string, results: TestResults): Promise<void> {
  await runTest('Database: Check for orphaned records', async () => {
    const { data, error } = await supabase.rpc('check_orphaned_records', { location_id: locationId });
    
    if (error) throw error;
    if (data && data.length > 0) {
      throw new Error(`Found ${data.length} orphaned records`);
    }
    
    return data;
  }, results);

  // Add more database integrity tests as needed
}

// Main request handler
async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders } }
    );
  }

  // Parse and validate request body
  let requestData: unknown;
  try {
    requestData = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { ...corsHeaders } }
    );
  }

  // Type guard to validate request data
  const isTestRequest = (data: unknown): data is TestRequest => {
    return (
      typeof data === 'object' && 
      data !== null &&
      'test_type' in data && 
      'location_id' in data &&
      typeof (data as any).test_type === 'string' &&
      typeof (data as any).location_id === 'string'
    );
  };

  // Validate request data structure
  if (!isTestRequest(requestData)) {
    return new Response(
      JSON.stringify({ error: 'Invalid request data: must include test_type and location_id as strings' }),
      { status: 400, headers: { ...corsHeaders } }
    );
  }

  // Validate required fields
  if (!requestData.test_type || !requestData.location_id) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: test_type and location_id are required' }),
      { status: 400, headers: { ...corsHeaders } }
    );
  }

  // Initialize test results
  const testResults: TestResults = {
    test_type: requestData.test_type,
    location_id: requestData.location_id,
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
    duration: 0,
  };

  // Create a Supabase client with service role
  const supabase = createServiceRoleClient();
  const startTime: number = Date.now();
  interface TestRun {
    id: string;
  }
  
  let testRun: TestRun | null = null;
  
  try {
    // Create a new test run record
    const { data: newTestRun, error: createError } = await supabase
      .from('automated_test_runs')
      .insert({
        test_type: requestData.test_type,
        location_id: requestData.location_id,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single<TestRun>();
      
    if (createError || !newTestRun) {
      throw new Error(createError?.message || 'Failed to create test run');
    }
    
    testRun = newTestRun;

    // Run the appropriate tests based on test_type
    switch (requestData.test_type) {
      case 'workflow':
        await runWorkflowTests(supabase, requestData.location_id, testResults);
        break;
      case 'api':
        await runAPIMonitoringTests(supabase, testResults);
        break;
      case 'database':
        await runDatabaseIntegrityTests(supabase, requestData.location_id, testResults);
        break;
      default:
        throw new Error(`Unknown test type: ${requestData.test_type}`);
    }

    // Calculate test duration
    const duration = Date.now() - startTime;
    testResults.duration = duration;

    // Update test run with results
    const { error: updateError } = await supabase
      .from('automated_test_runs')
      .update({
        completed_at: new Date().toISOString(),
        status: testResults.failed === 0 ? 'passed' : 'failed',
        test_count: testResults.passed + testResults.failed + testResults.skipped,
        passed_count: testResults.passed,
        failed_count: testResults.failed,
        skipped_count: testResults.skipped,
        duration_seconds: Math.floor(duration / 1000),
        results: testResults.tests
      })
      .eq('id', testRun.id);

    if (updateError) throw updateError;
    
    if (!testRun) {
      throw new Error('Test run record not found after creation');
    }

    // Return results
    return new Response(
      JSON.stringify({
        success: true,
        ...testResults
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    // Handle any errors that occur during test execution
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Test execution failed:', error);
    
    // Update test run with error status
    try {
      await supabase
        .from('automated_test_runs')
        .update({
          completed_at: new Date().toISOString(),
          status: 'error',
          error_message: errorMessage,
          duration_seconds: Math.floor((Date.now() - startTime) / 1000)
        })
        .eq('id', testRun?.id);
    } catch (updateError) {
      console.error('Failed to update test run with error:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        ...testResults
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}

// Start the server
function getPort(): number {
  try {
    // Try to get port from environment variable if running in Deno
    // @ts-ignore - Deno is available at runtime
    const envPort = Deno?.env?.get('PORT');
    return envPort ? parseInt(envPort, 10) : 8000;
  } catch (e) {
    // Ignore if Deno is not available (e.g., during type checking)
    console.warn('Running with default port 8000');
    return 8000;
  }
}

const port = getPort();
console.log(`Server running on port ${port}`);

// Start the server with the specified port
const options = { port };
serve(handleRequest, options);