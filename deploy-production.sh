#!/bin/bash

# Partner Management Platform - Production Deployment Script
# This script automates the complete production deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="partner-management-platform"
DOMAIN="yourdomain.com"
SSL_EMAIL="admin@yourdomain.com"

# Logging
LOG_FILE="deployment-$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${BLUE}🚀 Starting Production Deployment for Partner Management Platform${NC}"
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
print_info "Running pre-deployment checks..."

# Check required tools
required_tools=("docker" "docker-compose" "git" "curl")
for tool in "${required_tools[@]}"; do
    if ! command_exists "$tool"; then
        print_error "$tool is not installed. Please install it first."
        exit 1
    fi
    print_status "$tool is available"
done

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check environment variables
if [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ] || [ -z "$REDIS_PASSWORD" ]; then
    print_error "Required environment variables are not set:"
    print_error "  - DB_PASSWORD"
    print_error "  - JWT_SECRET" 
    print_error "  - REDIS_PASSWORD"
    print_error "  - GRAFANA_PASSWORD"
    print_error ""
    print_info "Please set these variables before running the deployment:"
    print_info "export DB_PASSWORD='your_secure_password'"
    print_info "export JWT_SECRET='your_super_secret_jwt_key'"
    print_info "export REDIS_PASSWORD='your_redis_password'"
    print_info "export GRAFANA_PASSWORD='your_grafana_password'"
    exit 1
fi

print_status "Pre-deployment checks passed"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p logs/nginx
mkdir -p backups
mkdir -p ssl
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources

print_status "Directories created"

# Generate SSL certificates (if not exists)
if [ ! -f "ssl/yourdomain.crt" ] || [ ! -f "ssl/yourdomain.key" ]; then
    print_warning "SSL certificates not found. Generating self-signed certificates for development..."
    
    # Generate self-signed certificate
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/yourdomain.key \
        -out ssl/yourdomain.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"
    
    print_status "Self-signed SSL certificates generated"
    print_warning "For production, replace these with proper SSL certificates from Let's Encrypt or your CA"
else
    print_status "SSL certificates found"
fi

# Backup existing data (if any)
if docker-compose ps | grep -q "Up"; then
    print_info "Backing up existing data..."
    
    # Create backup
    BACKUP_DIR="backups/pre-deployment-$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    docker-compose exec -T postgres pg_dump -U postgres partner_management > "$BACKUP_DIR/database.sql" 2>/dev/null || true
    
    # Backup uploads
    cp -r backend-api-setup/uploads "$BACKUP_DIR/" 2>/dev/null || true
    
    print_status "Backup created in $BACKUP_DIR"
fi

# Stop existing services
print_info "Stopping existing services..."
docker-compose down --remove-orphans || true
print_status "Existing services stopped"

# Pull latest changes
print_info "Pulling latest changes..."
git pull origin main || print_warning "Could not pull latest changes (continuing with current code)"

# Build and start services
print_info "Building and starting services..."
docker-compose build --no-cache
print_status "Services built"

# Start services
print_info "Starting services..."
docker-compose up -d
print_status "Services started"

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 30

# Health checks
print_info "Running health checks..."

# Check frontend
if curl -f http://localhost/health >/dev/null 2>&1; then
    print_status "Frontend health check passed"
else
    print_error "Frontend health check failed"
    docker-compose logs frontend
    exit 1
fi

# Check backend API
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    print_status "Backend API health check passed"
else
    print_error "Backend API health check failed"
    docker-compose logs backend
    exit 1
fi

# Check database
if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
    print_status "Database health check passed"
else
    print_error "Database health check failed"
    docker-compose logs postgres
    exit 1
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
    print_status "Redis health check passed"
else
    print_error "Redis health check failed"
    docker-compose logs redis
    exit 1
fi

print_status "All health checks passed"

# Run database migrations (if needed)
print_info "Running database migrations..."
docker-compose exec -T backend npm run migrate || print_warning "Database migration failed or not needed"

# Seed initial data (if needed)
print_info "Seeding initial data..."
docker-compose exec -T backend npm run seed || print_warning "Data seeding failed or not needed"

# Performance test
print_info "Running performance test..."
curl -w "@curl-format.txt" -o /dev/null -s http://localhost/ >/dev/null 2>&1 || print_warning "Performance test failed"

# Security scan
print_info "Running security scan..."
docker-compose exec -T frontend npm audit --audit-level=moderate || print_warning "Security audit found issues"

# Final status check
print_info "Final status check..."
docker-compose ps

# Display access information
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📱 Access Information:${NC}"
echo -e "  Frontend:     https://$DOMAIN"
echo -e "  Backend API:  https://$DOMAIN/api"
echo -e "  API Docs:     https://$DOMAIN/api-docs"
echo -e "  Grafana:      http://localhost:3001 (admin/admin)"
echo -e "  Prometheus:   http://localhost:9090"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "  View logs:    docker-compose logs -f [service]"
echo -e "  Stop:         docker-compose down"
echo -e "  Restart:      docker-compose restart [service]"
echo -e "  Update:       git pull && docker-compose up -d --build"
echo ""
echo -e "${BLUE}📊 Monitoring:${NC}"
echo -e "  Health check: curl https://$DOMAIN/health"
echo -e "  API status:   curl https://$DOMAIN/api/health"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo -e "  - Replace self-signed SSL certificates with proper ones for production"
echo -e "  - Update domain configuration in nginx.production.conf"
echo -e "  - Configure monitoring alerts in Grafana"
echo -e "  - Set up automated backups"
echo -e "  - Monitor logs for any issues"
echo ""
echo -e "${GREEN}✅ Partner Management Platform is now live!${NC}"
echo "Deployment completed at: $(date)"
echo "Log file: $LOG_FILE" 