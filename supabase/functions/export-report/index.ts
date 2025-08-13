import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Sentry } from "../_shared/sentry.ts"; // 2025-08-13: error tracking

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExportRequest {
  executionId: string;
  format: 'csv' | 'excel' | 'pdf';
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

    const { executionId, format }: ExportRequest = await req.json();
    
    console.log('Exporting report execution:', executionId, 'as:', format);

    // Get execution data
    const { data: execution, error: executionError } = await supabase
      .from('report_executions')
      .select('*, reports(name)')
      .eq('id', executionId)
      .single();

    if (executionError || !execution) {
      throw new Error('Execution not found');
    }

    const { result_data } = execution;
    if (!result_data || !Array.isArray(result_data)) {
      throw new Error('No data available for export');
    }

    let fileContent: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'csv':
        fileContent = convertToCSV(result_data);
        contentType = 'text/csv';
        filename = `${execution.reports.name}_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'excel':
        fileContent = convertToExcel(result_data);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `${execution.reports.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
        break;
      case 'pdf':
        fileContent = await convertToPDF(result_data, execution.reports.name);
        contentType = 'application/pdf';
        filename = `${execution.reports.name}_${new Date().toISOString().split('T')[0]}.pdf`;
        break;
      default:
        throw new Error('Unsupported export format');
    }

    return new Response(fileContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    Sentry.captureException(error);
    console.error('Error exporting report:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

function convertToExcel(data: any[]): string {
  // For simplicity, return CSV format with Excel MIME type
  // In production, you'd use a proper Excel library
  return convertToCSV(data);
}

async function convertToPDF(data: any[], reportName: string): Promise<string> {
  // Simple HTML to PDF conversion
  // In production, you'd use a proper PDF library like Puppeteer
  const html = generateHTMLReport(data, reportName);
  
  // For now, return HTML content
  // In production, convert HTML to PDF
  return html;
}

function generateHTMLReport(data: any[], reportName: string): string {
  if (data.length === 0) {
    return `
      <html>
        <head><title>${reportName}</title></head>
        <body>
          <h1>${reportName}</h1>
          <p>No data available</p>
        </body>
      </html>
    `;
  }

  const headers = Object.keys(data[0]);
  
  const tableRows = data.map(row => `
    <tr>
      ${headers.map(header => `<td>${row[header] ?? ''}</td>`).join('')}
    </tr>
  `).join('');

  return `
    <html>
      <head>
        <title>${reportName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>${reportName}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}