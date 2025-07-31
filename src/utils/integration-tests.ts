/**
 * PRMCMS Integration Test Suite
 * Tests all critical API integrations for the system
 */

import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  integration: string;
  status: 'success' | 'failure' | 'partial';
  message: string;
  details?: any;
  recommendations?: string[];
}

class IntegrationTester {
  private results: TestResult[] = [];

  // 1. SUPABASE INTEGRATION TESTS
  async testSupabaseConnection(): Promise<TestResult> {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        return {
          integration: 'Supabase Database',
          status: 'failure',
          message: `Database connection failed: ${error.message}`,
          recommendations: [
            'Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly',
            'Check if the database schema is initialized',
            'Ensure network connectivity to Supabase'
          ]
        };
      }

      return {
        integration: 'Supabase Database',
        status: 'success',
        message: 'Database connection successful',
        details: { connectionTime: new Date().toISOString() }
      };
    } catch (error) {
      return {
        integration: 'Supabase Database',
        status: 'failure',
        message: `Unexpected error: ${error}`,
        recommendations: ['Check console for detailed error logs']
      };
    }
  }

  async testSupabaseAuth(): Promise<TestResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      return {
        integration: 'Supabase Auth',
        status: 'success',
        message: session ? 'Auth session active' : 'Auth ready (no active session)',
        details: {
          hasSession: !!session,
          authConfigured: true
        }
      };
    } catch (error) {
      return {
        integration: 'Supabase Auth',
        status: 'failure',
        message: `Auth system error: ${error}`,
        recommendations: [
          'Verify Supabase Auth is enabled in dashboard',
          'Check auth configuration settings'
        ]
      };
    }
  }

  async testSupabaseRealtime(): Promise<TestResult> {
    try {
      const channel = supabase.channel('test-channel');
      let connected = false;

      await new Promise((resolve) => {
        channel
          .on('system', { event: '*' }, () => {
            connected = true;
            resolve(true);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              connected = true;
              resolve(true);
            }
          });

        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000);
      });

      channel.unsubscribe();

      return {
        integration: 'Supabase Realtime',
        status: connected ? 'success' : 'partial',
        message: connected ? 'Realtime connection established' : 'Realtime connection timeout',
        recommendations: connected ? [] : [
          'Check if Realtime is enabled in Supabase dashboard',
          'Verify WebSocket connectivity'
        ]
      };
    } catch (error) {
      return {
        integration: 'Supabase Realtime',
        status: 'failure',
        message: `Realtime error: ${error}`,
        recommendations: ['Enable Realtime in Supabase project settings']
      };
    }
  }

  async testSupabaseStorage(): Promise<TestResult> {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        return {
          integration: 'Supabase Storage',
          status: 'failure',
          message: `Storage access failed: ${error.message}`,
          recommendations: [
            'Enable Storage in Supabase dashboard',
            'Check storage permissions'
          ]
        };
      }

      const buckets = data || [];
      const requiredBuckets = ['mail-scans', 'documents', 'attachments'];
      const missingBuckets = requiredBuckets.filter(
        b => !buckets.some(bucket => bucket.name === b)
      );

      if (missingBuckets.length > 0) {
        return {
          integration: 'Supabase Storage',
          status: 'partial',
          message: 'Storage accessible but missing required buckets',
          details: { missingBuckets },
          recommendations: [
            `Create missing buckets: ${missingBuckets.join(', ')}`,
            'Run storage migration scripts'
          ]
        };
      }

      return {
        integration: 'Supabase Storage',
        status: 'success',
        message: 'Storage configured correctly',
        details: { buckets: buckets.map(b => b.name) }
      };
    } catch (error) {
      return {
        integration: 'Supabase Storage',
        status: 'failure',
        message: `Storage error: ${error}`,
        recommendations: ['Check Supabase Storage configuration']
      };
    }
  }

  // 2. PAYMENT PROCESSING TESTS
  async testATHMovilIntegration(): Promise<TestResult> {
    const athToken = import.meta.env.VITE_ATH_MOVIL_TOKEN;
    const athApiKey = import.meta.env.VITE_ATH_MOVIL_API_KEY;

    if (!athToken || !athApiKey) {
      return {
        integration: 'ATH Móvil',
        status: 'failure',
        message: 'ATH Móvil credentials not configured',
        recommendations: [
          'Set VITE_ATH_MOVIL_TOKEN in environment variables',
          'Set VITE_ATH_MOVIL_API_KEY in environment variables',
          'Contact ATH Móvil for merchant credentials'
        ]
      };
    }

    // Simulate API health check (actual implementation would call ATH API)
    return {
      integration: 'ATH Móvil',
      status: 'partial',
      message: 'Credentials configured, live test pending',
      details: {
        hasToken: !!athToken,
        hasApiKey: !!athApiKey
      },
      recommendations: [
        'Implement ATH Móvil webhook endpoint',
        'Test QR code generation in sandbox',
        'Configure webhook secret for signature validation'
      ]
    };
  }

  async testStripeIntegration(): Promise<TestResult> {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    
    if (!stripeKey) {
      return {
        integration: 'Stripe',
        status: 'failure',
        message: 'Stripe not configured',
        recommendations: [
          'Set VITE_STRIPE_PUBLISHABLE_KEY in environment',
          'Configure Stripe webhook endpoint',
          'Set up Stripe Connect for multi-location support'
        ]
      };
    }

    return {
      integration: 'Stripe',
      status: 'partial',
      message: 'Stripe publishable key found, server-side verification needed',
      details: {
        hasPublishableKey: true,
        keyPrefix: stripeKey.substring(0, 7) // pk_test_ or pk_live_
      },
      recommendations: [
        'Add server-side Stripe secret key to Edge Functions',
        'Configure webhook endpoint for payment events',
        'Set up Stripe Radar for fraud protection'
      ]
    };
  }

  // 3. CARRIER INTEGRATION TESTS
  async testUSPSIntegration(): Promise<TestResult> {
    const uspsUserId = import.meta.env.VITE_USPS_USER_ID;
    
    if (!uspsUserId) {
      return {
        integration: 'USPS',
        status: 'failure',
        message: 'USPS Web Tools credentials missing',
        recommendations: [
          'Register at https://registration.shippingapis.com/',
          'Set VITE_USPS_USER_ID in environment',
          'Request production access from USPS'
        ]
      };
    }

    return {
      integration: 'USPS',
      status: 'partial',
      message: 'USPS credentials configured',
      details: { hasUserId: true },
      recommendations: [
        'Implement XML parsing for USPS responses',
        'Add Puerto Rico-specific address validation',
        'Set up tracking number format validation'
      ]
    };
  }

  async testFedExIntegration(): Promise<TestResult> {
    const clientId = import.meta.env.VITE_FEDEX_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_FEDEX_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return {
        integration: 'FedEx',
        status: 'failure',
        message: 'FedEx API credentials missing',
        recommendations: [
          'Register for FedEx Developer Portal',
          'Set VITE_FEDEX_CLIENT_ID and VITE_FEDEX_CLIENT_SECRET',
          'Request production credentials after testing'
        ]
      };
    }

    return {
      integration: 'FedEx',
      status: 'partial',
      message: 'FedEx credentials configured',
      details: { hasCredentials: true },
      recommendations: [
        'Implement OAuth token caching',
        'Add retry logic for API calls',
        'Configure webhook for tracking updates'
      ]
    };
  }

  async testUPSIntegration(): Promise<TestResult> {
    const clientId = import.meta.env.VITE_UPS_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_UPS_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return {
        integration: 'UPS',
        status: 'failure',
        message: 'UPS API credentials missing',
        recommendations: [
          'Create UPS Developer account',
          'Set VITE_UPS_CLIENT_ID and VITE_UPS_CLIENT_SECRET',
          'Apply for production access'
        ]
      };
    }

    return {
      integration: 'UPS',
      status: 'partial',
      message: 'UPS credentials configured',
      details: { hasCredentials: true },
      recommendations: [
        'Implement OAuth 2.0 flow',
        'Add transaction ID generation',
        'Configure Puerto Rico service availability check'
      ]
    };
  }

  // 4. GOVERNMENT SYSTEM TESTS
  async testSURIIntegration(): Promise<TestResult> {
    const suriApiKey = import.meta.env.VITE_SURI_API_KEY;
    const merchantReg = import.meta.env.VITE_MERCHANT_REGISTRATION;
    
    if (!suriApiKey || !merchantReg) {
      return {
        integration: 'SURI (PR Tax System)',
        status: 'failure',
        message: 'SURI integration not configured',
        recommendations: [
          'Contact Hacienda for API access',
          'Set VITE_SURI_API_KEY after approval',
          'Configure merchant registration number',
          'Implement IVU calculation logic'
        ]
      };
    }

    return {
      integration: 'SURI (PR Tax System)',
      status: 'partial',
      message: 'SURI credentials found',
      details: { hasApiKey: true, hasMerchantReg: true },
      recommendations: [
        'Test merchant validation endpoint',
        'Implement monthly IVU filing automation',
        'Add Act 60 exemption handling'
      ]
    };
  }

  // 5. NOTIFICATION SERVICE TESTS
  async testTwilioIntegration(): Promise<TestResult> {
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const phoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !phoneNumber) {
      return {
        integration: 'Twilio SMS',
        status: 'failure',
        message: 'Twilio credentials missing',
        recommendations: [
          'Create Twilio account',
          'Set VITE_TWILIO_ACCOUNT_SID, AUTH_TOKEN, and PHONE_NUMBER',
          'Purchase Puerto Rico phone number (+1-787 or +1-939)',
          'Configure messaging service for PR carriers'
        ]
      };
    }

    return {
      integration: 'Twilio SMS',
      status: 'partial',
      message: 'Twilio credentials configured',
      details: { 
        hasCredentials: true,
        phonePrefix: phoneNumber.substring(0, 6)
      },
      recommendations: [
        'Test with Puerto Rico phone numbers',
        'Implement bilingual message templates',
        'Add delivery status webhook',
        'Configure carrier-specific optimizations'
      ]
    };
  }

  async testEmailIntegration(): Promise<TestResult> {
    // Check for email service configuration (SendGrid, AWS SES, etc.)
    const sendgridKey = import.meta.env.VITE_SENDGRID_API_KEY;
    const fromEmail = import.meta.env.VITE_FROM_EMAIL;
    
    if (!sendgridKey && !fromEmail) {
      return {
        integration: 'Email Service',
        status: 'failure',
        message: 'No email service configured',
        recommendations: [
          'Configure SendGrid or AWS SES',
          'Set up domain authentication',
          'Configure FROM email address',
          'Create bilingual email templates'
        ]
      };
    }

    return {
      integration: 'Email Service',
      status: 'partial',
      message: 'Email configuration found',
      details: { hasApiKey: !!sendgridKey, hasFromEmail: !!fromEmail },
      recommendations: [
        'Verify domain authentication',
        'Test email deliverability',
        'Implement bounce/complaint handling',
        'Add email tracking'
      ]
    };
  }

  // 6. BARCODE/SCANNING TESTS
  async testBarcodeScanning(): Promise<TestResult> {
    // Check if camera permissions and barcode libraries are available
    const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    
    return {
      integration: 'Barcode Scanning',
      status: hasCamera ? 'partial' : 'failure',
      message: hasCamera ? 'Camera API available' : 'Camera API not available',
      details: { 
        hasCameraAPI: hasCamera,
        isSecureContext: window.isSecureContext
      },
      recommendations: hasCamera ? [
        'Implement ZXing or QuaggaJS for barcode scanning',
        'Add camera permission request flow',
        'Support multiple barcode formats (Code128, QR, etc.)',
        'Add manual entry fallback'
      ] : [
        'Ensure HTTPS is enabled',
        'Test on actual devices',
        'Implement file upload fallback'
      ]
    };
  }

  // 7. PWA/OFFLINE TESTS
  async testPWACapabilities(): Promise<TestResult> {
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasIndexedDB = 'indexedDB' in window;
    const hasCacheAPI = 'caches' in window;
    
    let swRegistered = false;
    if (hasServiceWorker) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      swRegistered = registrations.length > 0;
    }

    const allFeatures = hasServiceWorker && hasIndexedDB && hasCacheAPI;
    
    return {
      integration: 'PWA/Offline',
      status: allFeatures && swRegistered ? 'success' : 'partial',
      message: swRegistered ? 'PWA features active' : 'PWA features available but not fully configured',
      details: {
        hasServiceWorker,
        hasIndexedDB,
        hasCacheAPI,
        swRegistered
      },
      recommendations: swRegistered ? [
        'Test offline data sync',
        'Implement background sync',
        'Add push notification support'
      ] : [
        'Verify service worker registration',
        'Configure offline caching strategy',
        'Test on mobile devices'
      ]
    };
  }

  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    console.log('Starting PRMCMS Integration Tests...');
    
    // Supabase tests
    this.results.push(await this.testSupabaseConnection());
    this.results.push(await this.testSupabaseAuth());
    this.results.push(await this.testSupabaseRealtime());
    this.results.push(await this.testSupabaseStorage());
    
    // Payment tests
    this.results.push(await this.testATHMovilIntegration());
    this.results.push(await this.testStripeIntegration());
    
    // Carrier tests
    this.results.push(await this.testUSPSIntegration());
    this.results.push(await this.testFedExIntegration());
    this.results.push(await this.testUPSIntegration());
    
    // Government tests
    this.results.push(await this.testSURIIntegration());
    
    // Notification tests
    this.results.push(await this.testTwilioIntegration());
    this.results.push(await this.testEmailIntegration());
    
    // Other tests
    this.results.push(await this.testBarcodeScanning());
    this.results.push(await this.testPWACapabilities());
    
    return this.results;
  }

  // Generate summary report
  generateReport(): string {
    const summary = {
      total: this.results.length,
      successful: this.results.filter(r => r.status === 'success').length,
      partial: this.results.filter(r => r.status === 'partial').length,
      failed: this.results.filter(r => r.status === 'failure').length
    };

    let report = `
PRMCMS Integration Test Report
==============================
Date: ${new Date().toISOString()}

Summary:
--------
Total Tests: ${summary.total}
✅ Successful: ${summary.successful}
⚠️  Partial: ${summary.partial}
❌ Failed: ${summary.failed}

Detailed Results:
-----------------
`;

    this.results.forEach(result => {
      const icon = result.status === 'success' ? '✅' : 
                   result.status === 'partial' ? '⚠️' : '❌';
      
      report += `\n${icon} ${result.integration}\n`;
      report += `   Status: ${result.status}\n`;
      report += `   Message: ${result.message}\n`;
      
      if (result.details) {
        report += `   Details: ${JSON.stringify(result.details, null, 2)}\n`;
      }
      
      if (result.recommendations && result.recommendations.length > 0) {
        report += `   Recommendations:\n`;
        result.recommendations.forEach(rec => {
          report += `   - ${rec}\n`;
        });
      }
    });

    report += `\n\nPriority Actions:\n`;
    report += `-----------------\n`;
    
    // Prioritize failed integrations
    const failedIntegrations = this.results.filter(r => r.status === 'failure');
    if (failedIntegrations.length > 0) {
      report += `\n1. Fix Critical Failures:\n`;
      failedIntegrations.forEach(result => {
        report += `   - ${result.integration}: ${result.recommendations?.[0] || result.message}\n`;
      });
    }

    // Then partial integrations
    const partialIntegrations = this.results.filter(r => r.status === 'partial');
    if (partialIntegrations.length > 0) {
      report += `\n2. Complete Partial Integrations:\n`;
      partialIntegrations.forEach(result => {
        report += `   - ${result.integration}: ${result.recommendations?.[0] || result.message}\n`;
      });
    }

    return report;
  }
}

// Export for use in components or CLI
export const integrationTester = new IntegrationTester();

// Function to run tests and display results
export async function runIntegrationTests(): Promise<void> {
  const tester = new IntegrationTester();
  const results = await tester.runAllTests();
  const report = tester.generateReport();
  
  console.log(report);
  
  // Return results for UI display if needed
  return results as any;
}

// Check if running in development
if (import.meta.env.DEV) {
  // Add to window for easy console access
  (window as any).runIntegrationTests = runIntegrationTests;
  console.log('Integration tests available. Run: window.runIntegrationTests()');
}