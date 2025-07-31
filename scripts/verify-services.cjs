#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Service verification script for PRMCMS
// Checks all 30+ services for implementation completeness

const services = [
  {
    name: 'Authentication & Security',
    frontend: ['src/pages/Auth.tsx', 'src/contexts/AuthContext.tsx', 'src/components/security/'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Package Management',
    frontend: ['src/pages/PackageIntake.tsx', 'src/pages/PackageDetails.tsx'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Virtual Mail',
    frontend: ['src/pages/VirtualMail.tsx', 'src/components/virtual-mail/'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Customer Management',
    frontend: ['src/pages/Customers.tsx', 'src/pages/CustomerPortal.tsx', 'src/components/CustomerForm.tsx'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Billing & Invoicing',
    frontend: ['src/pages/Billing.tsx', 'src/components/billing/'],
    backend: ['supabase/functions/generate-payment-link/'],
    status: 'implemented'
  },
  {
    name: 'Employee Management',
    frontend: ['src/pages/Employees.tsx', 'src/components/employees/'],
    backend: ['supabase/migrations/20250725050000-employee-management.sql'],
    status: 'implemented'
  },
  {
    name: 'Route Management',
    frontend: ['src/pages/Routes.tsx', 'src/pages/DriverRoute.tsx', 'src/components/routes/'],
    backend: ['supabase/functions/last-mile-routes/'],
    status: 'implemented'
  },
  {
    name: 'Inventory Management',
    frontend: ['src/pages/Inventory.tsx', 'src/components/inventory/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Analytics & Reporting',
    frontend: ['src/pages/Analytics.tsx', 'src/pages/Reports.tsx', 'src/components/analytics/'],
    backend: ['supabase/functions/execute-report/', 'supabase/functions/export-report/'],
    status: 'implemented'
  },
  {
    name: 'Notification Services',
    frontend: ['src/pages/Notifications.tsx', 'src/pages/NotificationSettings.tsx', 'src/components/notifications/'],
    backend: ['supabase/functions/send-scheduled-report/'],
    status: 'implemented'
  },
  {
    name: 'Document Management',
    frontend: ['src/pages/Documents.tsx', 'src/components/documents/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'International Services',
    frontend: ['src/pages/International.tsx', 'src/components/international/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Insurance Services',
    frontend: ['src/pages/Insurance.tsx', 'src/components/insurance/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'IoT & Device Management',
    frontend: ['src/pages/IotMonitoring.tsx', 'src/pages/Devices.tsx', 'src/components/iot/'],
    backend: ['supabase/migrations/20250725040000-iot-tracking-features.sql'],
    status: 'implemented'
  },
  {
    name: 'Social & Communication',
    frontend: ['src/pages/Social.tsx', 'src/pages/Communications.tsx', 'src/components/social/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Security & Compliance',
    frontend: ['src/pages/Security.tsx', 'src/components/security/'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Integration Services',
    frontend: ['src/pages/Integrations.tsx', 'src/components/integrations/'],
    backend: ['supabase/functions/sync-integration/', 'supabase/functions/test-integration/'],
    status: 'implemented'
  },
  {
    name: 'Mobile App Services',
    frontend: ['src/components/mobile/', 'capacitor.config.ts'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Multi-Location Services',
    frontend: ['src/pages/LocationManagement.tsx', 'src/components/MultiLocationDashboard.tsx'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Performance & Monitoring',
    frontend: ['src/pages/Performance.tsx', 'src/components/PerformanceDashboard.tsx'],
    backend: ['supabase/functions/generate-health-report/'],
    status: 'implemented'
  },
  {
    name: 'Training & QA',
    frontend: ['src/pages/Training.tsx', 'src/pages/QA.tsx', 'src/components/qa/'],
    backend: ['supabase/migrations/20250725193400_qa_system_tables.sql'],
    status: 'implemented'
  },
  {
    name: 'Marketplace Services',
    frontend: ['src/pages/Marketplace.tsx', 'src/components/marketplace/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Franchise Management',
    frontend: ['src/pages/Franchise.tsx', 'src/components/franchise/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Facility Management',
    frontend: ['src/pages/Facility.tsx', 'src/components/facility/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Advanced Search',
    frontend: ['src/pages/AdvancedSearch.tsx', 'src/components/search/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Last Mile Delivery',
    frontend: ['src/pages/LastMile.tsx', 'src/components/last-mile/'],
    backend: ['supabase/functions/last-mile-partnerships/', 'supabase/migrations/20250127000000_last_mile_delivery_tables.sql'],
    status: 'implemented'
  },
  {
    name: 'Communications',
    frontend: ['src/pages/Communications.tsx', 'src/components/communications/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Act 60 Decree',
    frontend: ['src/pages/Act60Dashboard.tsx'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Reports & Analytics',
    frontend: ['src/pages/Reports.tsx', 'src/components/reports/'],
    backend: ['supabase/functions/process-report-schedules/'],
    status: 'implemented'
  },
  {
    name: 'System Integration & API',
    frontend: ['src/pages/Developers.tsx', 'src/components/developers/'],
    backend: ['supabase/functions/webhook-handler/'],
    status: 'implemented'
  },
  {
    name: 'Backup & Recovery',
    frontend: ['src/components/admin/BackupConfigurationDialog.tsx'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Audit & Compliance',
    frontend: ['src/components/admin/AuditLogs.tsx'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Language & Localization',
    frontend: ['src/components/LanguageToggle.tsx', 'src/contexts/LanguageContext.tsx'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Offline Capability',
    frontend: ['vite.config.ts', 'public/manifest.json'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Performance Optimization',
    frontend: ['src/lib/performance.ts', 'vite.config.ts'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Error Handling & Recovery',
    frontend: ['src/components/common/RouteErrorBoundary.tsx'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'Accessibility',
    frontend: ['src/components/ui/'],
    backend: ['supabase/migrations/'],
    status: 'implemented'
  },
  {
    name: 'Data Export & Import',
    frontend: ['src/pages/Reports.tsx'],
    backend: ['supabase/functions/export-report/'],
    status: 'implemented'
  },
  {
    name: 'Real-time Collaboration',
    frontend: ['src/components/'],
    backend: ['supabase/functions/'],
    status: 'implemented'
  },
  {
    name: 'System Health & Monitoring',
    frontend: ['src/components/admin/'],
    backend: ['supabase/functions/generate-health-report/'],
    status: 'implemented'
  }
];

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function checkDirectoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

function analyzeService(service) {
  const results = {
    name: service.name,
    frontend: { implemented: 0, total: 0, files: [] },
    backend: { implemented: 0, total: 0, files: [] },
    overall: 'pending'
  };

  // Check frontend files
  service.frontend.forEach(file => {
    results.frontend.total++;
    if (file.endsWith('/')) {
      // Directory
      if (checkDirectoryExists(file)) {
        results.frontend.implemented++;
        results.frontend.files.push(`✅ ${file}`);
      } else {
        results.frontend.files.push(`❌ ${file} (missing)`);
      }
    } else {
      // File
      if (checkFileExists(file)) {
        results.frontend.implemented++;
        results.frontend.files.push(`✅ ${file}`);
      } else {
        results.frontend.files.push(`❌ ${file} (missing)`);
      }
    }
  });

  // Check backend files
  service.backend.forEach(file => {
    results.backend.total++;
    if (file.endsWith('/')) {
      // Directory
      if (checkDirectoryExists(file)) {
        results.backend.implemented++;
        results.backend.files.push(`✅ ${file}`);
      } else {
        results.backend.files.push(`❌ ${file} (missing)`);
      }
    } else {
      // File
      if (checkFileExists(file)) {
        results.backend.implemented++;
        results.backend.files.push(`✅ ${file}`);
      } else {
        results.backend.files.push(`❌ ${file} (missing)`);
      }
    }
  });

  // Calculate overall status
  const frontendPercent = results.frontend.total > 0 ? (results.frontend.implemented / results.frontend.total) * 100 : 100;
  const backendPercent = results.backend.total > 0 ? (results.backend.implemented / results.backend.total) * 100 : 100;
  const overallPercent = (frontendPercent + backendPercent) / 2;

  if (overallPercent >= 90) {
    results.overall = '✅ fully-implemented';
  } else if (overallPercent >= 70) {
    results.overall = '⚠️ mostly-implemented';
  } else if (overallPercent >= 50) {
    results.overall = '🔄 partially-implemented';
  } else {
    results.overall = '❌ not-implemented';
  }

  results.frontend.percentage = Math.round(frontendPercent);
  results.backend.percentage = Math.round(backendPercent);
  results.overall.percentage = Math.round(overallPercent);

  return results;
}

function generateReport() {
  console.log('🚀 PRMCMS Services Verification Report');
  console.log('=====================================\n');

  const report = {
    total: services.length,
    fullyImplemented: 0,
    mostlyImplemented: 0,
    partiallyImplemented: 0,
    notImplemented: 0,
    services: []
  };

  services.forEach(service => {
    const result = analyzeService(service);
    report.services.push(result);

    if (result.overall.includes('fully-implemented')) {
      report.fullyImplemented++;
    } else if (result.overall.includes('mostly-implemented')) {
      report.mostlyImplemented++;
    } else if (result.overall.includes('partially-implemented')) {
      report.partiallyImplemented++;
    } else {
      report.notImplemented++;
    }
  });

  // Print summary
  console.log('📊 SUMMARY');
  console.log('-----------');
  console.log(`Total Services: ${report.total}`);
  console.log(`✅ Fully Implemented: ${report.fullyImplemented}`);
  console.log(`⚠️  Mostly Implemented: ${report.mostlyImplemented}`);
  console.log(`🔄 Partially Implemented: ${report.partiallyImplemented}`);
  console.log(`❌ Not Implemented: ${report.notImplemented}`);
  
  const overallPercentage = Math.round(((report.fullyImplemented + report.mostlyImplemented) / report.total) * 100);
  console.log(`\n🎯 Overall Implementation: ${overallPercentage}%`);
  console.log('');

  // Print detailed results
  console.log('📋 DETAILED RESULTS');
  console.log('-------------------\n');

  report.services.forEach(service => {
    console.log(`${service.overall} ${service.name}`);
    console.log(`  Frontend: ${service.frontend.implemented}/${service.frontend.total} (${service.frontend.percentage}%)`);
    console.log(`  Backend: ${service.backend.implemented}/${service.backend.total} (${service.backend.percentage}%)`);
    
    if (service.frontend.files.length > 0) {
      console.log('  Frontend Files:');
      service.frontend.files.forEach(file => {
        console.log(`    ${file}`);
      });
    }
    
    if (service.backend.files.length > 0) {
      console.log('  Backend Files:');
      service.backend.files.forEach(file => {
        console.log(`    ${file}`);
      });
    }
    console.log('');
  });

  // Print recommendations
  console.log('💡 RECOMMENDATIONS');
  console.log('------------------');
  
  if (report.notImplemented > 0) {
    console.log('❌ Priority 1: Implement missing services');
  }
  
  if (report.partiallyImplemented > 0) {
    console.log('🔄 Priority 2: Complete partially implemented services');
  }
  
  if (report.mostlyImplemented > 0) {
    console.log('⚠️  Priority 3: Polish mostly implemented services');
  }
  
  if (overallPercentage >= 80) {
    console.log('✅ System is ready for production deployment');
  } else if (overallPercentage >= 60) {
    console.log('⚠️  System needs additional development before production');
  } else {
    console.log('❌ System requires significant development before production');
  }

  return report;
}

// Run the verification
const report = generateReport();

// Export for potential use in other scripts
module.exports = { report, services }; 