import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Test configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'test-key';

const supabase = createClient(supabaseUrl, supabaseKey);

describe('🌾 Rural Features Simple Test Suite', () => {
  let testUserId: string;
  let testLocationId: string;

  beforeAll(async () => {
    console.log('🧪 Setting up rural features test environment...');
    
    // Create test user
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: 'rural-test@example.com',
      password: 'testpassword123'
    });
    
    if (userError) {
      console.log('Test user already exists or error:', userError.message);
      testUserId = 'test-user-id';
    } else {
      testUserId = userData.user?.id || 'test-user-id';
    }

    // Create test location
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .insert({
        name: 'Test Rural Location',
        address: '123 Rural Test Road, San Juan, PR 00901',
        lat: 18.2208,
        lng: -66.5901,
        location_type: 'rural',
        created_by: testUserId
      })
      .select()
      .single();

    if (locationError) {
      console.log('Test location already exists or error:', locationError.message);
      testLocationId = 'test-location-id';
    } else {
      testLocationId = locationData.id;
    }

    console.log('✅ Test environment setup complete');
  });

  afterAll(async () => {
    console.log('🧹 Cleaning up test data...');
    console.log('✅ Test cleanup complete');
  });

  describe('📊 Phase 1: Core Rural Resilience', () => {
    it('should create rural infrastructure monitoring record', async () => {
      const { data, error } = await supabase
        .from('rural_infrastructure')
        .insert({
          location_id: testLocationId,
          power_status: 'normal',
          ups_battery_level: 85,
          generator_fuel_level: 75,
          internet_connectivity: 'primary',
          primary_isp: 'Liberty Puerto Rico',
          backup_isp: 'Claro Puerto Rico',
          satellite_provider: 'Starlink',
          solar_panel_status: 'active',
          solar_battery_level: 90,
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.power_status).toBe('normal');
      expect(data.ups_battery_level).toBe(85);
      expect(data.solar_panel_status).toBe('active');
    });

    it('should create terrain and routing data', async () => {
      const { data, error } = await supabase
        .from('rural_terrain')
        .insert({
          location_lat: 18.2208,
          location_lng: -66.5901,
          elevation: 150,
          road_condition: 'good',
          road_type: 'rural',
          river_crossing: false,
          agricultural_zone: true,
          crop_type: 'coffee',
          weather_sensitivity: 'high',
          flood_risk: 'medium',
          landslide_risk: 'low'
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.elevation).toBe(150);
      expect(data.road_condition).toBe('good');
      expect(data.agricultural_zone).toBe(true);
    });

    it('should create emergency alert', async () => {
      const { data, error } = await supabase
        .from('rural_emergency_alerts')
        .insert({
          alert_type: 'power_outage',
          severity: 'high',
          title: 'Power Outage Alert',
          description: 'Major power outage affecting rural areas',
          location_lat: 18.2208,
          location_lng: -66.5901,
          radius_km: 15,
          is_active: true,
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.alert_type).toBe('power_outage');
      expect(data.severity).toBe('high');
      expect(data.is_active).toBe(true);
    });

    it('should create connectivity provider record', async () => {
      const { data, error } = await supabase
        .from('connectivity_providers')
        .insert({
          name: 'Liberty Puerto Rico',
          provider_type: 'isp',
          contact_person: 'Juan Provider',
          contact_phone: '+1-787-555-0200',
          contact_email: 'support@libertypr.com',
          reliability_score: 85,
          average_downtime_minutes: 120,
          is_active: true
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.name).toBe('Liberty Puerto Rico');
      expect(data.reliability_score).toBe(85);
      expect(data.is_active).toBe(true);
    });

    it('should track offline operations', async () => {
      const { data, error } = await supabase
        .from('offline_operations')
        .insert({
          location_id: testLocationId,
          start_time: new Date().toISOString(),
          reason: 'power_outage',
          operations_affected: ['package_tracking', 'customer_notifications'],
          data_synced: false
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.reason).toBe('power_outage');
      expect(data.data_synced).toBe(false);
    });
  });

  describe('🏘️ Phase 2: Community Features', () => {
    it('should create community pickup point', async () => {
      const { data, error } = await supabase
        .from('community_pickup_points')
        .insert({
          name: 'Centro Comunitario Test',
          type: 'community_center',
          contact_person: 'María Test',
          contact_phone: '+1-787-555-0101',
          address: '123 Test Street, San Juan, PR 00901',
          is_active: true,
          capacity_daily: 50,
          current_occupancy: 12,
          rating: 4.8,
          total_reviews: 45,
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.name).toBe('Centro Comunitario Test');
      expect(data.type).toBe('community_center');
      expect(data.is_active).toBe(true);
    });

    it('should create neighbor delivery network', async () => {
      const { data, error } = await supabase
        .from('neighbor_delivery_network')
        .insert({
          name: 'Juan Pérez',
          vehicle_type: 'car',
          trust_score: 95,
          total_deliveries: 156,
          successful_deliveries: 154,
          average_rating: 4.9,
          is_active: true,
          background_check_status: 'passed',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.name).toBe('Juan Pérez');
      expect(data.trust_score).toBe(95);
      expect(data.background_check_status).toBe('passed');
    });

    it('should create family business member', async () => {
      const { data, error } = await supabase
        .from('family_business_members')
        .insert({
          name: 'Roberto González',
          relationship: 'owner',
          role: 'Business Owner',
          access_level: process.env.TEST_USER || 'admin',
          decision_making_authority: true,
          training_completed: true,
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.name).toBe('Roberto González');
      expect(data.relationship).toBe('owner');
      expect(data.access_level).toBe('admin');
    });

    it('should create local reputation record', async () => {
      const { data, error } = await supabase
        .from('local_reputation_system')
        .insert({
          entity_type: 'business',
          entity_id: testLocationId,
          overall_rating: 4.8,
          total_reviews: 156,
          trust_score: 89,
          community_contributions: 12,
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.overall_rating).toBe(4.8);
      expect(data.trust_score).toBe(89);
    });
  });

  describe('🌱 Phase 3: Agricultural Integration', () => {
    it('should create agricultural calendar', async () => {
      const { data, error } = await supabase
        .from('agricultural_calendar')
        .insert({
          crop_type: 'coffee',
          harvest_season_start: '2025-01-15',
          harvest_season_end: '2025-03-15',
          weather_sensitivity: 'high',
          flood_risk: 'medium',
          landslide_risk: 'low',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.crop_type).toBe('coffee');
      expect(data.weather_sensitivity).toBe('high');
    });

    it('should create farm supply tracking', async () => {
      const { data, error } = await supabase
        .from('farm_supply_tracking')
        .insert({
          supply_type: 'fertilizer',
          current_stock: 500,
          reorder_point: 100,
          supplier_name: 'AgroSupply PR',
          last_order_date: new Date().toISOString(),
          next_order_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.supply_type).toBe('fertilizer');
      expect(data.current_stock).toBe(500);
      expect(data.reorder_point).toBe(100);
    });

    it('should create farm equipment record', async () => {
      const { data, error } = await supabase
        .from('farm_equipment')
        .insert({
          equipment_name: 'Tractor John Deere',
          equipment_type: 'tractor',
          purchase_date: '2020-01-15',
          maintenance_schedule: 'monthly',
          last_maintenance: new Date().toISOString(),
          next_maintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          operational_status: 'operational',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.equipment_name).toBe('Tractor John Deere');
      expect(data.operational_status).toBe('operational');
    });

    it('should create livestock management record', async () => {
      const { data, error } = await supabase
        .from('livestock_management')
        .insert({
          animal_type: 'cattle',
          herd_size: 25,
          health_status: 'healthy',
          last_vaccination: new Date().toISOString(),
          next_vaccination: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          feed_supply_days: 30,
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.animal_type).toBe('cattle');
      expect(data.herd_size).toBe(25);
      expect(data.health_status).toBe('healthy');
    });
  });

  describe('💰 Phase 4: Financial Inclusion', () => {
    it('should create cash payment record', async () => {
      const { data, error } = await supabase
        .from('cash_payment_system')
        .insert({
          payment_method: 'cash',
          mobile_money_provider: 'ATH Móvil',
          microfinance_institution: 'Banco Popular',
          payment_plan_type: 'flexible',
          amount: 150.00,
          currency: 'USD',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.payment_method).toBe('cash');
      expect(data.amount).toBe(150.00);
    });

    it('should create mobile money integration', async () => {
      const { data, error } = await supabase
        .from('mobile_money_integration')
        .insert({
          provider_name: 'ATH Móvil',
          account_number: '787-555-0101',
          account_holder: 'Juan Pérez',
          daily_limit: 1000.00,
          monthly_limit: 5000.00,
          is_active: true,
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.provider_name).toBe('ATH Móvil');
      expect(data.is_active).toBe(true);
    });

    it('should create microfinance connection', async () => {
      const { data, error } = await supabase
        .from('microfinance_connections')
        .insert({
          institution_name: 'Banco Popular',
          loan_type: 'agricultural',
          loan_amount: 5000.00,
          interest_rate: 8.5,
          term_months: 24,
          application_status: 'approved',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.institution_name).toBe('Banco Popular');
      expect(data.loan_type).toBe('agricultural');
      expect(data.application_status).toBe('approved');
    });

    it('should create payment plan', async () => {
      const { data, error } = await supabase
        .from('payment_plans')
        .insert({
          plan_type: 'flexible',
          total_amount: 300.00,
          installment_amount: 50.00,
          installment_count: 6,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.plan_type).toBe('flexible');
      expect(data.total_amount).toBe(300.00);
      expect(data.status).toBe('active');
    });
  });

  describe('🔄 Integration Testing', () => {
    it('should test complete rural workflow', async () => {
      // 1. Create infrastructure monitoring
      const { data: infraData, error: infraError } = await supabase
        .from('rural_infrastructure')
        .insert({
          location_id: testLocationId,
          power_status: 'normal',
          ups_battery_level: 85,
          generator_fuel_level: 75,
          internet_connectivity: 'primary',
          created_by: testUserId
        })
        .select()
        .single();

      expect(infraError).toBeNull();
      expect(infraData).toBeDefined();

      // 2. Create community pickup point
      const { data: pickupData, error: pickupError } = await supabase
        .from('community_pickup_points')
        .insert({
          name: 'Integration Test Pickup Point',
          type: 'community_center',
          contact_person: 'Test Contact',
          contact_phone: '+1-787-555-9999',
          address: '999 Integration Test Street, San Juan, PR 00901',
          is_active: true,
          capacity_daily: 50,
          current_occupancy: 12,
          rating: 4.8,
          total_reviews: 45,
          created_by: testUserId
        })
        .select()
        .single();

      expect(pickupError).toBeNull();
      expect(pickupData).toBeDefined();

      // 3. Create agricultural calendar
      const { data: agriData, error: agriError } = await supabase
        .from('agricultural_calendar')
        .insert({
          crop_type: 'integration_test_crop',
          harvest_season_start: '2025-01-15',
          harvest_season_end: '2025-03-15',
          weather_sensitivity: 'high',
          flood_risk: 'medium',
          landslide_risk: 'low',
          created_by: testUserId
        })
        .select()
        .single();

      expect(agriError).toBeNull();
      expect(agriData).toBeDefined();

      // 4. Create financial inclusion
      const { data: financeData, error: financeError } = await supabase
        .from('cash_payment_system')
        .insert({
          payment_method: 'integration_test_cash',
          mobile_money_provider: 'ATH Móvil',
          microfinance_institution: 'Banco Popular',
          payment_plan_type: 'flexible',
          amount: 150.00,
          currency: 'USD',
          created_by: testUserId
        })
        .select()
        .single();

      expect(financeError).toBeNull();
      expect(financeData).toBeDefined();

      // 5. Create emergency alert
      const { data: alertData, error: alertError } = await supabase
        .from('rural_emergency_alerts')
        .insert({
          alert_type: 'power_outage',
          severity: 'high',
          title: 'Integration Test Alert',
          description: 'Integration test emergency alert',
          location_lat: 18.2208,
          location_lng: -66.5901,
          radius_km: 15,
          is_active: true,
          created_by: testUserId
        })
        .select()
        .single();

      expect(alertError).toBeNull();
      expect(alertData).toBeDefined();

      console.log('✅ All rural features integration test passed!');
    });

    it('should test offline operation workflow', async () => {
      // 1. Create offline operation
      const { data: offlineData, error: offlineError } = await supabase
        .from('offline_operations')
        .insert({
          location_id: testLocationId,
          start_time: new Date().toISOString(),
          reason: 'power_outage',
          operations_affected: ['package_tracking', 'customer_notifications'],
          data_synced: false
        })
        .select()
        .single();

      expect(offlineError).toBeNull();
      expect(offlineData).toBeDefined();

      // 2. Update infrastructure status
      const { data: updateData, error: updateError } = await supabase
        .from('rural_infrastructure')
        .update({ 
          power_status: 'critical',
          internet_connectivity: 'offline'
        })
        .eq('location_id', testLocationId)
        .select()
        .single();

      expect(updateError).toBeNull();
      expect(updateData).toBeDefined();
      expect(updateData.power_status).toBe('critical');

      // 3. Create emergency alert
      const { data: alertData, error: alertError } = await supabase
        .from('rural_emergency_alerts')
        .insert({
          alert_type: 'power_outage',
          severity: 'critical',
          title: 'Critical Power Outage',
          description: 'Power outage affecting rural operations',
          location_lat: 18.2208,
          location_lng: -66.5901,
          radius_km: 20,
          is_active: true,
          created_by: testUserId
        })
        .select()
        .single();

      expect(alertError).toBeNull();
      expect(alertData).toBeDefined();
      expect(alertData.severity).toBe('critical');

      console.log('✅ Offline operation workflow test passed!');
    });
  });

  describe('🎯 Business Logic Testing', () => {
    it('should calculate offline duration correctly', async () => {
      const startTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const endTime = new Date();

      const { data, error } = await supabase
        .from('offline_operations')
        .insert({
          location_id: testLocationId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          reason: 'power_outage',
          operations_affected: ['package_tracking'],
          data_synced: true
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      
      // Duration should be calculated automatically by trigger
      expect(data.duration_minutes).toBeGreaterThan(0);
      expect(data.duration_minutes).toBeCloseTo(120, -1); // Approximately 120 minutes
    });

    it('should handle agricultural season routing', async () => {
      const { data, error } = await supabase
        .from('agricultural_calendar')
        .insert({
          crop_type: 'business_logic_test_crop',
          harvest_season_start: '2025-01-15',
          harvest_season_end: '2025-03-15',
          weather_sensitivity: 'high',
          flood_risk: 'medium',
          landslide_risk: 'low',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Test that harvest season is properly set
      const harvestStart = new Date(data.harvest_season_start);
      const harvestEnd = new Date(data.harvest_season_end);
      
      expect(harvestStart.getTime()).toBeLessThan(harvestEnd.getTime());
      expect(data.weather_sensitivity).toBe('high');
    });

    it('should validate community trust scoring', async () => {
      const { data, error } = await supabase
        .from('neighbor_delivery_network')
        .insert({
          name: 'María Rodríguez',
          vehicle_type: 'bicycle',
          trust_score: 88,
          total_deliveries: 89,
          successful_deliveries: 87,
          average_rating: 4.8,
          is_active: true,
          background_check_status: 'passed',
          created_by: testUserId
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Trust score should be within valid range
      expect(data.trust_score).toBeGreaterThanOrEqual(0);
      expect(data.trust_score).toBeLessThanOrEqual(100);

      // Success rate should be calculated correctly
      const successRate = (data.successful_deliveries / data.total_deliveries) * 100;
      expect(successRate).toBeCloseTo(97.75, 1);
    });
  });
}); 