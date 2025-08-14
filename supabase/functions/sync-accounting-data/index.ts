import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { operation = 'export', integration_id, date_range } = await req.json();

    console.log('Processing accounting sync:', { operation, integration_id });

    // Get integration details
    const { data: integration, error: integrationError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('service_type', 'accounting')
      .single();

    if (integrationError) {
      throw new Error(`Failed to fetch integration: ${integrationError.message}`);
    }

    let result;
    const startTime = Date.now();

    switch (operation) {
      case 'export':
        result = await exportAccountingData(integration, date_range, supabaseClient);
        break;
      case 'import':
        result = await importAccountingData(integration, supabaseClient);
        break;
      case 'sync_customers':
        result = await syncCustomers(integration, supabaseClient);
        break;
      case 'sync_invoices':
        result = await syncInvoices(integration, date_range, supabaseClient);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    const executionTime = Date.now() - startTime;

    // Log the sync operation
    await supabaseClient
      .from('integration_logs')
      .insert({
        integration_id: integration.id,
        request_type: 'sync',
        endpoint: operation,
        status_code: result.success ? 200 : 500,
        response_data: result,
        execution_time_ms: executionTime,
        error_message: result.success ? null : result.message
      });

    // Update integration sync status
    await supabaseClient
      .from('integrations')
      .update({
        last_sync_at: new Date().toISOString(),
        last_error: result.success ? null : result.message
      })
      .eq('id', integration.id);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in accounting sync:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function exportAccountingData(integration: unknown, dateRange: unknown, supabaseClient: unknown) {
  const { service_name, credentials } = integration;
  
  try {
    // Get data to export based on date range
    const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = dateRange?.end || new Date().toISOString();

    // Get invoices to export
    const { data: invoices, error: invoicesError } = await supabaseClient
      .from('invoices')
      .select(`
        *,
        customers(*),
        invoice_items(*)
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .eq('status', 'paid')
      .is('external_id', null); // Only export invoices not already synced

    if (invoicesError) {
      throw new Error(`Failed to fetch invoices: ${invoicesError.message}`);
    }

    if (!invoices || invoices.length === 0) {
      return {
        success: true,
        message: 'No new invoices to export',
        recordsProcessed: 0
      };
    }

    let exportedCount = 0;
    const errors = [];

    for (const invoice of invoices) {
      try {
        let exportResult;
        
        switch (service_name) {
          case 'quickbooks':
            exportResult = await exportToQuickBooks(invoice, credentials);
            break;
          case 'xero':
            exportResult = await exportToXero(invoice, credentials);
            break;
          default:
            throw new Error(`Unsupported accounting service: ${service_name}`);
        }

        if (exportResult.success) {
          // Update invoice with external ID
          await supabaseClient
            .from('invoices')
            .update({
              external_id: exportResult.externalId,
              synced_at: new Date().toISOString()
            })
            .eq('id', invoice.id);
          
          exportedCount++;
        } else {
          errors.push(`Invoice ${invoice.invoice_number}: ${exportResult.error}`);
        }
      } catch (error) {
        errors.push(`Invoice ${invoice.invoice_number}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      message: `Exported ${exportedCount} invoices`,
      recordsProcessed: invoices.length,
      exported: exportedCount,
      errors
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      recordsProcessed: 0
    };
  }
}

async function importAccountingData(integration: unknown, supabaseClient: unknown) {
  const { service_name, credentials } = integration;
  
  try {
    let importResult;
    
    switch (service_name) {
      case 'quickbooks':
        importResult = await importFromQuickBooks(credentials, supabaseClient);
        break;
      case 'xero':
        importResult = await importFromXero(credentials, supabaseClient);
        break;
      default:
        throw new Error(`Unsupported accounting service: ${service_name}`);
    }

    return importResult;

  } catch (error) {
    return {
      success: false,
      message: error.message,
      recordsProcessed: 0
    };
  }
}

async function syncCustomers(integration: unknown, supabaseClient: unknown) {
  const { service_name, credentials } = integration;
  
  try {
    // Get local customers to sync
    const { data: customers, error: customersError } = await supabaseClient
      .from('customers')
      .select('*')
      .is('external_id', null)
      .limit(50); // Process in batches

    if (customersError) {
      throw new Error(`Failed to fetch customers: ${customersError.message}`);
    }

    if (!customers || customers.length === 0) {
      return {
        success: true,
        message: 'No new customers to sync',
        recordsProcessed: 0
      };
    }

    let syncedCount = 0;
    const errors = [];

    for (const customer of customers) {
      try {
        let syncResult;
        
        switch (service_name) {
          case 'quickbooks':
            syncResult = await syncCustomerToQuickBooks(customer, credentials);
            break;
          case 'xero':
            syncResult = await syncCustomerToXero(customer, credentials);
            break;
          default:
            continue;
        }

        if (syncResult.success) {
          await supabaseClient
            .from('customers')
            .update({
              external_id: syncResult.externalId,
              synced_at: new Date().toISOString()
            })
            .eq('id', customer.id);
          
          syncedCount++;
        } else {
          errors.push(`Customer ${customer.email}: ${syncResult.error}`);
        }
      } catch (error) {
        errors.push(`Customer ${customer.email}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      message: `Synced ${syncedCount} customers`,
      recordsProcessed: customers.length,
      synced: syncedCount,
      errors
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      recordsProcessed: 0
    };
  }
}

async function syncInvoices(integration: unknown, dateRange: unknown, supabaseClient: unknown) {
  // Similar to exportAccountingData but specifically for invoice sync
  return await exportAccountingData(integration, dateRange, supabaseClient);
}

// QuickBooks integration functions
async function exportToQuickBooks(invoice: unknown, credentials: unknown) {
  try {
    // Ensure customer exists in QuickBooks first
    let customerId = invoice.customers?.external_id;
    
    if (!customerId) {
      const customerResult = await syncCustomerToQuickBooks(invoice.customers, credentials);
      if (!customerResult.success) {
        return { success: false, error: `Failed to sync customer: ${customerResult.error}` };
      }
      customerId = customerResult.externalId;
    }

    // Create QuickBooks invoice
    const qbInvoice = {
      Line: invoice.invoice_items?.map((item: unknown) => ({
        Amount: item.line_total,
        DetailType: "SalesItemLineDetail",
        SalesItemLineDetail: {
          ItemRef: { value: "1", name: item.description },
          UnitPrice: item.unit_price,
          Qty: item.quantity
        }
      })) || [],
      CustomerRef: { value: customerId },
      TxnDate: invoice.issue_date,
      DueDate: invoice.due_date,
      DocNumber: invoice.invoice_number
    };

    const response = await fetch(`https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.company_id}/invoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qbInvoice)
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        externalId: data.QueryResponse?.Invoice?.[0]?.Id || data.Invoice?.Id 
      };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function syncCustomerToQuickBooks(customer: unknown, credentials: unknown) {
  try {
    const qbCustomer = {
      Name: `${customer.first_name} ${customer.last_name}`,
      CompanyName: customer.business_name || '',
      BillAddr: {
        Line1: customer.address_line1,
        Line2: customer.address_line2 || '',
        City: customer.city,
        CountrySubDivisionCode: customer.state,
        PostalCode: customer.zip_code,
        Country: customer.country
      },
      PrimaryEmailAddr: {
        Address: customer.email
      },
      PrimaryPhone: {
        FreeFormNumber: customer.phone || ''
      }
    };

    const response = await fetch(`https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.company_id}/customer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qbCustomer)
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        externalId: data.QueryResponse?.Customer?.[0]?.Id || data.Customer?.Id 
      };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function importFromQuickBooks(credentials: unknown, supabaseClient: unknown) {
  try {
    // Import customers from QuickBooks
    const customersResponse = await fetch(`https://sandbox-quickbooks.api.intuit.com/v3/company/${credentials.company_id}/query?query=SELECT * FROM Customer`, {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Accept': 'application/json'
      }
    });

    if (!customersResponse.ok) {
      throw new Error('Failed to fetch customers from QuickBooks');
    }

    const customersData = await customersResponse.json();
    const qbCustomers = customersData.QueryResponse?.Customer || [];

    let importedCount = 0;
    const errors = [];

    for (const qbCustomer of qbCustomers) {
      try {
        // Check if customer already exists
        const { data: existingCustomer } = await supabaseClient
          .from('customers')
          .select('id')
          .eq('external_id', qbCustomer.Id)
          .single();

        if (existingCustomer) {
          continue; // Skip existing customers
        }

        // Import new customer
        const { error } = await supabaseClient
          .from('customers')
          .insert({
            external_id: qbCustomer.Id,
            first_name: qbCustomer.GivenName || '',
            last_name: qbCustomer.FamilyName || '',
            business_name: qbCustomer.CompanyName || '',
            email: qbCustomer.PrimaryEmailAddr?.Address || '',
            phone: qbCustomer.PrimaryPhone?.FreeFormNumber || '',
            address_line1: qbCustomer.BillAddr?.Line1 || '',
            address_line2: qbCustomer.BillAddr?.Line2 || '',
            city: qbCustomer.BillAddr?.City || '',
            state: qbCustomer.BillAddr?.CountrySubDivisionCode || 'PR',
            zip_code: qbCustomer.BillAddr?.PostalCode || '',
            country: qbCustomer.BillAddr?.Country || 'US',
            mailbox_number: `QB-${qbCustomer.Id}`, // Temporary mailbox number
            synced_at: new Date().toISOString()
          });

        if (error) {
          errors.push(`Failed to import customer ${qbCustomer.Name}: ${error.message}`);
        } else {
          importedCount++;
        }
      } catch (error) {
        errors.push(`Error processing customer ${qbCustomer.Name}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      message: `Imported ${importedCount} customers from QuickBooks`,
      recordsProcessed: qbCustomers.length,
      imported: importedCount,
      errors
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      recordsProcessed: 0
    };
  }
}

// Xero integration functions
async function exportToXero(invoice: unknown, credentials: unknown) {
  try {
    // Ensure customer exists in Xero first
    let contactId = invoice.customers?.external_id;
    
    if (!contactId) {
      const contactResult = await syncCustomerToXero(invoice.customers, credentials);
      if (!contactResult.success) {
        return { success: false, error: `Failed to sync contact: ${contactResult.error}` };
      }
      contactId = contactResult.externalId;
    }

    // Create Xero invoice
    const xeroInvoice = {
      Type: "ACCREC",
      Contact: { ContactID: contactId },
      Date: invoice.issue_date,
      DueDate: invoice.due_date,
      InvoiceNumber: invoice.invoice_number,
      LineItems: invoice.invoice_items?.map((item: unknown) => ({
        Description: item.description,
        Quantity: item.quantity,
        UnitAmount: item.unit_price,
        AccountCode: "200", // Default sales account
        TaxType: "NONE"
      })) || []
    };

    const response = await fetch('https://api.xero.com/api.xro/2.0/Invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
        'Xero-Tenant-Id': credentials.tenant_id
      },
      body: JSON.stringify({ Invoices: [xeroInvoice] })
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        externalId: data.Invoices?.[0]?.InvoiceID 
      };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function syncCustomerToXero(customer: unknown, credentials: unknown) {
  try {
    const xeroContact = {
      Name: customer.business_name || `${customer.first_name} ${customer.last_name}`,
      FirstName: customer.first_name,
      LastName: customer.last_name,
      EmailAddress: customer.email,
      Addresses: [{
        AddressType: "STREET",
        AddressLine1: customer.address_line1,
        AddressLine2: customer.address_line2 || '',
        City: customer.city,
        Region: customer.state,
        PostalCode: customer.zip_code,
        Country: customer.country
      }],
      Phones: customer.phone ? [{
        PhoneType: "DEFAULT",
        PhoneNumber: customer.phone
      }] : []
    };

    const response = await fetch('https://api.xero.com/api.xro/2.0/Contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
        'Xero-Tenant-Id': credentials.tenant_id
      },
      body: JSON.stringify({ Contacts: [xeroContact] })
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        externalId: data.Contacts?.[0]?.ContactID 
      };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function importFromXero(credentials: unknown, supabaseClient: unknown) {
  try {
    // Import contacts from Xero
    const contactsResponse = await fetch('https://api.xero.com/api.xro/2.0/Contacts', {
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Xero-Tenant-Id': credentials.tenant_id
      }
    });

    if (!contactsResponse.ok) {
      throw new Error('Failed to fetch contacts from Xero');
    }

    const contactsData = await contactsResponse.json();
    const xeroContacts = contactsData.Contacts || [];

    let importedCount = 0;
    const errors = [];

    for (const xeroContact of xeroContacts) {
      try {
        // Check if contact already exists
        const { data: existingCustomer } = await supabaseClient
          .from('customers')
          .select('id')
          .eq('external_id', xeroContact.ContactID)
          .single();

        if (existingCustomer) {
          continue; // Skip existing contacts
        }

        // Import new contact
        const streetAddress = xeroContact.Addresses?.find((addr: unknown) => addr.AddressType === 'STREET');
        const defaultPhone = xeroContact.Phones?.find((phone: unknown) => phone.PhoneType === 'DEFAULT');

        const { error } = await supabaseClient
          .from('customers')
          .insert({
            external_id: xeroContact.ContactID,
            first_name: xeroContact.FirstName || '',
            last_name: xeroContact.LastName || '',
            business_name: xeroContact.Name || '',
            email: xeroContact.EmailAddress || '',
            phone: defaultPhone?.PhoneNumber || '',
            address_line1: streetAddress?.AddressLine1 || '',
            address_line2: streetAddress?.AddressLine2 || '',
            city: streetAddress?.City || '',
            state: streetAddress?.Region || 'PR',
            zip_code: streetAddress?.PostalCode || '',
            country: streetAddress?.Country || 'US',
            mailbox_number: `XR-${xeroContact.ContactID?.substring(0, 8)}`,
            synced_at: new Date().toISOString()
          });

        if (error) {
          errors.push(`Failed to import contact ${xeroContact.Name}: ${error.message}`);
        } else {
          importedCount++;
        }
      } catch (error) {
        errors.push(`Error processing contact ${xeroContact.Name}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      message: `Imported ${importedCount} contacts from Xero`,
      recordsProcessed: xeroContacts.length,
      imported: importedCount,
      errors
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
      recordsProcessed: 0
    };
  }
}