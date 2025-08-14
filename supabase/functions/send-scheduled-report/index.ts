import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ScheduledReportRequest {
  scheduleId: string;
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

    const { scheduleId }: ScheduledReportRequest = await req.json();
    
    console.log('Processing scheduled report:', scheduleId);

    // Get schedule details
    const { data: schedule, error: scheduleError } = await supabase
      .from('report_schedules')
      .select('*, reports(*)')
      .eq('id', scheduleId)
      .eq('is_active', true)
      .single();

    if (scheduleError || !schedule) {
      throw new Error('Schedule not found or inactive');
    }

    // Execute the report
    const executeResponse = await supabase.functions.invoke('execute-report', {
      body: {
        reportId: schedule.report_id,
        parameters: schedule.schedule_config.parameters || {},
      },
    });

    if (executeResponse.error) {
      throw new Error(`Report execution failed: ${executeResponse.error.message}`);
    }

    const executionData = executeResponse.data;

    // Generate file attachment if needed
    let attachment = null;
    if (schedule.format !== 'inline') {
      const exportResponse = await supabase.functions.invoke('export-report', {
        body: {
          executionId: executionData.execution_id,
          format: schedule.format,
        },
      });

      if (!exportResponse.error) {
        attachment = {
          filename: `${schedule.reports.name}_${new Date().toISOString().split('T')[0]}.${schedule.format}`,
          content: exportResponse.data,
        };
      }
    }

    // Send email to recipients
    const emailPromises = schedule.recipients.map(async (recipient: string) => {
      const emailContent = generateEmailContent(schedule, executionData);
      
      const emailData: any = {
        from: "PRMCMS Reports <reports@prmcms.com>",
        to: [recipient],
        subject: `${schedule.reports.name} - ${new Date().toLocaleDateString()}`,
        html: emailContent,
      };

      if (attachment) {
        emailData.attachments = [attachment];
      }

      return resend.emails.send(emailData);
    });

    const emailResults = await Promise.allSettled(emailPromises);
    
    // Update schedule's last run time
    await supabase
      .from('report_schedules')
      .update({
        last_run_at: new Date().toISOString(),
        next_run_at: calculateNextRun(schedule.schedule_type, schedule.schedule_config),
      })
      .eq('id', scheduleId);

    // Log results
    const successCount = emailResults.filter(result => result.status === 'fulfilled').length;
    const failureCount = emailResults.filter(result => result.status === 'rejected').length;

    console.log(`Report sent successfully to ${successCount} recipients, ${failureCount} failures`);

    return new Response(JSON.stringify({
      success: true,
      emails_sent: successCount,
      emails_failed: failureCount,
      execution_id: executionData.execution_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending scheduled report:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateEmailContent(schedule: unknown, executionData: unknown): string {
  const reportName = schedule.reports.name;
  const runDate = new Date().toLocaleDateString();
  const recordCount = executionData.row_count || 0;
  const executionTime = executionData.execution_time_ms || 0;

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #0B5394; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .stats { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PRMCMS Report: ${reportName}</h1>
        </div>
        
        <div class="content">
          <p>Your scheduled report has been generated successfully.</p>
          
          <div class="stats">
            <h3>Report Summary</h3>
            <ul>
              <li><strong>Report Name:</strong> ${reportName}</li>
              <li><strong>Run Date:</strong> ${runDate}</li>
              <li><strong>Records Found:</strong> ${recordCount}</li>
              <li><strong>Execution Time:</strong> ${executionTime}ms</li>
              <li><strong>Format:</strong> ${schedule.format.toUpperCase()}</li>
            </ul>
          </div>
          
          ${schedule.format === 'inline' ? generateInlineDataTable(executionData.data) : '<p>Please find the report attached to this email.</p>'}
          
          <p>If you have any questions about this report, please contact your system administrator.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email from PRMCMS. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `;
}

function generateInlineDataTable(data: Record<string, unknown>[]): string {
  if (!data || data.length === 0) {
    return '<p>No data found for this report.</p>';
  }

  const headers = Object.keys(data[0]);
  const maxRows = 50; // Limit inline display
  const displayData = data.slice(0, maxRows);
  
  const tableRows = displayData.map(row => `
    <tr>
      ${headers.map(header => `<td>${row[header] ?? ''}</td>`).join('')}
    </tr>
  `).join('');

  const truncationNotice = data.length > maxRows ? 
    `<p><em>Note: Showing first ${maxRows} of ${data.length} records.</em></p>` : '';

  return `
    ${truncationNotice}
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <thead>
        <tr style="background-color: #f8f9fa;">
          ${headers.map(header => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
}

function calculateNextRun(scheduleType: string, config: unknown): string {
  const now = new Date();
  
  switch (scheduleType) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      now.setMonth(now.getMonth() + 3);
      break;
    default:
      return null;
  }
  
  return now.toISOString();
}