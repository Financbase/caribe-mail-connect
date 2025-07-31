# 🚀 Partner Management Platform - Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Development Complete

- [x] All 5 partner management modules implemented
- [x] TypeScript compilation successful
- [x] Build process optimized
- [x] API service layer created
- [x] Authentication system implemented
- [x] Real-time notifications configured
- [x] Security measures in place

### 🎯 Production Requirements

- [ ] Production environment setup
- [ ] Database configuration
- [ ] SSL certificates
- [ ] Domain configuration
- [ ] Monitoring and logging
- [ ] Backup strategy
- [ ] CI/CD pipeline

## 1. Environment Setup

### Production Environment Variables

Create `.env.production` file:

```bash
# API Configuration
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com

# Authentication
REACT_APP_AUTH_DOMAIN=yourdomain.com
REACT_APP_AUTH_CLIENT_ID=your_auth_client_id

# Analytics
REACT_APP_GA_TRACKING_ID=GA_TRACKING_ID
REACT_APP_SENTRY_DSN=your_sentry_dsn

# Feature Flags
REACT_APP_ENABLE_REAL_TIME=true
REACT_APP_ENABLE_PUSH_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=true

# Security
REACT_APP_CSP_NONCE=your_csp_nonce
REACT_APP_HSTS_MAX_AGE=31536000
```

### Docker Configuration

```dockerfile
# Dockerfile.production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.production.conf /etc/nginx/nginx.conf

# Copy security headers
COPY security-headers.conf /etc/nginx/security-headers.conf

# Expose port
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.production.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Security headers
    include /etc/nginx/security-headers.conf;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream for API
    upstream api_backend {
        server api:3000;
        keepalive 32;
    }

    server {
        listen 80;
        server_name partners.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name partners.yourdomain.com;

        # SSL configuration
        ssl_certificate /etc/ssl/certs/yourdomain.crt;
        ssl_certificate_key /etc/ssl/private/yourdomain.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Root directory
        root /usr/share/nginx/html;
        index index.html;

        # API proxy
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket proxy
        location /ws/ {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## 2. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Partner Management Platform

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Run linting
        run: npm run lint

      - name: Build application
        run: npm run build

      - name: Run security audit
        run: npm audit --audit-level=moderate

  security-scan:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  build-and-push:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.production
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-push
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment..."
          # Add your staging deployment steps here

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment: production
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment..."
          # Add your production deployment steps here
```

## 3. Database Setup

### PostgreSQL Configuration

```sql
-- Create partner management database
CREATE DATABASE partner_management;

-- Create tables
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address JSONB,
    contact_person JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    rating DECIMAL(3,2) DEFAULT 0,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revenue DECIMAL(15,2) DEFAULT 0,
    commission DECIMAL(15,2) DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partner_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE,
    renewal_date DATE,
    terms TEXT,
    commission_rate DECIMAL(5,4),
    payment_terms TEXT,
    total_value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    period VARCHAR(7) NOT NULL, -- YYYY-MM format
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP,
    reference VARCHAR(100),
    breakdown JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_type ON partners(type);
CREATE INDEX idx_partners_rating ON partners(rating);
CREATE INDEX idx_contracts_partner_id ON partner_contracts(partner_id);
CREATE INDEX idx_contracts_status ON partner_contracts(status);
CREATE INDEX idx_commissions_partner_id ON commissions(partner_id);
CREATE INDEX idx_commissions_period ON commissions(period);
CREATE INDEX idx_commissions_status ON commissions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON partner_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Monitoring & Observability

### Application Monitoring Setup

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';

export class ProductionMonitor {
  static initialize() {
    // Initialize Sentry
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', 'yourdomain.com'],
        }),
      ],
      tracesSampleRate: 0.1,
    });

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          // Track Core Web Vitals
          this.trackMetric('LCP', navigation.loadEventEnd - navigation.loadEventStart);
          this.trackMetric('FID', 0); // Will be updated by real user monitoring
          this.trackMetric('CLS', 0); // Will be updated by real user monitoring
          
          // Track paint times
          paint.forEach(entry => {
            this.trackMetric(entry.name, entry.startTime);
          });
        }, 1000);
      });
    }

    // Error boundary
    window.addEventListener('error', (event) => {
      this.trackError(event.error, 'unhandled_error');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), 'unhandled_promise_rejection');
    });
  }

  static trackMetric(name: string, value: number) {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name,
        value: Math.round(value)
      });
    }

    // Send to monitoring service
    Sentry.metrics.gauge(name, value);
  }

  static trackError(error: Error, context: string) {
    Sentry.captureException(error, {
      tags: { context },
      extra: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });
  }

  static trackEvent(eventName: string, properties: Record<string, any>) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }

    // Custom analytics
    Sentry.addBreadcrumb({
      category: 'user_action',
      message: eventName,
      data: properties,
      level: 'info'
    });
  }
}
```

### Health Check Endpoint

```typescript
// src/utils/healthCheck.ts
export class HealthCheck {
  static async check(): Promise<HealthStatus> {
    const checks = {
      api: await this.checkApi(),
      database: await this.checkDatabase(),
      websocket: await this.checkWebSocket(),
      storage: await this.checkStorage()
    };

    const allHealthy = Object.values(checks).every(check => check.healthy);
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks
    };
  }

  private static async checkApi(): Promise<CheckResult> {
    try {
      const response = await fetch('/api/health', { timeout: 5000 });
      return {
        healthy: response.ok,
        responseTime: Date.now(),
        error: response.ok ? null : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now(),
        error: error.message
      };
    }
  }

  private static async checkDatabase(): Promise<CheckResult> {
    try {
      const response = await fetch('/api/health/database', { timeout: 5000 });
      return {
        healthy: response.ok,
        responseTime: Date.now(),
        error: response.ok ? null : `Database check failed`
      };
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now(),
        error: error.message
      };
    }
  }

  private static async checkWebSocket(): Promise<CheckResult> {
    return new Promise((resolve) => {
      const ws = new WebSocket(process.env.REACT_APP_WS_URL + '/health');
      const startTime = Date.now();
      
      ws.onopen = () => {
        resolve({
          healthy: true,
          responseTime: Date.now() - startTime,
          error: null
        });
        ws.close();
      };
      
      ws.onerror = () => {
        resolve({
          healthy: false,
          responseTime: Date.now() - startTime,
          error: 'WebSocket connection failed'
        });
      };
      
      setTimeout(() => {
        resolve({
          healthy: false,
          responseTime: Date.now() - startTime,
          error: 'WebSocket timeout'
        });
      }, 5000);
    });
  }

  private static async checkStorage(): Promise<CheckResult> {
    try {
      const testKey = '__health_check__';
      const testValue = Date.now().toString();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      return {
        healthy: retrieved === testValue,
        responseTime: 0,
        error: retrieved === testValue ? null : 'Storage test failed'
      };
    } catch (error) {
      return {
        healthy: false,
        responseTime: 0,
        error: error.message
      };
    }
  }
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks: {
    api: CheckResult;
    database: CheckResult;
    websocket: CheckResult;
    storage: CheckResult;
  };
}

interface CheckResult {
  healthy: boolean;
  responseTime: number;
  error: string | null;
}
```

## 5. Security Configuration

### Security Headers

```nginx
# security-headers.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' wss: https: https://www.google-analytics.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Content Security Policy

```typescript
// src/utils/csp.ts
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://js.sentry-cdn.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:'
  ],
  'connect-src': [
    "'self'",
    'wss:',
    'https:',
    'https://www.google-analytics.com',
    'https://api.sentry.io'
  ],
  'frame-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

export function generateCSP(): string {
  return Object.entries(CSP_POLICY)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}
```

## 6. Backup Strategy

### Database Backup Script

```bash
#!/bin/bash
# backup-database.sh

# Configuration
DB_NAME="partner_management"
BACKUP_DIR="/backups/database"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U postgres -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove old backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/

echo "Backup completed: $BACKUP_FILE.gz"
```

### Automated Backup Cron Job

```bash
# Add to crontab
# Daily backup at 2 AM
0 2 * * * /path/to/backup-database.sh

# Weekly full backup on Sunday at 3 AM
0 3 * * 0 /path/to/backup-database.sh --full
```

## 7. Deployment Commands

### Production Deployment Script

```bash
#!/bin/bash
# deploy-production.sh

set -e

echo "🚀 Starting production deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Run tests
npm run test

# Build application
npm run build

# Run security audit
npm audit --audit-level=moderate

# Build Docker image
docker build -f Dockerfile.production -t partner-management:latest .

# Stop existing container
docker stop partner-management || true
docker rm partner-management || true

# Start new container
docker run -d \
  --name partner-management \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v /etc/ssl:/etc/ssl:ro \
  -v /var/log/nginx:/var/log/nginx \
  --env-file .env.production \
  partner-management:latest

# Health check
sleep 10
curl -f http://localhost/health || exit 1

echo "✅ Production deployment completed successfully!"
```

## 🎯 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations ready

### Deployment

- [ ] Backup current production data
- [ ] Deploy to staging environment
- [ ] Run integration tests
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Deployment

- [ ] Monitor application logs
- [ ] Verify all features working
- [ ] Check analytics tracking
- [ ] Test real-time notifications
- [ ] Validate security headers
- [ ] Confirm backup strategy
- [ ] Update status page

## 🚀 Go Live

Your partner management platform is now ready for production deployment!

**Next Steps:**

1. Set up your production environment
2. Configure your domain and SSL certificates
3. Deploy using the provided scripts
4. Monitor the application closely for the first 24 hours
5. Gradually roll out to partners

The platform is built with enterprise-grade security, performance, and scalability in mind. 🎉
