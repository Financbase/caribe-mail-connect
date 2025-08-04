// Test script to verify core business tables work correctly
const https = require('https');

console.log('🧪 Testing Core Business Tables...\n');

// Test configuration
const SUPABASE_URL = 'https://affejwamvzsmtvohasgh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZmVqd2FtdnpzbXR2b2hhc2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzI0NjIsImV4cCI6MjA2OTUwODQ2Mn0.4bilcSzmEhToOEzL1zCa5Gse84FcVtLKR_E6o8J2MGA';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'affejwamvzsmtvohasgh.supabase.co',
      port: 443,
      path: `/rest/v1/${path}`,
      method: method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test 1: Check if customers table exists and has data
async function testCustomersTable() {
  console.log('1️⃣ Testing customers table...');
  
  try {
    const response = await makeRequest('customers?select=*&limit=5');
    
    if (response.statusCode === 200) {
      const customers = JSON.parse(response.data);
      console.log(`   ✅ Customers table accessible`);
      console.log(`   📊 Found ${customers.length} customers`);
      
      if (customers.length > 0) {
        console.log(`   👤 Sample customer: ${customers[0].first_name} ${customers[0].last_name} (${customers[0].email})`);
      }
      return true;
    } else {
      console.log(`   ❌ Customers table error: ${response.statusCode}`);
      console.log(`   📄 Response: ${response.data}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Customers table test failed: ${error.message}`);
    return false;
  }
}

// Test 2: Check if packages table exists and has data
async function testPackagesTable() {
  console.log('\n2️⃣ Testing packages table...');
  
  try {
    const response = await makeRequest('packages?select=*&limit=5');
    
    if (response.statusCode === 200) {
      const packages = JSON.parse(response.data);
      console.log(`   ✅ Packages table accessible`);
      console.log(`   📦 Found ${packages.length} packages`);
      
      if (packages.length > 0) {
        console.log(`   📋 Sample package: ${packages[0].tracking_number} (${packages[0].status})`);
      }
      return true;
    } else {
      console.log(`   ❌ Packages table error: ${response.statusCode}`);
      console.log(`   📄 Response: ${response.data}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Packages table test failed: ${error.message}`);
    return false;
  }
}

// Test 3: Check if employees table exists and has data
async function testEmployeesTable() {
  console.log('\n3️⃣ Testing employees table...');
  
  try {
    const response = await makeRequest('employees?select=*&limit=5');
    
    if (response.statusCode === 200) {
      const employees = JSON.parse(response.data);
      console.log(`   ✅ Employees table accessible`);
      console.log(`   👥 Found ${employees.length} employees`);
      
      if (employees.length > 0) {
        console.log(`   🏢 Sample employee: ${employees[0].first_name} ${employees[0].last_name} (${employees[0].role})`);
      }
      return true;
    } else {
      console.log(`   ❌ Employees table error: ${response.statusCode}`);
      console.log(`   📄 Response: ${response.data}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Employees table test failed: ${error.message}`);
    return false;
  }
}

// Test 4: Check if IoT devices table exists and has data
async function testIoTDevicesTable() {
  console.log('\n4️⃣ Testing IoT devices table...');
  
  try {
    const response = await makeRequest('iot_devices?select=*&limit=5');
    
    if (response.statusCode === 200) {
      const devices = JSON.parse(response.data);
      console.log(`   ✅ IoT devices table accessible`);
      console.log(`   🔧 Found ${devices.length} devices`);
      
      if (devices.length > 0) {
        console.log(`   📡 Sample device: ${devices[0].device_id} (${devices[0].device_type})`);
      }
      return true;
    } else {
      console.log(`   ❌ IoT devices table error: ${response.statusCode}`);
      console.log(`   📄 Response: ${response.data}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ IoT devices table test failed: ${error.message}`);
    return false;
  }
}

// Test 5: Test CRUD operations on customers table
async function testCustomerCRUD() {
  console.log('\n5️⃣ Testing customer CRUD operations...');
  
  const testCustomer = {
    email: `test-${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'User',
    phone: '+1234567890',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    postal_code: '12345',
    status: 'active',
    subscription_tier: 'basic'
  };
  
  try {
    // Create customer
    console.log('   📝 Creating test customer...');
    const createResponse = await makeRequest('customers', 'POST', testCustomer);
    
    if (createResponse.statusCode === 201) {
      console.log('   ✅ Customer created successfully');
      
      // Read customer
      console.log('   📖 Reading test customer...');
      const readResponse = await makeRequest(`customers?email=eq.${testCustomer.email}`);
      
      if (readResponse.statusCode === 200) {
        const customers = JSON.parse(readResponse.data);
        if (customers.length > 0) {
          console.log('   ✅ Customer read successfully');
          
          // Update customer
          console.log('   ✏️  Updating test customer...');
          const updateData = { first_name: 'Updated' };
          const updateResponse = await makeRequest(`customers?email=eq.${testCustomer.email}`, 'PATCH', updateData);
          
          if (updateResponse.statusCode === 204) {
            console.log('   ✅ Customer updated successfully');
            
            // Delete customer
            console.log('   🗑️  Deleting test customer...');
            const deleteResponse = await makeRequest(`customers?email=eq.${testCustomer.email}`, 'DELETE');
            
            if (deleteResponse.statusCode === 204) {
              console.log('   ✅ Customer deleted successfully');
              return true;
            } else {
              console.log(`   ❌ Customer delete failed: ${deleteResponse.statusCode}`);
              return false;
            }
          } else {
            console.log(`   ❌ Customer update failed: ${updateResponse.statusCode}`);
            return false;
          }
        } else {
          console.log('   ❌ Customer not found after creation');
          return false;
        }
      } else {
        console.log(`   ❌ Customer read failed: ${readResponse.statusCode}`);
        return false;
      }
    } else {
      console.log(`   ❌ Customer creation failed: ${createResponse.statusCode}`);
      console.log(`   📄 Response: ${createResponse.data}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ CRUD test failed: ${error.message}`);
    return false;
  }
}

// Test 6: Test package tracking functionality
async function testPackageTracking() {
  console.log('\n6️⃣ Testing package tracking...');
  
  try {
    // Get packages with customer information
    const response = await makeRequest('packages?select=*,customers(first_name,last_name,email)&limit=3');
    
    if (response.statusCode === 200) {
      const packages = JSON.parse(response.data);
      console.log(`   ✅ Package tracking query successful`);
      console.log(`   📦 Found ${packages.length} packages with customer data`);
      
      if (packages.length > 0) {
        const package = packages[0];
        console.log(`   📋 Sample package: ${package.tracking_number}`);
        console.log(`   👤 Customer: ${package.customers?.first_name} ${package.customers?.last_name}`);
        console.log(`   📧 Email: ${package.customers?.email}`);
        console.log(`   📦 Status: ${package.status}`);
      }
      return true;
    } else {
      console.log(`   ❌ Package tracking failed: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Package tracking test failed: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Core Tables Testing...\n');
  
  const results = {
    customers: await testCustomersTable(),
    packages: await testPackagesTable(),
    employees: await testEmployeesTable(),
    iotDevices: await testIoTDevicesTable(),
    crud: await testCustomerCRUD(),
    tracking: await testPackageTracking()
  };
  
  console.log('\n📊 TEST RESULTS SUMMARY:');
  console.log('========================');
  console.log(`✅ Customers Table: ${results.customers ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Packages Table: ${results.packages ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Employees Table: ${results.employees ? 'PASS' : 'FAIL'}`);
  console.log(`✅ IoT Devices Table: ${results.iotDevices ? 'PASS' : 'FAIL'}`);
  console.log(`✅ CRUD Operations: ${results.crud ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Package Tracking: ${results.tracking ? 'PASS' : 'FAIL'}`);
  
  const passedTests = Object.values(results).filter(result => result).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All core tables are working correctly!');
    console.log('✅ PRMCMS database is ready for beta testing!');
  } else {
    console.log('⚠️  Some tests failed. Core tables may need attention.');
  }
}

runAllTests(); 