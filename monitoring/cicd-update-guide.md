# CI/CD Pipeline Update Guide for PRMCMS Supabase Consolidation

## Overview

This guide provides step-by-step instructions for updating CI/CD pipelines to use the consolidated PRMCMS Supabase project.

## Pre-Update Checklist

- [ ] Backup existing CI/CD configurations
- [ ] Document current deployment process
- [ ] Identify all repositories using PRMCMS Supabase
- [ ] Prepare new environment variables
- [ ] Schedule maintenance window for updates

## Environment Variables Update

### Old Project IDs (TO BE REPLACED)
```bash
# REMOVE THESE
SUPABASE_PROJECT_ID_STAGING=bunikaxkvghzudpraqjb
SUPABASE_PROJECT_ID_PRODUCTION=affejwamvzsmtvohasgh
SUPABASE_URL_STAGING=https://bunikaxkvghzudpraqjb.supabase.co
SUPABASE_URL_PRODUCTION=https://affejwamvzsmtvohasgh.supabase.co
```

### New Consolidated Configuration
```bash
# USE THESE FOR ALL ENVIRONMENTS
SUPABASE_PROJECT_ID=flbwqsocnlvsuqgupbra
SUPABASE_URL=https://flbwqsocnlvsuqgupbra.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYndxc29jbmx2c3VxZ3VwYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzY2NzcsImV4cCI6MjA2ODk1MjY3N30.nhWOR862I7FsZ7oOxNnN5-Mp2C9gdhp2TXl84YEPwtw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYndxc29jbmx2c3VxZ3VwYnJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzM3NjY3NywiZXhwIjoyMDY4OTUyNjc3fQ.B5QaSO5wYkFZsrZ74AwaUppde0Rk9jki6cCWxLX3u1U

# Environment-specific configuration
ENVIRONMENT=development  # or staging, production
```

## GitHub Actions Update

### Before (Multiple Projects)
```yaml
name: Deploy to Staging
on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging Supabase
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: bunikaxkvghzudpraqjb
        run: |
          supabase link --project-ref $SUPABASE_PROJECT_ID
          supabase db push
```

### After (Consolidated Project)
```yaml
name: Deploy to Staging
on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Consolidated Supabase
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: flbwqsocnlvsuqgupbra
          ENVIRONMENT: staging
        run: |
          supabase link --project-ref $SUPABASE_PROJECT_ID
          # Set environment configuration
          node scripts/environment-manager.js switch staging
          # Deploy application
          npm run build
          npm run deploy:staging
```

## GitLab CI Update

### Before (Multiple Projects)
```yaml
stages:
  - deploy-staging
  - deploy-production

deploy-staging:
  stage: deploy-staging
  variables:
    SUPABASE_PROJECT_ID: bunikaxkvghzudpraqjb
  script:
    - supabase link --project-ref $SUPABASE_PROJECT_ID
    - supabase db push
```

### After (Consolidated Project)
```yaml
stages:
  - deploy-staging
  - deploy-production

deploy-staging:
  stage: deploy-staging
  variables:
    SUPABASE_PROJECT_ID: flbwqsocnlvsuqgupbra
    ENVIRONMENT: staging
  script:
    - supabase link --project-ref $SUPABASE_PROJECT_ID
    - node scripts/environment-manager.js switch staging
    - npm run build
    - npm run deploy:staging

deploy-production:
  stage: deploy-production
  variables:
    SUPABASE_PROJECT_ID: flbwqsocnlvsuqgupbra
    ENVIRONMENT: production
  script:
    - supabase link --project-ref $SUPABASE_PROJECT_ID
    - node scripts/environment-manager.js switch production
    - npm run build
    - npm run deploy:production
```

## Docker Configuration Update

### Before (Multiple Dockerfiles)
```dockerfile
# Dockerfile.staging
ENV SUPABASE_URL=https://bunikaxkvghzudpraqjb.supabase.co
ENV SUPABASE_ANON_KEY=old_staging_key

# Dockerfile.production  
ENV SUPABASE_URL=https://affejwamvzsmtvohasgh.supabase.co
ENV SUPABASE_ANON_KEY=old_production_key
```

### After (Single Dockerfile with Build Args)
```dockerfile
# Dockerfile
ARG ENVIRONMENT=development
ENV ENVIRONMENT=${ENVIRONMENT}
ENV SUPABASE_URL=https://flbwqsocnlvsuqgupbra.supabase.co
ENV SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYndxc29jbmx2c3VxZ3VwYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzY2NzcsImV4cCI6MjA2ODk1MjY3N30.nhWOR862I7FsZ7oOxNnN5-Mp2C9gdhp2TXl84YEPwtw

# Copy environment manager
COPY scripts/environment-manager.js /app/scripts/
RUN node scripts/environment-manager.js switch ${ENVIRONMENT}
```

## Database Migration Scripts Update

### Before (Multiple Scripts)
```bash
#!/bin/bash
# migrate-staging.sh
supabase link --project-ref bunikaxkvghzudpraqjb
supabase db push

# migrate-production.sh  
supabase link --project-ref affejwamvzsmtvohasgh
supabase db push
```

### After (Single Script with Environment)
```bash
#!/bin/bash
# migrate.sh
ENVIRONMENT=${1:-development}
PROJECT_ID=flbwqsocnlvsuqgupbra

echo "Migrating to $ENVIRONMENT environment..."
supabase link --project-ref $PROJECT_ID
node scripts/environment-manager.js switch $ENVIRONMENT
supabase db push

echo "Migration to $ENVIRONMENT complete!"
```

## Kubernetes/Helm Updates

### Before (Multiple ConfigMaps)
```yaml
# staging-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prmcms-staging-config
data:
  SUPABASE_URL: "https://bunikaxkvghzudpraqjb.supabase.co"
  
# production-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prmcms-production-config
data:
  SUPABASE_URL: "https://affejwamvzsmtvohasgh.supabase.co"
```

### After (Environment-based ConfigMap)
```yaml
# values.yaml
environments:
  staging:
    environment: staging
    replicas: 2
  production:
    environment: production
    replicas: 5

# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prmcms-config
data:
  SUPABASE_URL: "https://flbwqsocnlvsuqgupbra.supabase.co"
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ENVIRONMENT: "{{ .Values.environment }}"
```

## Testing Pipeline Updates

### Integration Test Updates
```bash
# Before: Test against multiple projects
npm run test:staging -- --supabase-url=https://bunikaxkvghzudpraqjb.supabase.co
npm run test:production -- --supabase-url=https://affejwamvzsmtvohasgh.supabase.co

# After: Test against consolidated project with environment switching
export SUPABASE_URL=https://flbwqsocnlvsuqgupbra.supabase.co
node scripts/environment-manager.js switch staging
npm run test:staging

node scripts/environment-manager.js switch production  
npm run test:production
```

## Monitoring and Alerting Updates

### Before (Multiple Dashboards)
- Staging Dashboard: Monitor bunikaxkvghzudpraqjb
- Production Dashboard: Monitor affejwamvzsmtvohasgh

### After (Unified Dashboard)
- Single Dashboard: Monitor flbwqsocnlvsuqgupbra
- Environment-based filtering
- Consolidated alerting rules

## Rollback Plan

If issues arise during CI/CD updates:

1. **Immediate Rollback**
   ```bash
   # Revert environment variables to old project IDs
   # Redeploy using previous CI/CD configuration
   ```

2. **Gradual Rollback**
   ```bash
   # Switch specific services back to old projects
   # Monitor for stability
   # Plan re-migration
   ```

## Validation Checklist

After updating CI/CD pipelines:

- [ ] Staging deployment successful
- [ ] Production deployment successful  
- [ ] All tests passing
- [ ] Environment switching working
- [ ] Monitoring dashboards updated
- [ ] Alerting rules configured
- [ ] Team notified of changes
- [ ] Documentation updated

## Common Issues and Solutions

### Issue: Environment variables not updating
**Solution**: Clear CI/CD cache and restart runners

### Issue: Database migrations failing
**Solution**: Ensure environment is switched before migration

### Issue: Tests failing after consolidation
**Solution**: Update test database connection strings

### Issue: Deployment timeouts
**Solution**: Increase timeout values for initial deployments

## Support and Troubleshooting

For issues during CI/CD updates:

1. Check health monitor: `node monitoring/health-monitor.js check`
2. Verify environment: `node scripts/environment-manager.js status`
3. Test connectivity: `node monitoring/connectivity-test.js`
4. Review logs in monitoring/health-metrics.json

## Timeline

- **Hours 0-12**: Plan and prepare updates
- **Hours 12-24**: Update staging pipelines and test
- **Hours 24-36**: Update production pipelines
- **Hours 36-48**: Monitor and validate all deployments

This consolidation will streamline CI/CD processes while maintaining full functionality across all environments.
