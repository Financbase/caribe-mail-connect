import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Integration Tests for PRMCMS User Workflows
describe('PRMCMS Integration Tests - User Workflows', () => {
  let supabase: any;
  let testUserId: string;
  let testCustomerId: string;
  let testPackageId: string;

  beforeAll(async () => {
    // Initialize Supabase client with production configuration
    const supabaseUrl = 'https://affejwamvzsmtvohasgh.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZmVqd2FtdnpzbXR2b2hhc2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzI0NjIsImV4cCI6MjA2OTUwODQ2Mn0.4bilcSzmEhToOEzL1zCa5Gse84FcVtLKR_E6o8J2MGA';

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  });

  afterAll(async () => {
    // Cleanup test data
    if (testPackageId) {
      await supabase.from('packages').delete().eq('id', testPackageId);
    }
    if (testCustomerId) {
      await supabase.from('customers').delete().eq('id', testCustomerId);
    }
  });

  describe('1. User Authentication Workflow', () => {
    it('should allow user registration', async () => {
      const testUser = {
        email: `test-${Date.now()}@prmcms.com`,
        password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567890'
      };

      const { data, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            first_name: testUser.first_name,
            last_name: testUser.last_name,
            phone: testUser.phone
          }
        }
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(testUser.email);
      
      testUserId = data.user.id;
    });

    it('should allow user login', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: process.env.TEST_USER_EMAIL || 'test@prmcms.com',
        password: process.env.TEST_USER_PASSWORD || 'TestPassword123!'
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.session).toBeDefined();
    });

    it('should handle password reset', async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail('test@prmcms.com', {
        redirectTo: 'https://prmcms.com/reset-password'
      });

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('2. Customer Management Workflow', () => {
    it('should create a new customer', async () => {
      const customerData = {
        user_id: testUserId,
        email: 'customer@prmcms.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
        customer_type: 'individual',
        status: 'active'
      };

      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.email).toBe(customerData.email);
      
      testCustomerId = data.id;
    });

    it('should retrieve customer information', async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', testCustomerId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.email).toBe('customer@prmcms.com');
    });

    it('should update customer information', async () => {
      const updateData = {
        phone: '+1987654321',
        address: '456 Oak Ave'
      };

      const { data, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', testCustomerId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.phone).toBe(updateData.phone);
      expect(data.address).toBe(updateData.address);
    });
  });

  describe('3. Package Management Workflow', () => {
    it('should create a new package', async () => {
      const packageData = {
        customer_id: testCustomerId,
        tracking_number: `TRK${Date.now()}`,
        sender_name: 'Sender Name',
        sender_address: 'Sender Address',
        recipient_name: 'Recipient Name',
        recipient_address: 'Recipient Address',
        package_type: 'parcel',
        weight: 2.5,
        dimensions: '10x8x6',
        status: 'received',
        received_date: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('packages')
        .insert(packageData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.tracking_number).toBe(packageData.tracking_number);
      
      testPackageId = data.id;
    });

    it('should track package status', async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', testPackageId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.status).toBe('received');
    });

    it('should update package status', async () => {
      const { data, error } = await supabase
        .from('packages')
        .update({ 
          status: 'in_transit',
          updated_at: new Date().toISOString()
        })
        .eq('id', testPackageId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.status).toBe('in_transit');
    });
  });

  describe('4. Virtual Mail Services Workflow', () => {
    it('should create virtual mailbox', async () => {
      const mailboxData = {
        customer_id: testCustomerId,
        mailbox_number: `MB${Date.now()}`,
        status: 'active',
        plan_type: 'basic',
        monthly_fee: 29.99
      };

      const { data, error } = await supabase
        .from('virtual_mail')
        .insert(mailboxData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.mailbox_number).toBe(mailboxData.mailbox_number);
    });

    it('should handle mail scanning request', async () => {
      const scanRequest = {
        customer_id: testCustomerId,
        request_type: 'scan',
        description: 'Scan all incoming mail',
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('virtual_mail')
        .insert(scanRequest)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.request_type).toBe('scan');
    });
  });

  describe('5. Billing and Payment Workflow', () => {
    it('should create invoice', async () => {
      const invoiceData = {
        customer_id: testCustomerId,
        invoice_number: `INV${Date.now()}`,
        amount: 29.99,
        currency: 'USD',
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Monthly virtual mailbox fee'
      };

      const { data, error } = await supabase
        .from('billing')
        .insert(invoiceData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.invoice_number).toBe(invoiceData.invoice_number);
    });

    it('should process payment', async () => {
      const paymentData = {
        customer_id: testCustomerId,
        amount: 29.99,
        payment_method: 'credit_card',
        status: 'completed',
        transaction_id: `TXN${Date.now()}`
      };

      const { data, error } = await supabase
        .from('billing')
        .insert(paymentData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.status).toBe('completed');
    });
  });

  describe('6. Employee Management Workflow', () => {
    it('should create employee record', async () => {
      const employeeData = {
        user_id: testUserId,
        employee_id: `EMP${Date.now()}`,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@prmcms.com',
        phone: '+1234567890',
        position: 'package_handler',
        department: 'operations',
        hire_date: new Date().toISOString(),
        status: 'active'
      };

      const { data, error } = await supabase
        .from('employees')
        .insert(employeeData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.employee_id).toBe(employeeData.employee_id);
    });

    it('should track employee time', async () => {
      const timeEntry = {
        employee_id: testUserId,
        clock_in: new Date().toISOString(),
        clock_out: null,
        status: 'clocked_in'
      };

      const { data, error } = await supabase
        .from('employees')
        .insert(timeEntry)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.status).toBe('clocked_in');
    });
  });

  describe('7. IoT Device Management Workflow', () => {
    it('should register IoT device', async () => {
      const deviceData = {
        device_id: `DEV${Date.now()}`,
        device_type: 'package_scanner',
        location: 'main_entrance',
        status: 'active',
        last_seen: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('iot_devices')
        .insert(deviceData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.device_id).toBe(deviceData.device_id);
    });

    it('should monitor device health', async () => {
      const { data, error } = await supabase
        .from('iot_devices')
        .select('*')
        .eq('device_type', 'package_scanner')
        .limit(1)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.status).toBe('active');
    });
  });

  describe('8. Reporting and Analytics Workflow', () => {
    it('should generate performance report', async () => {
      const { data, error } = await supabase
        .rpc('get_database_health');

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should access performance metrics', async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should check security status', async () => {
      const { data, error } = await supabase
        .rpc('get_security_status');

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('9. Error Handling and Recovery', () => {
    it('should handle invalid data gracefully', async () => {
      const invalidData = {
        email: 'invalid-email',
        customer_id: 'non-existent-id'
      };

      const { data, error } = await supabase
        .from('customers')
        .insert(invalidData)
        .select();

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });

    it('should handle network errors gracefully', async () => {
      // Test with invalid URL
      const invalidSupabase = createClient('https://invalid-url.supabase.co', 'invalid-key');
      
      const { data, error } = await invalidSupabase
        .from('customers')
        .select('*');

      expect(error).toBeDefined();
    });
  });

  describe('10. Performance and Load Testing', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = Array.from({ length: 10 }, (_, i) => 
        supabase
          .from('customers')
          .select('*')
          .limit(1)
      );

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.error).toBeNull();
        expect(result.data).toBeDefined();
      });
    });

    it('should maintain performance under load', async () => {
      const startTime = Date.now();
      
      await supabase
        .from('packages')
        .select('*')
        .limit(100);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
    });
  });
}); 