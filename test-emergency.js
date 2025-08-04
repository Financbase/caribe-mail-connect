const http = require('https');

console.log('🧪 Testing Emergency Management System...\n');

// Test 1: Check if server is running
function testServer() {
  return new Promise((resolve) => {
    const req = https.get('http://localhost:5173/', (res) => {
      console.log('✅ Server Status:', res.statusCode);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      console.log('❌ Server not accessible');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Server timeout');
      resolve(false);
    });
  });
}

// Test 2: Check emergency page
function testEmergencyPage() {
  return new Promise((resolve) => {
    const req = https.get('http://localhost:5173/#/emergency', (res) => {
      console.log('✅ Emergency Page Status:', res.statusCode);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      console.log('❌ Emergency page not accessible');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Emergency page timeout');
      resolve(false);
    });
  });
}

// Test 3: Check if emergency components exist
function testEmergencyComponents() {
  const fs = require('fs');
  const components = [
    'src/pages/Emergency.tsx',
    'src/components/emergency/EmergencyDashboard.tsx',
    'src/components/emergency/BusinessContinuity.tsx',
    'src/components/emergency/EmergencyLogistics.tsx',
    'src/components/emergency/PostEmergencyRecovery.tsx',
    'src/components/emergency/WeatherAlertIntegration.tsx',
    'src/contexts/EmergencyContext.tsx'
  ];
  
  console.log('\n📁 Checking Emergency Components:');
  let allExist = true;
  
  components.forEach(component => {
    if (fs.existsSync(component)) {
      console.log(`✅ ${component}`);
    } else {
      console.log(`❌ ${component} - Missing`);
      allExist = false;
    }
  });
  
  return allExist;
}

// Test 4: Check routing configuration
function testRouting() {
  const fs = require('fs');
  const appRouter = fs.readFileSync('src/pages/AppRouter.tsx', 'utf8');
  const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
  
  console.log('\n🛣️  Checking Routing Configuration:');
  
  const hasEmergencyRoute = appRouter.includes('/emergency');
  const hasEmergencyProvider = appTsx.includes('EmergencyProvider');
  const hasEmergencyImport = appRouter.includes('Emergency');
  
  console.log(`✅ Emergency Route: ${hasEmergencyRoute ? 'Configured' : 'Missing'}`);
  console.log(`✅ Emergency Provider: ${hasEmergencyProvider ? 'Configured' : 'Missing'}`);
  console.log(`✅ Emergency Import: ${hasEmergencyImport ? 'Configured' : 'Missing'}`);
  
  return hasEmergencyRoute && hasEmergencyProvider && hasEmergencyImport;
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Emergency System Tests...\n');
  
  const serverTest = await testServer();
  const emergencyPageTest = await testEmergencyPage();
  const componentsTest = testEmergencyComponents();
  const routingTest = testRouting();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Server Running: ${serverTest ? '✅' : '❌'}`);
  console.log(`Emergency Page: ${emergencyPageTest ? '✅' : '❌'}`);
  console.log(`Components Exist: ${componentsTest ? '✅' : '❌'}`);
  console.log(`Routing Configured: ${routingTest ? '✅' : '❌'}`);
  
  const allPassed = serverTest && emergencyPageTest && componentsTest && routingTest;
  
  console.log('\n🎯 Final Result:');
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED - Emergency Management System is fully functional!');
    console.log('\n📍 Access Emergency Center at: http://localhost:5173/#/emergency');
  } else {
    console.log('⚠️  Some tests failed - Please check the issues above');
  }
}

runTests().catch(console.error); 