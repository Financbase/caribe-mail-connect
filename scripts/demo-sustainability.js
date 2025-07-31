#!/usr/bin/env node

/**
 * Sustainability System Demo Script
 * 
 * This script demonstrates how to use the comprehensive environmental impact
 * tracking system implemented in PRMCMS.
 * 
 * Usage: node scripts/demo-sustainability.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration - replace with your actual Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data for demonstration
const sampleData = {
  ecoFriendlyPackaging: [
    {
      name: 'Biodegradable Bubble Wrap',
      description: 'Plant-based bubble wrap alternative',
      material_type: 'biodegradable',
      carbon_saved_kg: 25.5,
      cost_savings: 150.00,
      usage_count: 1250,
      is_active: true
    },
    {
      name: 'Recycled Cardboard Boxes',
      description: '100% recycled cardboard packaging',
      material_type: 'recycled',
      carbon_saved_kg: 45.2,
      cost_savings: 200.00,
      usage_count: 3200,
      is_active: true
    }
  ],
  
  carbonOffsetPrograms: [
    {
      name: 'Amazon Rainforest Protection',
      description: 'Protecting 100 acres of rainforest',
      offset_amount_kg: 5000,
      cost_per_kg: 0.15,
      total_cost: 750.00,
      status: 'active',
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    }
  ],
  
  electricVehicles: [
    {
      vehicle_id: 'EV-001',
      vehicle_type: 'delivery_van',
      model: 'Tesla Model 3',
      battery_capacity_kwh: 75,
      range_km: 350,
      carbon_saved_kg: 1250,
      distance_traveled_km: 15000,
      charging_sessions: 45,
      is_active: true
    }
  ],
  
  solarPanels: [
    {
      panel_id: 'SOLAR-001',
      capacity_kw: 50.0,
      location: 'Warehouse A Roof',
      installation_date: '2023-06-15',
      energy_generated_kwh: 25000,
      carbon_saved_kg: 12000,
      cost_savings: 3000.00,
      efficiency_percentage: 85.5,
      is_active: true
    }
  ],
  
  greenInitiatives: [
    {
      name: 'LED Lighting Upgrade',
      description: 'Replace all warehouse lighting with LED fixtures',
      status: 'completed',
      carbon_saved: 800,
      cost_savings: 5000,
      people_reached: 25,
      progress: 100
    },
    {
      name: 'Water Conservation Program',
      description: 'Install low-flow fixtures and rainwater harvesting',
      status: 'in-progress',
      carbon_saved: 300,
      cost_savings: 2000,
      people_reached: 15,
      progress: 75
    }
  ],
  
  treePlantingCounter: {
    total_planted: 2500,
    goal: 10000,
    progress: 25,
    total_carbon_offset: 12500,
    recent_plantings: [
      {
        species: 'Oak',
        location: 'Local Park',
        quantity: 100,
        date: '2024-01-15'
      }
    ]
  }
};

async function populateSampleData() {
  console.log('🌱 Populating Sustainability System with Sample Data...\n');
  
  try {
    // Insert eco-friendly packaging data
    console.log('📦 Adding eco-friendly packaging options...');
    const { data: packagingData, error: packagingError } = await supabase
      .from('eco_friendly_packaging')
      .insert(sampleData.ecoFriendlyPackaging);
    
    if (packagingError) {
      console.error('Error inserting packaging data:', packagingError);
    } else {
      console.log(`✅ Added ${packagingData?.length || 0} packaging options`);
    }
    
    // Insert carbon offset programs
    console.log('🌍 Adding carbon offset programs...');
    const { data: offsetData, error: offsetError } = await supabase
      .from('carbon_offset_programs')
      .insert(sampleData.carbonOffsetPrograms);
    
    if (offsetError) {
      console.error('Error inserting offset data:', offsetError);
    } else {
      console.log(`✅ Added ${offsetData?.length || 0} carbon offset programs`);
    }
    
    // Insert electric vehicles
    console.log('🚗 Adding electric vehicle data...');
    const { data: evData, error: evError } = await supabase
      .from('electric_vehicles')
      .insert(sampleData.electricVehicles);
    
    if (evError) {
      console.error('Error inserting EV data:', evError);
    } else {
      console.log(`✅ Added ${evData?.length || 0} electric vehicles`);
    }
    
    // Insert solar panels
    console.log('☀️ Adding solar panel data...');
    const { data: solarData, error: solarError } = await supabase
      .from('solar_panels')
      .insert(sampleData.solarPanels);
    
    if (solarError) {
      console.error('Error inserting solar data:', solarError);
    } else {
      console.log(`✅ Added ${solarData?.length || 0} solar panels`);
    }
    
    console.log('\n🎉 Sample data population completed successfully!');
    console.log('\n📊 Sample Metrics:');
    console.log(`   • Eco-friendly packaging options: ${sampleData.ecoFriendlyPackaging.length}`);
    console.log(`   • Carbon offset programs: ${sampleData.carbonOffsetPrograms.length}`);
    console.log(`   • Electric vehicles: ${sampleData.electricVehicles.length}`);
    console.log(`   • Solar panels: ${sampleData.solarPanels.length}`);
    console.log(`   • Trees planted: ${sampleData.treePlantingCounter.total_planted}`);
    
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  }
}

async function demonstrateQueries() {
  console.log('\n🔍 Demonstrating Sustainability Queries...\n');
  
  try {
    // Get total carbon saved from all sources
    console.log('📊 Calculating total environmental impact...');
    
    const { data: packaging, error: pkgError } = await supabase
      .from('eco_friendly_packaging')
      .select('carbon_saved_kg, cost_savings');
    
    const { data: vehicles, error: vehError } = await supabase
      .from('electric_vehicles')
      .select('carbon_saved_kg');
    
    const { data: solar, error: solError } = await supabase
      .from('solar_panels')
      .select('carbon_saved_kg, cost_savings');
    
    if (!pkgError && !vehError && !solError) {
      const totalCarbonSaved = 
        (packaging?.reduce((sum, p) => sum + (p.carbon_saved_kg || 0), 0) || 0) +
        (vehicles?.reduce((sum, v) => sum + (v.carbon_saved_kg || 0), 0) || 0) +
        (solar?.reduce((sum, s) => sum + (s.carbon_saved_kg || 0), 0) || 0);
      
      const totalCostSavings = 
        (packaging?.reduce((sum, p) => sum + (p.cost_savings || 0), 0) || 0) +
        (solar?.reduce((sum, s) => sum + (s.cost_savings || 0), 0) || 0);
      
      console.log(`✅ Total Carbon Saved: ${totalCarbonSaved.toFixed(2)} kg CO2`);
      console.log(`✅ Total Cost Savings: $${totalCostSavings.toFixed(2)}`);
    }
    
    // Get active initiatives
    console.log('\n📋 Active sustainability initiatives...');
    const { data: initiatives, error: initError } = await supabase
      .from('eco_friendly_packaging')
      .select('name, carbon_saved_kg, is_active')
      .eq('is_active', true);
    
    if (!initError && initiatives) {
      console.log(`✅ Found ${initiatives.length} active initiatives:`);
      initiatives.forEach(init => {
        console.log(`   • ${init.name}: ${init.carbon_saved_kg} kg CO2 saved`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error demonstrating queries:', error);
  }
}

async function showSystemFeatures() {
  console.log('\n🎯 Sustainability System Features:\n');
  
  console.log('1. 📊 Environmental Impact Overview');
  console.log('   • Real-time carbon footprint tracking');
  console.log('   • Cost savings calculation');
  console.log('   • Community impact measurement');
  console.log('   • Tree planting counter');
  
  console.log('\n2. 🚚 Green Shipping Tracker');
  console.log('   • Eco-friendly packaging monitoring');
  console.log('   • Carbon offset program management');
  console.log('   • Electric vehicle fleet tracking');
  console.log('   • Consolidated shipping optimization');
  
  console.log('\n3. ♻️ Waste Reduction Tracker');
  console.log('   • Package reuse program monitoring');
  console.log('   • Recycling location database');
  console.log('   • Material tracking and audits');
  console.log('   • Reduction goal setting');
  
  console.log('\n4. ⚡ Energy Management Tracker');
  console.log('   • Solar panel performance monitoring');
  console.log('   • Energy usage trend analysis');
  console.log('   • Efficiency improvement tracking');
  console.log('   • Green certification management');
  
  console.log('\n5. 🤝 Community Impact Tracker');
  console.log('   • Local initiative monitoring');
  console.log('   • Environmental education tracking');
  console.log('   • Partner program management');
  console.log('   • Customer participation analytics');
  
  console.log('\n6. 🏆 Achievement System');
  console.log('   • Green badges for milestones');
  console.log('   • Environmental impact visualizations');
  console.log('   • Progress tracking and gamification');
  
  console.log('\n7. 📈 Analytics Dashboard');
  console.log('   • Comprehensive reporting');
  console.log('   • Performance metrics');
  console.log('   • Trend analysis');
  console.log('   • Goal progress tracking');
}

async function main() {
  console.log('🌱 PRMCMS Sustainability System Demo\n');
  console.log('This script demonstrates the comprehensive environmental');
  console.log('impact tracking system implemented in PRMCMS.\n');
  
  // Check if Supabase is configured
  if (supabaseUrl === 'your-supabase-url' || supabaseKey === 'your-supabase-anon-key') {
    console.log('⚠️  Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    console.log('   Example:');
    console.log('   export SUPABASE_URL="https://your-project.supabase.co"');
    console.log('   export SUPABASE_ANON_KEY="your-anon-key"');
    console.log('\n📖 Showing system features instead...\n');
    await showSystemFeatures();
    return;
  }
  
  // Show system features
  await showSystemFeatures();
  
  // Populate sample data
  await populateSampleData();
  
  // Demonstrate queries
  await demonstrateQueries();
  
  console.log('\n🎉 Demo completed successfully!');
  console.log('\n📖 To access the sustainability system:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Navigate to: http://localhost:5173/sustainability');
  console.log('   3. Explore the comprehensive environmental impact tracking features');
  
  console.log('\n🔧 For production deployment:');
  console.log('   1. Replace mock data with real data sources');
  console.log('   2. Configure external API integrations');
  console.log('   3. Set up monitoring and alerting');
  console.log('   4. Train users on the new sustainability features');
}

// Run the demo
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  populateSampleData,
  demonstrateQueries,
  showSystemFeatures
}; 