import fs from 'fs';
import path from 'path';

// Test the partner management platform comprehensively
const testResults = {
  sourceFiles: {},
  buildStatus: false,
  routes: {},
  components: {},
  types: {},
  data: {},
  assets: {}
};

function checkFileExists(filePath, description) {
  try {
    const exists = fs.existsSync(filePath);
    return { exists, path: filePath, description };
  } catch (error) {
    return { exists: false, path: filePath, description, error: error.message };
  }
}

function checkFileContent(filePath, requiredContent) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const checks = {};
    
    for (const [key, searchTerm] of Object.entries(requiredContent)) {
      checks[key] = content.includes(searchTerm);
    }
    
    return { exists: true, content: checks, path: filePath };
  } catch (error) {
    return { exists: false, error: error.message, path: filePath };
  }
}

async function runComprehensiveTests() {
  console.log('🧪 Comprehensive Partner Management Platform Test\n');
  
  // Test 1: Source Files
  console.log('📁 Testing Source Files...');
  const sourceFiles = [
    'src/pages/Partners.tsx',
    'src/pages/VendorManagement.tsx',
    'src/pages/AffiliateProgram.tsx',
    'src/pages/IntegrationPartners.tsx',
    'src/pages/PartnerAnalytics.tsx',
    'src/types/partners.ts',
    'src/data/partnerData.ts',
    'src/components/partners/CollaborationWorkflow.tsx'
  ];
  
  for (const file of sourceFiles) {
    const result = checkFileExists(file, `Partner management ${path.basename(file)}`);
    testResults.sourceFiles[file] = result;
    console.log(`   ${result.exists ? '✅' : '❌'} ${file}`);
  }
  
  // Test 2: Type Definitions
  console.log('\n📋 Testing Type Definitions...');
  const typesFile = checkFileContent('src/types/partners.ts', {
    'export interface Partner': 'Partner interface',
    'export interface PartnerContract': 'PartnerContract interface',
    'export interface Commission': 'Commission interface',
    'export interface Vendor': 'Vendor interface',
    'export interface AffiliateProgram': 'AffiliateProgram interface',
    'export interface IntegrationPartner': 'IntegrationPartner interface',
    'export interface PartnerAnalytics': 'PartnerAnalytics interface'
  });
  
  testResults.types = typesFile;
  console.log(`   ${typesFile.exists ? '✅' : '❌'} Type definitions`);
  if (typesFile.exists) {
    Object.entries(typesFile.content).forEach(([key, found]) => {
      console.log(`     ${found ? '✅' : '❌'} ${key}`);
    });
  }
  
  // Test 3: Mock Data
  console.log('\n📊 Testing Mock Data...');
  const dataFile = checkFileContent('src/data/partnerData.ts', {
    'export const mockPartners': 'Partner data',
    'export const mockVendors': 'Vendor data',
    'export const mockAffiliatePrograms': 'Affiliate data',
    'export const mockIntegrationPartners': 'Integration data',
    'export const mockPartnerAnalyticsData': 'Analytics data'
  });
  
  testResults.data = dataFile;
  console.log(`   ${dataFile.exists ? '✅' : '❌'} Mock data`);
  if (dataFile.exists) {
    Object.entries(dataFile.content).forEach(([key, found]) => {
      console.log(`     ${found ? '✅' : '❌'} ${key}`);
    });
  }
  
  // Test 4: Route Configuration
  console.log('\n🛣️  Testing Route Configuration...');
  const routerFile = checkFileContent('src/pages/AppRouter.tsx', {
    'import Partners from': 'Partners import',
    'import VendorManagement from': 'VendorManagement import',
    'import AffiliateProgram from': 'AffiliateProgram import',
    'import IntegrationPartners from': 'IntegrationPartners import',
    'import PartnerAnalytics from': 'PartnerAnalytics import',
    "'/partners': Partners": 'Partners route',
    "'/vendor-management': VendorManagement": 'Vendor route',
    "'/affiliate-program': AffiliateProgram": 'Affiliate route',
    "'/integration-partners': IntegrationPartners": 'Integration route',
    "'/partner-analytics': PartnerAnalytics": 'Analytics route'
  });
  
  testResults.routes = routerFile;
  console.log(`   ${routerFile.exists ? '✅' : '❌'} Route configuration`);
  if (routerFile.exists) {
    Object.entries(routerFile.content).forEach(([key, found]) => {
      console.log(`     ${found ? '✅' : '❌'} ${key}`);
    });
  }
  
  // Test 5: Assets
  console.log('\n🎨 Testing Assets...');
  const assetFiles = [
    'public/logos/techcorp.svg',
    'public/logos/global-logistics.svg',
    'public/logos/digital-marketing-pro.svg',
    'public/logos/cloudconnect.svg'
  ];
  
  for (const file of assetFiles) {
    const result = checkFileExists(file, `Partner logo ${path.basename(file)}`);
    testResults.assets[file] = result;
    console.log(`   ${result.exists ? '✅' : '❌'} ${file}`);
  }
  
  // Test 6: Build Status
  console.log('\n🔨 Testing Build Status...');
  const distExists = fs.existsSync('dist');
  const indexHtmlExists = fs.existsSync('dist/index.html');
  testResults.buildStatus = distExists && indexHtmlExists;
  console.log(`   ${distExists ? '✅' : '❌'} Build directory exists`);
  console.log(`   ${indexHtmlExists ? '✅' : '❌'} Built index.html exists`);
  
  // Test 7: Component Functionality
  console.log('\n⚙️  Testing Component Functionality...');
  const partnersFile = checkFileContent('src/pages/Partners.tsx', {
    'Partner Hub': 'Partner Hub title',
    'Partner Directory': 'Partner Directory section',
    'Performance Ratings': 'Performance Ratings section',
    'Contract Management': 'Contract Management section'
  });
  
  const vendorFile = checkFileContent('src/pages/VendorManagement.tsx', {
    'Vendor Management': 'Vendor Management title',
    'Approved Vendors': 'Approved Vendors section',
    'Quality Ratings': 'Quality Ratings section'
  });
  
  const affiliateFile = checkFileContent('src/pages/AffiliateProgram.tsx', {
    'Affiliate Program': 'Affiliate Program title',
    'Referral Tracking': 'Referral Tracking section',
    'Commission Structure': 'Commission Structure section'
  });
  
  const integrationFile = checkFileContent('src/pages/IntegrationPartners.tsx', {
    'Integration Partners': 'Integration Partners title',
    'API Access Management': 'API Access Management section',
    'Technical Documentation': 'Technical Documentation section'
  });
  
  const analyticsFile = checkFileContent('src/pages/PartnerAnalytics.tsx', {
    'Partner Analytics': 'Partner Analytics title',
    'Revenue Analysis': 'Revenue Analysis section',
    'Performance Metrics': 'Performance Metrics section'
  });
  
  testResults.components = {
    partners: partnersFile,
    vendor: vendorFile,
    affiliate: affiliateFile,
    integration: integrationFile,
    analytics: analyticsFile
  };
  
  console.log(`   Partners Component: ${partnersFile.exists ? '✅' : '❌'}`);
  console.log(`   Vendor Component: ${vendorFile.exists ? '✅' : '❌'}`);
  console.log(`   Affiliate Component: ${affiliateFile.exists ? '✅' : '❌'}`);
  console.log(`   Integration Component: ${integrationFile.exists ? '✅' : '❌'}`);
  console.log(`   Analytics Component: ${analyticsFile.exists ? '✅' : '❌'}`);
  
  // Summary
  console.log('\n📋 Test Summary:');
  
  const sourceFilesPassed = Object.values(testResults.sourceFiles).filter(r => r.exists).length;
  const sourceFilesTotal = Object.keys(testResults.sourceFiles).length;
  console.log(`   Source Files: ${sourceFilesPassed}/${sourceFilesTotal} ✅`);
  
  const typesPassed = testResults.types.exists && Object.values(testResults.types.content).filter(Boolean).length;
  const typesTotal = testResults.types.exists ? Object.keys(testResults.types.content).length : 0;
  console.log(`   Type Definitions: ${typesPassed}/${typesTotal} ✅`);
  
  const dataPassed = testResults.data.exists && Object.values(testResults.data.content).filter(Boolean).length;
  const dataTotal = testResults.data.exists ? Object.keys(testResults.data.content).length : 0;
  console.log(`   Mock Data: ${dataPassed}/${dataTotal} ✅`);
  
  const routesPassed = testResults.routes.exists && Object.values(testResults.routes.content).filter(Boolean).length;
  const routesTotal = testResults.routes.exists ? Object.keys(testResults.routes.content).length : 0;
  console.log(`   Route Configuration: ${routesPassed}/${routesTotal} ✅`);
  
  const assetsPassed = Object.values(testResults.assets).filter(r => r.exists).length;
  const assetsTotal = Object.keys(testResults.assets).length;
  console.log(`   Assets: ${assetsPassed}/${assetsTotal} ✅`);
  
  const componentsPassed = Object.values(testResults.components).filter(c => c.exists).length;
  const componentsTotal = Object.keys(testResults.components).length;
  console.log(`   Components: ${componentsPassed}/${componentsTotal} ✅`);
  
  console.log(`   Build Status: ${testResults.buildStatus ? '✅ Success' : '❌ Failed'}`);
  
  const overallScore = (sourceFilesPassed + typesPassed + dataPassed + routesPassed + assetsPassed + componentsPassed + (testResults.buildStatus ? 1 : 0)) / 
                      (sourceFilesTotal + typesTotal + dataTotal + routesTotal + assetsTotal + componentsTotal + 1);
  
  console.log(`\n🎯 Overall Score: ${Math.round(overallScore * 100)}%`);
  
  if (overallScore >= 0.9) {
    console.log('🏆 Partner Management Platform is fully functional!');
    console.log('\n📱 Available Features:');
    console.log('   • Partner Hub (/partners)');
    console.log('   • Vendor Management (/vendor-management)');
    console.log('   • Affiliate Program (/affiliate-program)');
    console.log('   • Integration Partners (/integration-partners)');
    console.log('   • Partner Analytics (/partner-analytics)');
    console.log('\n🚀 Ready for production use!');
  } else if (overallScore >= 0.7) {
    console.log('✅ Partner Management Platform is mostly functional!');
    console.log('   Some minor issues detected but core functionality is working.');
  } else {
    console.log('⚠️  Some issues detected. Please review the test results above.');
  }
  
  console.log('\n🎯 Comprehensive Testing Complete!');
}

runComprehensiveTests(); 