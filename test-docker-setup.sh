#!/bin/bash

# Partner Management Platform - Docker Test Script
# This script tests the complete platform in Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_TIMEOUT=120
HEALTH_CHECK_INTERVAL=10

# Logging
LOG_FILE="docker-test-$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${BLUE}🧪 Starting Docker Test for Partner Management Platform${NC}"
echo "Timestamp: $(date)"
echo "Log file: $LOG_FILE"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to wait for service to be ready
wait_for_service() {
    local service=$1
    local url=$2
    local max_attempts=$((TEST_TIMEOUT / HEALTH_CHECK_INTERVAL))
    local attempts=0
    
    print_info "Waiting for $service to be ready..."
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -f "$url" >/dev/null 2>&1; then
            print_status "$service is ready"
            return 0
        fi
        
        attempts=$((attempts + 1))
        sleep $HEALTH_CHECK_INTERVAL
        echo "  Attempt $attempts/$max_attempts..."
    done
    
    print_error "$service failed to start within $TEST_TIMEOUT seconds"
    return 1
}

# Function to test API endpoints
test_api_endpoints() {
    print_info "Testing API endpoints..."
    
    local base_url="http://localhost:3000"
    local endpoints=(
        "/health"
        "/api-docs"
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -f "$base_url$endpoint" >/dev/null 2>&1; then
            print_status "API endpoint $endpoint is working"
        else
            print_error "API endpoint $endpoint failed"
            return 1
        fi
    done
    
    return 0
}

# Function to test frontend
test_frontend() {
    print_info "Testing frontend..."
    
    local frontend_url="http://localhost"
    
    # Test main page
    if curl -f "$frontend_url" >/dev/null 2>&1; then
        print_status "Frontend main page is accessible"
    else
        print_error "Frontend main page failed"
        return 1
    fi
    
    # Test health endpoint
    if curl -f "$frontend_url/health" >/dev/null 2>&1; then
        print_status "Frontend health check passed"
    else
        print_error "Frontend health check failed"
        return 1
    fi
    
    return 0
}

# Function to test database
test_database() {
    print_info "Testing database connection..."
    
    if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        print_status "Database is ready"
    else
        print_error "Database connection failed"
        return 1
    fi
    
    return 0
}

# Function to test Redis
test_redis() {
    print_info "Testing Redis connection..."
    
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_status "Redis is ready"
    else
        print_error "Redis connection failed"
        return 1
    fi
    
    return 0
}

# Function to test WebSocket
test_websocket() {
    print_info "Testing WebSocket connection..."
    
    # Create a simple WebSocket test
    local ws_test_script="
    const WebSocket = require('ws');
    const ws = new WebSocket('ws://localhost:3000/ws/notifications/test?token=test');
    
    ws.on('open', () => {
        console.log('WebSocket connected');
        process.exit(0);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
        process.exit(1);
    });
    
    setTimeout(() => {
        console.error('WebSocket timeout');
        process.exit(1);
    }, 5000);
    "
    
    echo "$ws_test_script" > /tmp/ws-test.js
    
    if node /tmp/ws-test.js >/dev/null 2>&1; then
        print_status "WebSocket connection is working"
        rm -f /tmp/ws-test.js
        return 0
    else
        print_error "WebSocket connection failed"
        rm -f /tmp/ws-test.js
        return 1
    fi
}

# Function to test monitoring
test_monitoring() {
    print_info "Testing monitoring services..."
    
    # Test Prometheus
    if curl -f "http://localhost:9090/-/healthy" >/dev/null 2>&1; then
        print_status "Prometheus is running"
    else
        print_warning "Prometheus health check failed (may still be starting)"
    fi
    
    # Test Grafana
    if curl -f "http://localhost:3001/api/health" >/dev/null 2>&1; then
        print_status "Grafana is running"
    else
        print_warning "Grafana health check failed (may still be starting)"
    fi
    
    return 0
}

# Function to run integration tests
run_integration_tests() {
    print_info "Running integration tests..."
    
    # Test partner API endpoints
    local api_base="http://localhost:3000/api"
    
    # Test GET /api/partners (should return empty array or 401)
    local response=$(curl -s -w "%{http_code}" "$api_base/partners" -o /dev/null)
    if [ "$response" = "200" ] || [ "$response" = "401" ]; then
        print_status "Partners API endpoint is responding"
    else
        print_error "Partners API endpoint failed (HTTP $response)"
        return 1
    fi
    
    # Test API documentation
    if curl -f "$api_base-docs" >/dev/null 2>&1; then
        print_status "API documentation is accessible"
    else
        print_error "API documentation failed"
        return 1
    fi
    
    return 0
}

# Function to check container status
check_container_status() {
    print_info "Checking container status..."
    
    local containers=("frontend" "backend" "postgres" "redis" "nginx" "prometheus" "grafana")
    local all_healthy=true
    
    for container in "${containers[@]}"; do
        if docker-compose ps | grep -q "$container.*Up"; then
            print_status "Container $container is running"
        else
            print_error "Container $container is not running"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        print_status "All containers are running"
        return 0
    else
        print_error "Some containers are not running"
        return 1
    fi
}

# Function to display test results
display_test_results() {
    echo ""
    echo -e "${BLUE}📊 Test Results Summary${NC}"
    echo "================================"
    
    # Check container status
    echo -e "${BLUE}Container Status:${NC}"
    docker-compose ps
    
    echo ""
    echo -e "${BLUE}Service Health:${NC}"
    
    # Frontend
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "  Frontend: ${GREEN}✅ Healthy${NC}"
    else
        echo -e "  Frontend: ${RED}❌ Unhealthy${NC}"
    fi
    
    # Backend API
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        echo -e "  Backend API: ${GREEN}✅ Healthy${NC}"
    else
        echo -e "  Backend API: ${RED}❌ Unhealthy${NC}"
    fi
    
    # Database
    if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "  Database: ${GREEN}✅ Healthy${NC}"
    else
        echo -e "  Database: ${RED}❌ Unhealthy${NC}"
    fi
    
    # Redis
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        echo -e "  Redis: ${GREEN}✅ Healthy${NC}"
    else
        echo -e "  Redis: ${RED}❌ Unhealthy${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}Access URLs:${NC}"
    echo "  Frontend:     http://localhost"
    echo "  Backend API:  http://localhost:3000"
    echo "  API Docs:     http://localhost:3000/api-docs"
    echo "  Grafana:      http://localhost:3001"
    echo "  Prometheus:   http://localhost:9090"
    echo ""
}

# Main test execution
main() {
    print_info "Starting comprehensive Docker test..."
    
    # Set test environment variables
    export DB_PASSWORD="test_password_123"
    export JWT_SECRET="test_jwt_secret_key"
    export REDIS_PASSWORD="test_redis_password"
    export GRAFANA_PASSWORD="admin"
    
    # Stop any existing containers
    print_info "Stopping existing containers..."
    docker-compose down --remove-orphans || true
    
    # Build and start services
    print_info "Building and starting services..."
    docker-compose build --no-cache
    docker-compose up -d
    
    # Wait for services to be ready
    print_info "Waiting for services to start..."
    sleep 30
    
    # Run tests
    local test_results=()
    
    print_info "Running health checks..."
    
    # Test container status
    if check_container_status; then
        test_results+=("containers:pass")
    else
        test_results+=("containers:fail")
    fi
    
    # Test database
    if test_database; then
        test_results+=("database:pass")
    else
        test_results+=("database:fail")
    fi
    
    # Test Redis
    if test_redis; then
        test_results+=("redis:pass")
    else
        test_results+=("redis:fail")
    fi
    
    # Test backend API
    if wait_for_service "Backend API" "http://localhost:3000/health"; then
        if test_api_endpoints; then
            test_results+=("api:pass")
        else
            test_results+=("api:fail")
        fi
    else
        test_results+=("api:fail")
    fi
    
    # Test frontend
    if wait_for_service "Frontend" "http://localhost/health"; then
        if test_frontend; then
            test_results+=("frontend:pass")
        else
            test_results+=("frontend:fail")
        fi
    else
        test_results+=("frontend:fail")
    fi
    
    # Test monitoring (optional)
    if test_monitoring; then
        test_results+=("monitoring:pass")
    else
        test_results+=("monitoring:fail")
    fi
    
    # Test integration
    if run_integration_tests; then
        test_results+=("integration:pass")
    else
        test_results+=("integration:fail")
    fi
    
    # Display results
    display_test_results
    
    # Calculate test results
    local passed=0
    local failed=0
    
    for result in "${test_results[@]}"; do
        if [[ $result == *":pass" ]]; then
            ((passed++))
        else
            ((failed++))
        fi
    done
    
    local total=$((passed + failed))
    local success_rate=$((passed * 100 / total))
    
    echo -e "${BLUE}Test Summary:${NC}"
    echo "  Total tests: $total"
    echo "  Passed: $passed"
    echo "  Failed: $failed"
    echo "  Success rate: $success_rate%"
    
    if [ $failed -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 All tests passed! Partner Management Platform is fully functional in Docker.${NC}"
        echo ""
        echo -e "${BLUE}Next steps:${NC}"
        echo "  1. Access the platform at http://localhost"
        echo "  2. Check API documentation at http://localhost:3000/api-docs"
        echo "  3. Monitor performance at http://localhost:3001 (Grafana)"
        echo "  4. Run production deployment when ready"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Some tests failed. Check the logs for details.${NC}"
        echo "  Log file: $LOG_FILE"
        echo "  Container logs: docker-compose logs [service]"
    fi
    
    echo ""
    echo "Test completed at: $(date)"
    echo "Log file: $LOG_FILE"
}

# Run main function
main "$@" 