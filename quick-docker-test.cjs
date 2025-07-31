const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🧪 Quick Docker Test for Partner Management Platform');
console.log('==================================================');

// Test 1: Check if Docker is available
console.log('\n1. Checking Docker availability...');
exec('docker --version', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Docker is not available:', error.message);
    return;
  }
  console.log('✅ Docker is available:', stdout.trim());
  
  // Test 2: Check if Docker Compose is available
  console.log('\n2. Checking Docker Compose availability...');
  exec('docker-compose --version', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Docker Compose is not available:', error.message);
      return;
    }
    console.log('✅ Docker Compose is available:', stdout.trim());
    
    // Test 3: Check if docker-compose.yml exists
    console.log('\n3. Checking Docker Compose configuration...');
    if (fs.existsSync('docker-compose.yml')) {
      console.log('✅ docker-compose.yml found');
      
      // Test 4: Check if backend setup exists
      console.log('\n4. Checking backend API setup...');
      if (fs.existsSync('backend-api-setup/package.json')) {
        console.log('✅ Backend API setup found');
        
        // Test 5: Check if frontend build exists
        console.log('\n5. Checking frontend build...');
        if (fs.existsSync('dist/index.html')) {
          console.log('✅ Frontend build found');
          
          // Test 6: Try to start services
          console.log('\n6. Starting Docker services...');
          exec('docker-compose up -d', (error, stdout, stderr) => {
            if (error) {
              console.log('❌ Failed to start Docker services:', error.message);
              return;
            }
            console.log('✅ Docker services started');
            
            // Test 7: Wait and check health
            console.log('\n7. Waiting for services to be ready...');
            setTimeout(() => {
              checkServiceHealth();
            }, 10000);
          });
        } else {
          console.log('❌ Frontend build not found');
        }
      } else {
        console.log('❌ Backend API setup not found');
      }
    } else {
      console.log('❌ docker-compose.yml not found');
    }
  });
});

function checkServiceHealth() {
  console.log('\n8. Checking service health...');
  
  // Check frontend
  http.get('http://localhost/health', (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Frontend health check passed');
    } else {
      console.log('❌ Frontend health check failed');
    }
  }).on('error', () => {
    console.log('❌ Frontend not accessible');
  });
  
  // Check backend API
  http.get('http://localhost:3000/health', (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Backend API health check passed');
    } else {
      console.log('❌ Backend API health check failed');
    }
  }).on('error', () => {
    console.log('❌ Backend API not accessible');
  });
  
  // Check container status
  exec('docker-compose ps', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Failed to check container status:', error.message);
      return;
    }
    console.log('\n📊 Container Status:');
    console.log(stdout);
    
    // Final summary
    console.log('\n🎉 Quick Docker Test Complete!');
    console.log('\n📱 Access URLs:');
    console.log('  Frontend:     http://localhost');
    console.log('  Backend API:  http://localhost:3000');
    console.log('  API Docs:     http://localhost:3000/api-docs');
    console.log('\n🔧 Management Commands:');
    console.log('  View logs:    docker-compose logs -f [service]');
    console.log('  Stop:         docker-compose down');
    console.log('  Restart:      docker-compose restart [service]');
  });
} 