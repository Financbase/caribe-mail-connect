import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing report schedules...');

    // Get schedules that are due to run
    const now = new Date().toISOString();
    const { data: schedules, error: schedulesError } = await supabase
      .from('report_schedules')
      .select('*')
      .eq('is_active', true)
      .or(`next_run_at.is.null,next_run_at.lte.${now}`);

    if (schedulesError) {
      throw new Error(`Failed to fetch schedules: ${schedulesError.message}`);
    }

    console.log(`Found ${schedules?.length || 0} schedules to process`);

    if (!schedules || schedules.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No schedules due to run',
        processed: 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process each schedule
    const results = await Promise.allSettled(
      schedules.map(async (schedule) => {
        try {
          // Check if this schedule should run based on its configuration
          if (!shouldRunSchedule(schedule)) {
            console.log(`Skipping schedule ${schedule.id} - not due yet`);
            return { scheduleId: schedule.id, status: 'skipped' };
          }

          console.log(`Processing schedule ${schedule.id}`);
          
          // Call the send-scheduled-report function
          const response = await supabase.functions.invoke('send-scheduled-report', {
            body: { scheduleId: schedule.id },
          });

          if (response.error) {
            throw new Error(response.error.message);
          }

          return { 
            scheduleId: schedule.id, 
            status: 'success', 
            result: response.data 
          };
        } catch (error) {
          console.error(`Failed to process schedule ${schedule.id}:`, error);
          return { 
            scheduleId: schedule.id, 
            status: 'error', 
            error: error.message 
          };
        }
      })
    );

    // Count results
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'rejected' || r.value?.status === 'error').length;
    const skippedCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 'skipped').length;

    console.log(`Processed ${results.length} schedules: ${successCount} success, ${errorCount} errors, ${skippedCount} skipped`);

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      successful: successCount,
      errors: errorCount,
      skipped: skippedCount,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { status: 'error', error: r.reason }),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing report schedules:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function shouldRunSchedule(schedule: unknown): boolean {
  const now = new Date();
  const { schedule_type, schedule_config, last_run_at } = schedule;
  
  // If never run before, run it
  if (!last_run_at) {
    return true;
  }
  
  const lastRun = new Date(last_run_at);
  const timeSinceLastRun = now.getTime() - lastRun.getTime();
  
  switch (schedule_type) {
    case 'once':
      return false; // Don't run again if it's a one-time schedule
    case 'daily':
      return timeSinceLastRun >= 24 * 60 * 60 * 1000; // 24 hours
    case 'weekly':
      return timeSinceLastRun >= 7 * 24 * 60 * 60 * 1000; // 7 days
    case 'monthly': {
      // Check if it's been at least a month and we're on the right day
      const dayOfMonth = schedule_config?.day_of_month || lastRun.getDate();
      return now.getDate() === dayOfMonth && timeSinceLastRun >= 28 * 24 * 60 * 60 * 1000;
    }
    case 'quarterly':
      // Check if it's been at least 3 months
      return timeSinceLastRun >= 90 * 24 * 60 * 60 * 1000;
    default:
      return false;
  }
}