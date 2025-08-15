/**
 * Demo Data Service
 * Story 10: Growth Infrastructure - Demo Data System
 * 
 * Creates realistic demo data for trials and demonstrations,
 * including customers, packages, communications, and analytics
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// DEMO DATA TYPES
// =====================================================

export interface DemoDataSet {
  id: string;
  name: string;
  description: string;
  category: 'trial' | 'demo' | 'training' | 'testing';
  data_types: string[];
  record_counts: Record<string, number>;
  created_at: string;
}

export interface DemoCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  customer_type: 'individual' | 'business';
  status: 'active' | 'inactive';
  notes?: string;
}

export interface DemoPackage {
  description: string;
  weight: number;
  value: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  tracking_number: string;
  sender_name: string;
  sender_address: string;
  special_instructions?: string;
}

// =====================================================
// DEMO DATA TEMPLATES
// =====================================================

const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '+1 (787) 555-0123',
    address: '123 Calle Principal',
    city: 'San Juan',
    state: 'PR',
    zip_code: '00901',
    customer_type: 'individual',
    status: 'active',
    notes: 'Prefers SMS notifications'
  },
  {
    name: 'Carlos Mendez',
    email: 'carlos.mendez@business.com',
    phone: '+1 (787) 555-0456',
    address: '456 Avenida Central',
    city: 'Bayamón',
    state: 'PR',
    zip_code: '00959',
    customer_type: 'business',
    status: 'active',
    notes: 'Business owner - electronics store'
  },
  {
    name: 'Ana Delgado',
    email: 'ana.delgado@gmail.com',
    phone: '+1 (787) 555-0789',
    address: '789 Calle Secundaria',
    city: 'Ponce',
    state: 'PR',
    zip_code: '00717',
    customer_type: 'individual',
    status: 'active'
  },
  {
    name: 'Roberto Silva',
    email: 'roberto.silva@company.com',
    phone: '+1 (787) 555-0321',
    address: '321 Boulevard Norte',
    city: 'Caguas',
    state: 'PR',
    zip_code: '00725',
    customer_type: 'business',
    status: 'active',
    notes: 'Frequent international packages'
  },
  {
    name: 'Carmen Torres',
    email: 'carmen.torres@email.com',
    phone: '+1 (787) 555-0654',
    address: '654 Calle Sur',
    city: 'Arecibo',
    state: 'PR',
    zip_code: '00612',
    customer_type: 'individual',
    status: 'inactive',
    notes: 'Moved to mainland US'
  }
];

const DEMO_PACKAGES: DemoPackage[] = [
  {
    description: 'Electronics - Smartphone',
    weight: 1.2,
    value: 899.99,
    status: 'delivered',
    tracking_number: 'PKG001234567',
    sender_name: 'TechStore Miami',
    sender_address: '123 Tech Ave, Miami, FL 33101'
  },
  {
    description: 'Clothing - Designer Dress',
    weight: 0.8,
    value: 299.99,
    status: 'in_transit',
    tracking_number: 'PKG001234568',
    sender_name: 'Fashion Boutique',
    sender_address: '456 Fashion St, New York, NY 10001',
    special_instructions: 'Handle with care - delicate fabric'
  },
  {
    description: 'Books - Educational Materials',
    weight: 3.5,
    value: 150.00,
    status: 'pending',
    tracking_number: 'PKG001234569',
    sender_name: 'Academic Press',
    sender_address: '789 University Blvd, Boston, MA 02101'
  },
  {
    description: 'Medical Supplies',
    weight: 2.1,
    value: 450.00,
    status: 'delivered',
    tracking_number: 'PKG001234570',
    sender_name: 'MedSupply Corp',
    sender_address: '321 Medical Dr, Houston, TX 77001',
    special_instructions: 'Temperature sensitive - keep cool'
  },
  {
    description: 'Auto Parts - Brake Pads',
    weight: 5.2,
    value: 125.99,
    status: 'returned',
    tracking_number: 'PKG001234571',
    sender_name: 'AutoParts Direct',
    sender_address: '654 Industrial Way, Detroit, MI 48201',
    special_instructions: 'Wrong part number - return to sender'
  }
];

// =====================================================
// DEMO DATA SERVICE
// =====================================================

export class DemoDataService {

  /**
   * Create complete demo data set for subscription
   */
  static async createDemoDataSet(
    subscriptionId: string,
    dataSetType: 'trial' | 'demo' | 'training' | 'testing' = 'demo'
  ): Promise<DemoDataSet | null> {
    try {
      console.log(`Creating demo data set for subscription ${subscriptionId}`);

      // Create demo data set record
      const demoDataSet: DemoDataSet = {
        id: `demo_${Date.now()}`,
        name: `${dataSetType.charAt(0).toUpperCase() + dataSetType.slice(1)} Data Set`,
        description: `Realistic ${dataSetType} data for PRMCMS demonstration`,
        category: dataSetType,
        data_types: ['customers', 'packages', 'communications', 'analytics'],
        record_counts: {
          customers: DEMO_CUSTOMERS.length,
          packages: DEMO_PACKAGES.length,
          communications: 15,
          analytics_events: 50
        },
        created_at: new Date().toISOString()
      };

      // Create demo customers
      const customerIds = await this.createDemoCustomers(subscriptionId);
      
      // Create demo packages
      const packageIds = await this.createDemoPackages(subscriptionId, customerIds);
      
      // Create demo communications
      await this.createDemoCommunications(subscriptionId, customerIds);
      
      // Create demo analytics events
      await this.createDemoAnalytics(subscriptionId, customerIds, packageIds);

      // Record demo data set
      const { error } = await supabase
        .from('demo_data_sets')
        .insert({
          ...demoDataSet,
          subscription_id: subscriptionId
        });

      if (error) throw error;

      console.log('Demo data set created successfully');
      return demoDataSet;
    } catch (error) {
      console.error('Error creating demo data set:', error);
      return null;
    }
  }

  /**
   * Create demo customers
   */
  static async createDemoCustomers(subscriptionId: string): Promise<string[]> {
    try {
      const customerIds: string[] = [];

      for (const demoCustomer of DEMO_CUSTOMERS) {
        const { data, error } = await supabase
          .from('customers')
          .insert({
            subscription_id: subscriptionId,
            name: demoCustomer.name,
            email: demoCustomer.email,
            phone: demoCustomer.phone,
            address: demoCustomer.address,
            city: demoCustomer.city,
            state: demoCustomer.state,
            zip_code: demoCustomer.zip_code,
            customer_type: demoCustomer.customer_type,
            status: demoCustomer.status,
            notes: demoCustomer.notes,
            is_demo_data: true,
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) customerIds.push(data.id);
      }

      return customerIds;
    } catch (error) {
      console.error('Error creating demo customers:', error);
      return [];
    }
  }

  /**
   * Create demo packages
   */
  static async createDemoPackages(
    subscriptionId: string,
    customerIds: string[]
  ): Promise<string[]> {
    try {
      const packageIds: string[] = [];

      for (let i = 0; i < DEMO_PACKAGES.length; i++) {
        const demoPackage = DEMO_PACKAGES[i];
        const customerId = customerIds[i % customerIds.length]; // Distribute packages among customers

        // Calculate dates based on status
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

        let arrivedDate = null;
        let deliveredDate = null;

        if (demoPackage.status === 'delivered') {
          arrivedDate = new Date(createdDate);
          arrivedDate.setDate(arrivedDate.getDate() + Math.floor(Math.random() * 5) + 1);
          deliveredDate = new Date(arrivedDate);
          deliveredDate.setDate(deliveredDate.getDate() + Math.floor(Math.random() * 3) + 1);
        } else if (demoPackage.status === 'in_transit') {
          arrivedDate = new Date(createdDate);
          arrivedDate.setDate(arrivedDate.getDate() + Math.floor(Math.random() * 5) + 1);
        }

        const { data, error } = await supabase
          .from('packages')
          .insert({
            subscription_id: subscriptionId,
            customer_id: customerId,
            description: demoPackage.description,
            weight: demoPackage.weight,
            value: demoPackage.value,
            status: demoPackage.status,
            tracking_number: demoPackage.tracking_number,
            sender_name: demoPackage.sender_name,
            sender_address: demoPackage.sender_address,
            special_instructions: demoPackage.special_instructions,
            arrived_date: arrivedDate?.toISOString(),
            delivered_date: deliveredDate?.toISOString(),
            is_demo_data: true,
            created_at: createdDate.toISOString()
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) packageIds.push(data.id);
      }

      return packageIds;
    } catch (error) {
      console.error('Error creating demo packages:', error);
      return [];
    }
  }

  /**
   * Create demo communications
   */
  static async createDemoCommunications(
    subscriptionId: string,
    customerIds: string[]
  ): Promise<void> {
    try {
      const communicationTemplates = [
        {
          type: 'email',
          subject: 'Package Arrival Notification',
          content: 'Your package has arrived and is ready for pickup.',
          status: 'sent'
        },
        {
          type: 'sms',
          subject: 'Package Delivered',
          content: 'Your package has been delivered successfully.',
          status: 'delivered'
        },
        {
          type: 'email',
          subject: 'Welcome to PRMCMS',
          content: 'Welcome! We\'re excited to help you manage your packages.',
          status: 'sent'
        }
      ];

      for (let i = 0; i < 15; i++) {
        const template = communicationTemplates[i % communicationTemplates.length];
        const customerId = customerIds[i % customerIds.length];
        
        const sentDate = new Date();
        sentDate.setDate(sentDate.getDate() - Math.floor(Math.random() * 14)); // Random date in last 2 weeks

        await supabase
          .from('communications')
          .insert({
            subscription_id: subscriptionId,
            customer_id: customerId,
            type: template.type,
            subject: template.subject,
            content: template.content,
            status: template.status,
            sent_at: sentDate.toISOString(),
            is_demo_data: true,
            created_at: sentDate.toISOString()
          });
      }
    } catch (error) {
      console.error('Error creating demo communications:', error);
    }
  }

  /**
   * Create demo analytics events
   */
  static async createDemoAnalytics(
    subscriptionId: string,
    customerIds: string[],
    packageIds: string[]
  ): Promise<void> {
    try {
      const eventTypes = [
        'package_created',
        'package_delivered',
        'customer_registered',
        'communication_sent',
        'login',
        'dashboard_viewed',
        'report_generated'
      ];

      for (let i = 0; i < 50; i++) {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() - Math.floor(Math.random() * 30));

        const eventData: any = {
          event_type: eventType,
          timestamp: eventDate.toISOString()
        };

        // Add relevant IDs based on event type
        if (eventType.includes('package') && packageIds.length > 0) {
          eventData.package_id = packageIds[Math.floor(Math.random() * packageIds.length)];
        }
        if (eventType.includes('customer') && customerIds.length > 0) {
          eventData.customer_id = customerIds[Math.floor(Math.random() * customerIds.length)];
        }

        await supabase
          .from('analytics_events')
          .insert({
            subscription_id: subscriptionId,
            event_type: eventType,
            event_data: eventData,
            is_demo_data: true,
            created_at: eventDate.toISOString()
          });
      }
    } catch (error) {
      console.error('Error creating demo analytics:', error);
    }
  }

  /**
   * Clear demo data for subscription
   */
  static async clearDemoData(subscriptionId: string): Promise<boolean> {
    try {
      console.log(`Clearing demo data for subscription ${subscriptionId}`);

      // Delete in reverse dependency order
      await supabase
        .from('analytics_events')
        .delete()
        .eq('subscription_id', subscriptionId)
        .eq('is_demo_data', true);

      await supabase
        .from('communications')
        .delete()
        .eq('subscription_id', subscriptionId)
        .eq('is_demo_data', true);

      await supabase
        .from('packages')
        .delete()
        .eq('subscription_id', subscriptionId)
        .eq('is_demo_data', true);

      await supabase
        .from('customers')
        .delete()
        .eq('subscription_id', subscriptionId)
        .eq('is_demo_data', true);

      await supabase
        .from('demo_data_sets')
        .delete()
        .eq('subscription_id', subscriptionId);

      console.log('Demo data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing demo data:', error);
      return false;
    }
  }

  /**
   * Get demo data statistics
   */
  static async getDemoDataStats(subscriptionId: string): Promise<any> {
    try {
      const [customers, packages, communications, analytics] = await Promise.all([
        supabase
          .from('customers')
          .select('id')
          .eq('subscription_id', subscriptionId)
          .eq('is_demo_data', true),
        
        supabase
          .from('packages')
          .select('id')
          .eq('subscription_id', subscriptionId)
          .eq('is_demo_data', true),
        
        supabase
          .from('communications')
          .select('id')
          .eq('subscription_id', subscriptionId)
          .eq('is_demo_data', true),
        
        supabase
          .from('analytics_events')
          .select('id')
          .eq('subscription_id', subscriptionId)
          .eq('is_demo_data', true)
      ]);

      return {
        customers: customers.data?.length || 0,
        packages: packages.data?.length || 0,
        communications: communications.data?.length || 0,
        analytics_events: analytics.data?.length || 0,
        has_demo_data: (customers.data?.length || 0) > 0
      };
    } catch (error) {
      console.error('Error getting demo data stats:', error);
      return {
        customers: 0,
        packages: 0,
        communications: 0,
        analytics_events: 0,
        has_demo_data: false
      };
    }
  }

  /**
   * Create trial-specific demo data
   */
  static async createTrialData(subscriptionId: string): Promise<boolean> {
    try {
      // Create a smaller, focused demo data set for trials
      const trialCustomers = DEMO_CUSTOMERS.slice(0, 3);
      const trialPackages = DEMO_PACKAGES.slice(0, 3);

      // Create customers
      const customerIds: string[] = [];
      for (const customer of trialCustomers) {
        const { data, error } = await supabase
          .from('customers')
          .insert({
            subscription_id: subscriptionId,
            ...customer,
            is_demo_data: true,
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) customerIds.push(data.id);
      }

      // Create packages
      for (let i = 0; i < trialPackages.length; i++) {
        const package_ = trialPackages[i];
        const customerId = customerIds[i];

        await supabase
          .from('packages')
          .insert({
            subscription_id: subscriptionId,
            customer_id: customerId,
            ...package_,
            is_demo_data: true,
            created_at: new Date().toISOString()
          });
      }

      return true;
    } catch (error) {
      console.error('Error creating trial data:', error);
      return false;
    }
  }
}
