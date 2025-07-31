import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 25 }, // Ramp up to 25 users
    { duration: '5m', target: 25 }, // Stay at 25 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '10m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.01'], // Error rate must be less than 1%
    errors: ['rate<0.01'],
  },
};

// Puerto Rico mail center scenarios
const scenarios = {
  smallCenter: {
    users: 25,
    mailboxes: 500,
    packagesPerDay: 200,
  },
  mediumCenter: {
    users: 50,
    mailboxes: 2000,
    packagesPerDay: 800,
  },
  largeCenter: {
    users: 100,
    mailboxes: 8000,
    packagesPerDay: 3000,
  },
};

// Test users loaded from environment variables
if (!__ENV.TEST_USER_1_EMAIL || !__ENV.TEST_USER_1_PASSWORD || 
    !__ENV.TEST_USER_2_EMAIL || !__ENV.TEST_USER_2_PASSWORD ||
    !__ENV.TEST_ADMIN_EMAIL || !__ENV.TEST_ADMIN_PASSWORD) {
  throw new Error('Missing required environment variables. Please check .env file');
}

const testUsers = [
  { 
    email: __ENV.TEST_USER_1_EMAIL, 
    password: __ENV.TEST_USER_1_PASSWORD
  },
  { 
    email: __ENV.TEST_USER_2_EMAIL, 
    password: __ENV.TEST_USER_2_PASSWORD
  },
  { 
    email: __ENV.TEST_ADMIN_EMAIL, 
    password: __ENV.TEST_ADMIN_PASSWORD,
    isAdmin: true 
  }
];

const testCustomers = [
  { name: 'María González', email: 'maria@example.com', phone: '+1-787-555-0101' },
  { name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '+1-787-555-0102' },
  { name: 'Ana Martínez', email: 'ana@example.com', phone: '+1-787-555-0103' },
];

// Base URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  const scenario = scenarios.mediumCenter; // Default to medium center
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  
  // Test 1: Authentication Flow
  const authTest = () => {
    const loginPayload = JSON.stringify({
      email: user.email,
      password: user.password,
    });

    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, {
      'login successful': (r) => r.status === 200,
      'login response time < 1s': (r) => r.timings.duration < 1000,
    });

    if (loginRes.status === 200) {
      const token = loginRes.json('token');
      return token;
    }
    return null;
  };

  // Test 2: Dashboard Loading
  const dashboardTest = (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const dashboardRes = http.get(`${BASE_URL}/dashboard`, { headers });
    
    check(dashboardRes, {
      'dashboard loads': (r) => r.status === 200,
      'dashboard response time < 2s': (r) => r.timings.duration < 2000,
    });
  };

  // Test 3: Package Intake Process
  const packageIntakeTest = (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const packageData = {
      trackingNumber: `PR${Date.now()}`,
      customerEmail: testCustomers[Math.floor(Math.random() * testCustomers.length)].email,
      carrier: 'USPS',
      weight: Math.random() * 10 + 0.1,
      dimensions: {
        length: Math.random() * 20 + 5,
        width: Math.random() * 15 + 5,
        height: Math.random() * 10 + 2,
      },
    };

    const packageRes = http.post(`${BASE_URL}/packages/intake`, JSON.stringify(packageData), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

    check(packageRes, {
      'package intake successful': (r) => r.status === 201,
      'package intake response time < 1s': (r) => r.timings.duration < 1000,
    });
  };

  // Test 4: Customer Management
  const customerManagementTest = (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    // Get customers list
    const customersRes = http.get(`${BASE_URL}/customers`, { headers });
    
    check(customersRes, {
      'customers list loads': (r) => r.status === 200,
      'customers response time < 1s': (r) => r.timings.duration < 1000,
    });

    // Create new customer
    const newCustomer = testCustomers[Math.floor(Math.random() * testCustomers.length)];
    const createCustomerRes = http.post(`${BASE_URL}/customers`, JSON.stringify(newCustomer), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

    check(createCustomerRes, {
      'customer creation successful': (r) => r.status === 201,
      'customer creation response time < 1s': (r) => r.timings.duration < 1000,
    });
  };

  // Test 5: Billing System
  const billingTest = (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    // Get billing dashboard
    const billingRes = http.get(`${BASE_URL}/billing`, { headers });
    
    check(billingRes, {
      'billing dashboard loads': (r) => r.status === 200,
      'billing response time < 1s': (r) => r.timings.duration < 1000,
    });

    // Generate invoice (simulate)
    const invoiceData = {
      customerId: Math.floor(Math.random() * 1000) + 1,
      period: '2024-01',
      items: [
        { type: 'mailbox_rental', amount: 25.00, iva: 2.88 },
        { type: 'package_handling', amount: 5.00, iva: 0.58 },
      ],
    };

    const invoiceRes = http.post(`${BASE_URL}/billing/invoices`, JSON.stringify(invoiceData), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

    check(invoiceRes, {
      'invoice generation successful': (r) => r.status === 201,
      'invoice generation response time < 2s': (r) => r.timings.duration < 2000,
    });
  };

  // Test 6: Reporting System
  const reportingTest = (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    // Get daily report
    const reportRes = http.get(`${BASE_URL}/reports/daily`, { headers });
    
    check(reportRes, {
      'daily report loads': (r) => r.status === 200,
      'report response time < 3s': (r) => r.timings.duration < 3000,
    });
  };

  // Test 7: Mobile API Endpoints
  const mobileApiTest = (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    // Test mobile-optimized endpoints
    const mobileRes = http.get(`${BASE_URL}/api/mobile/dashboard`, { headers });
    
    check(mobileRes, {
      'mobile API responds': (r) => r.status === 200,
      'mobile API response time < 1s': (r) => r.timings.duration < 1000,
    });
  };

  // Test 8: Real-time Features
  const realtimeTest = (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    // Test WebSocket connection (simulated)
    const wsRes = http.get(`${BASE_URL}/api/realtime/status`, { headers });
    
    check(wsRes, {
      'realtime endpoint accessible': (r) => r.status === 200,
      'realtime response time < 500ms': (r) => r.timings.duration < 500,
    });
  };

  // Execute test scenarios
  try {
    const token = authTest();
    
    if (token) {
      dashboardTest(token);
      sleep(1);
      
      packageIntakeTest(token);
      sleep(0.5);
      
      customerManagementTest(token);
      sleep(0.5);
      
      billingTest(token);
      sleep(1);
      
      reportingTest(token);
      sleep(1);
      
      mobileApiTest(token);
      sleep(0.5);
      
      realtimeTest(token);
      sleep(0.5);
    }
  } catch (error) {
    errorRate.add(1);
    console.error('Test error:', error);
  }

  // Random sleep between requests to simulate real user behavior
  sleep(Math.random() * 3 + 1);
}

// Handle test setup and teardown
export function setup() {
  console.log('Setting up load test for PRMCMS...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('Test scenarios configured for Puerto Rico mail centers');
  return {};
}

export function teardown(data) {
  console.log('Load test completed');
  console.log('Check results for performance insights');
} 