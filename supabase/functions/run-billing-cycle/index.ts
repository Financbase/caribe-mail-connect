import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Sentry } from "../_shared/sentry.ts"; // 2025-08-13: error tracking

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BILLING-CYCLE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting billing cycle automation");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get billing configuration
    const { data: config, error: configError } = await supabase
      .from('virtual_mailbox_billing_config')
      .select('*')
      .eq('auto_billing_enabled', true)
      .limit(1)
      .maybeSingle();

    if (configError) throw configError;

    if (!config) {
      logStep("No active billing configuration found");
      return new Response(JSON.stringify({ 
        message: "No active billing configuration",
        processed: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found billing configuration", { config: config.id });

    // Calculate billing period
    const now = new Date();
    const billingPeriodEnd = new Date(now);
    billingPeriodEnd.setHours(23, 59, 59, 999);
    
    const billingPeriodStart = new Date(billingPeriodEnd);
    billingPeriodStart.setDate(billingPeriodStart.getDate() - config.billing_cycle_days);
    billingPeriodStart.setHours(0, 0, 0, 0);

    logStep("Billing period calculated", {
      start: billingPeriodStart.toISOString(),
      end: billingPeriodEnd.toISOString()
    });

    // Get all virtual mailboxes
    const { data: virtualMailboxes, error: vmError } = await supabase
      .from('virtual_mailboxes')
      .select('id, customer_id, status')
      .eq('status', 'active');

    if (vmError) throw vmError;

    logStep(`Found ${virtualMailboxes?.length || 0} active virtual mailboxes`);

    let processedCount = 0;
    let totalBilled = 0;

    // Process each virtual mailbox
    for (const vm of virtualMailboxes || []) {
      try {
        // Calculate usage for this period
        const { data: usageData, error: usageError } = await supabase
          .rpc('calculate_virtual_mailbox_usage', {
            p_customer_id: vm.customer_id,
            p_start_date: billingPeriodStart.toISOString(),
            p_end_date: billingPeriodEnd.toISOString()
          });

        if (usageError) {
          logStep("Error calculating usage", { error: usageError, vmId: vm.id });
          continue;
        }

        const usage = usageData[0];
        
        if (!usage || usage.total_cost === 0) {
          logStep("No billable usage found", { vmId: vm.id });
          continue;
        }

        // Check if billing record already exists for this period
        const { data: existingBilling, error: existingError } = await supabase
          .from('virtual_mailbox_billing')
          .select('id')
          .eq('virtual_mailbox_id', vm.id)
          .eq('billing_period_start', billingPeriodStart.toISOString().split('T')[0])
          .eq('billing_period_end', billingPeriodEnd.toISOString().split('T')[0])
          .maybeSingle();

        if (existingError) throw existingError;

        if (existingBilling) {
          logStep("Billing record already exists", { vmId: vm.id });
          continue;
        }

        // Create billing record
        const { error: billingError } = await supabase
          .from('virtual_mailbox_billing')
          .insert({
            virtual_mailbox_id: vm.id,
            customer_id: vm.customer_id,
            billing_period_start: billingPeriodStart.toISOString().split('T')[0],
            billing_period_end: billingPeriodEnd.toISOString().split('T')[0],
            total_actions: usage.total_actions,
            total_amount: usage.total_cost,
            scan_actions: usage.scan_actions,
            forward_actions: usage.forward_actions,
            shred_actions: usage.shred_actions,
            status: 'pending'
          });

        if (billingError) {
          logStep("Error creating billing record", { error: billingError, vmId: vm.id });
          continue;
        }

        processedCount++;
        totalBilled += Number(usage.total_cost);

        logStep("Created billing record", {
          vmId: vm.id,
          customerId: vm.customer_id,
          amount: usage.total_cost,
          actions: usage.total_actions
        });

      } catch (error) {
        logStep("Error processing virtual mailbox", { error: error.message, vmId: vm.id });
        continue;
      }
    }

    // Create billing run record
    const { error: runError } = await supabase
      .from('billing_runs')
      .insert({
        location_id: null, // Global run
        billing_period_start: billingPeriodStart.toISOString().split('T')[0],
        billing_period_end: billingPeriodEnd.toISOString().split('T')[0],
        total_customers: processedCount,
        total_amount: totalBilled,
        total_invoices: processedCount,
        status: 'completed',
        completed_at: new Date().toISOString(),
        notes: 'Automated virtual mailbox billing cycle'
      });

    if (runError) {
      logStep("Error creating billing run record", { error: runError });
    }

    logStep("Billing cycle completed", {
      processed: processedCount,
      totalBilled: totalBilled
    });

    return new Response(JSON.stringify({
      success: true,
      processed: processedCount,
      totalBilled: totalBilled,
      billingPeriod: {
        start: billingPeriodStart.toISOString(),
        end: billingPeriodEnd.toISOString()
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    Sentry.captureException(error);
    logStep("ERROR in billing cycle", { message: error.message });
    return new Response(JSON.stringify({
      error: error.message,
      processed: 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});