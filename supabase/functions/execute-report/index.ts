import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportExecutionRequest {
  reportId: string;
  parameters?: Record<string, any>;
  format?: 'json' | 'csv' | 'pdf' | 'excel';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { reportId, parameters = {}, format = 'json' }: ReportExecutionRequest = await req.json();
    
    console.log('Executing report:', reportId, 'with parameters:', parameters);

    // Get report configuration
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    // Create execution record
    const { data: execution, error: executionError } = await supabase
      .from('report_executions')
      .insert({
        report_id: reportId,
        status: 'running',
        parameters,
        executed_by: req.headers.get('user-id'),
        executed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (executionError) {
      throw new Error('Failed to create execution record');
    }

    const startTime = Date.now();
    let resultData: any[] = [];
    let rowCount = 0;

    try {
      // Execute report based on type and query configuration
      resultData = await executeReportQuery(supabase, report, parameters);
      rowCount = resultData.length;

      // Update execution as completed
      await supabase
        .from('report_executions')
        .update({
          status: 'completed',
          result_data: resultData,
          execution_time_ms: Date.now() - startTime,
          row_count: rowCount,
          completed_at: new Date().toISOString(),
        })
        .eq('id', execution.id);

      return new Response(JSON.stringify({
        execution_id: execution.id,
        status: 'completed',
        data: resultData,
        row_count: rowCount,
        execution_time_ms: Date.now() - startTime,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      // Update execution as failed
      await supabase
        .from('report_executions')
        .update({
          status: 'failed',
          error_message: error.message,
          execution_time_ms: Date.now() - startTime,
          completed_at: new Date().toISOString(),
        })
        .eq('id', execution.id);

      throw error;
    }

  } catch (error) {
    console.error('Error executing report:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function executeReportQuery(supabase: any, report: any, parameters: any): Promise<any[]> {
  const { query_config } = report;
  
  switch (report.type) {
    case 'operational':
      return await executeOperationalReport(supabase, query_config, parameters);
    case 'financial':
      return await executeFinancialReport(supabase, query_config, parameters);
    case 'compliance':
      return await executeComplianceReport(supabase, query_config, parameters);
    case 'custom':
      return await executeCustomReport(supabase, query_config, parameters);
    default:
      throw new Error('Unknown report type');
  }
}

async function executeOperationalReport(supabase: any, config: any, params: any): Promise<any[]> {
  const { report_name } = config;
  
  switch (report_name) {
    case 'daily_operations_summary':
      return await getDailyOperationsSummary(supabase, params);
    case 'package_aging_report':
      return await getPackageAgingReport(supabase, params);
    case 'carrier_performance':
      return await getCarrierPerformance(supabase, params);
    case 'staff_productivity':
      return await getStaffProductivity(supabase, params);
    case 'delivery_route_efficiency':
      return await getDeliveryRouteEfficiency(supabase, params);
    default:
      throw new Error('Unknown operational report');
  }
}

async function executeFinancialReport(supabase: any, config: any, params: any): Promise<any[]> {
  const { report_name } = config;
  
  switch (report_name) {
    case 'revenue_by_service':
      return await getRevenueByService(supabase, params);
    case 'accounts_receivable_aging':
      return await getAccountsReceivableAging(supabase, params);
    case 'cash_flow_analysis':
      return await getCashFlowAnalysis(supabase, params);
    case 'customer_profitability':
      return await getCustomerProfitability(supabase, params);
    case 'tax_liability':
      return await getTaxLiability(supabase, params);
    default:
      throw new Error('Unknown financial report');
  }
}

async function executeComplianceReport(supabase: any, config: any, params: any): Promise<any[]> {
  const { report_name } = config;
  
  switch (report_name) {
    case 'cmra_quarterly':
      return await getCMRAQuarterly(supabase, params);
    case 'form_1583_status':
      return await getForm1583Status(supabase, params);
    case 'id_verification_audit':
      return await getIdVerificationAudit(supabase, params);
    case 'compliance_scores':
      return await getComplianceScores(supabase, params);
    case 'regulatory_checklist':
      return await getRegulatoryChecklist(supabase, params);
    default:
      throw new Error('Unknown compliance report');
  }
}

async function executeCustomReport(supabase: any, config: any, params: any): Promise<any[]> {
  // Execute custom query based on configuration
  const { tables, fields, filters } = config;
  
  let query = supabase.from(tables[0]);
  
  if (fields && fields.length > 0) {
    query = query.select(fields.join(', '));
  } else {
    query = query.select('*');
  }
  
  // Apply filters
  if (filters) {
    for (const filter of filters) {
      const { field, operator, value } = filter;
      const paramValue = params[value] || value;
      
      switch (operator) {
        case 'eq':
          query = query.eq(field, paramValue);
          break;
        case 'gte':
          query = query.gte(field, paramValue);
          break;
        case 'lte':
          query = query.lte(field, paramValue);
          break;
        case 'like':
          query = query.like(field, `%${paramValue}%`);
          break;
      }
    }
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data || [];
}

// Operational report implementations
async function getDailyOperationsSummary(supabase: any, params: any) {
  const date = params.date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('packages')
    .select(`
      id,
      status,
      received_at,
      delivered_at,
      carrier,
      customer_name,
      location_id
    `)
    .gte('received_at', `${date}T00:00:00`)
    .lt('received_at', `${date}T23:59:59`);
    
  if (error) throw error;
  return data || [];
}

async function getPackageAgingReport(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      id,
      tracking_number,
      customer_name,
      received_at,
      status,
      carrier,
      location_id
    `)
    .in('status', ['Received', 'Available']);
    
  if (error) throw error;
  return data || [];
}

async function getCarrierPerformance(supabase: any, params: any) {
  const startDate = params.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = params.end_date || new Date().toISOString();
  
  const { data, error } = await supabase
    .from('packages')
    .select(`
      carrier,
      status,
      received_at,
      delivered_at
    `)
    .gte('received_at', startDate)
    .lte('received_at', endDate);
    
  if (error) throw error;
  return data || [];
}

async function getStaffProductivity(supabase: any, params: any) {
  const startDate = params.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = params.end_date || new Date().toISOString();
  
  const { data, error } = await supabase
    .from('packages')
    .select(`
      received_by,
      delivered_by,
      received_at,
      delivered_at,
      status
    `)
    .gte('received_at', startDate)
    .lte('received_at', endDate);
    
  if (error) throw error;
  return data || [];
}

async function getDeliveryRouteEfficiency(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('delivery_routes')
    .select(`
      *,
      deliveries(*)
    `);
    
  if (error) throw error;
  return data || [];
}

// Financial report implementations
async function getRevenueByService(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('invoice_items')
    .select(`
      item_type,
      line_total,
      billing_period_start,
      billing_period_end,
      invoices(status)
    `);
    
  if (error) throw error;
  return data || [];
}

async function getAccountsReceivableAging(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customers(first_name, last_name, business_name)
    `)
    .neq('status', 'paid');
    
  if (error) throw error;
  return data || [];
}

async function getCashFlowAnalysis(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('mailbox_payments')
    .select(`
      *,
      customers(first_name, last_name, business_name)
    `)
    .eq('status', 'completed');
    
  if (error) throw error;
  return data || [];
}

async function getCustomerProfitability(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      mailboxes(monthly_rate, annual_rate),
      packages(count)
    `);
    
  if (error) throw error;
  return data || [];
}

async function getTaxLiability(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      total_amount,
      tax_amount,
      issue_date,
      status
    `)
    .eq('status', 'paid');
    
  if (error) throw error;
  return data || [];
}

// Compliance report implementations
async function getCMRAQuarterly(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('customer_compliance')
    .select(`
      *,
      customers(*)
    `);
    
  if (error) throw error;
  return data || [];
}

async function getForm1583Status(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('customer_compliance')
    .select(`
      *,
      customers(first_name, last_name, business_name)
    `);
    
  if (error) throw error;
  return data || [];
}

async function getIdVerificationAudit(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('compliance_audit_log')
    .select('*')
    .eq('table_name', 'customer_compliance');
    
  if (error) throw error;
  return data || [];
}

async function getComplianceScores(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('customer_compliance')
    .select(`
      compliance_score,
      customers(first_name, last_name, business_name, act_60_status)
    `);
    
  if (error) throw error;
  return data || [];
}

async function getRegulatoryChecklist(supabase: any, params: any) {
  const { data, error } = await supabase
    .from('act_60_compliance')
    .select(`
      *,
      customers(first_name, last_name, business_name)
    `);
    
  if (error) throw error;
  return data || [];
}