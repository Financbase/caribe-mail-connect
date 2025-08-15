# Staging Deployment Guide - Beta Testing

## Overview

This guide outlines the deployment of the PRMCMS production setup to a staging environment for beta testing.

## Staging Environment Setup

### 1. Staging Supabase Project

- **Project Name**: PRMCMS-Staging
- **Region**: US East (N. Virginia) - us-east-1
- **Plan**: Pro (for full feature parity with production)
- **Purpose**: Beta testing and pre-production validation

### 2. Environment Variables

```bash
# Staging Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]
NEXT_PUBLIC_API_URL=https://staging-api.prmcms.com
NEXT_PUBLIC_ENVIRONMENT=staging
```

### 3. Deployment Steps

#### Step 1: Create Staging Project

```bash
# Create staging project in Supabase
supabase projects create --name "PRMCMS-Staging" --region us-east-1
```

#### Step 2: Link to Staging Project

```bash
# Link local development to staging project
supabase link --project-ref [staging-project-ref]
```

#### Step 3: Deploy Migrations

```bash
# Deploy all migrations to staging
supabase db push --include-all
```

#### Step 4: Deploy Edge Functions

```bash
# Deploy edge functions to staging
supabase functions deploy --project-ref [staging-project-ref]
```

#### Step 5: Configure Environment

```bash
# Set environment variables for staging
supabase secrets set --project-ref [staging-project-ref] \
  NEXT_PUBLIC_ENVIRONMENT=staging \
  NEXT_PUBLIC_API_URL=https://staging-api.prmcms.com
```

## Beta Testing Checklist

### ✅ Infrastructure Testing

- [ ] Staging Supabase project created and accessible
- [ ] All migrations applied successfully
- [ ] Edge functions deployed and functional
- [ ] Environment variables configured correctly
- [ ] SSL/TLS certificates provisioned

### ✅ Security Testing

- [ ] Row Level Security (RLS) policies working
- [ ] Authentication and authorization functional
- [ ] Rate limiting configured and tested
- [ ] Audit logging operational
- [ ] Security monitoring functions working

### ✅ Performance Testing

- [ ] Database indexes created and optimized
- [ ] Connection pooling configured
- [ ] Query performance within acceptable limits
- [ ] Performance monitoring functions operational
- [ ] Health check functions working

### ✅ Backup & Recovery Testing

- [ ] Automated backups configured
- [ ] Point-in-time recovery functional
- [ ] Backup verification procedures working
- [ ] Disaster recovery procedures tested
- [ ] Backup monitoring functions operational

### ✅ Application Testing

- [ ] Frontend application connects to staging
- [ ] All CRUD operations functional
- [ ] User authentication working
- [ ] Role-based access control working
- [ ] Error handling and logging functional

## Testing Procedures

### 1. Load Testing

```bash
# Run load tests against staging environment
npm run test:load:staging
```

### 2. Security Testing

```bash
# Run security tests
npm run test:security:staging
```

### 3. Performance Testing

```bash
# Run performance tests
npm run test:performance:staging
```

### 4. Integration Testing

```bash
# Run integration tests
npm run test:integration:staging
```

## Monitoring and Validation

### 1. Database Health Checks

```sql
-- Check database health
SELECT * FROM get_database_health();

-- Check performance metrics
SELECT * FROM performance_metrics;

-- Check security status
SELECT * FROM get_security_status();

-- Check backup status
SELECT * FROM get_backup_status();
```

### 2. Application Monitoring

- Monitor application logs for errors
- Check API response times
- Verify authentication flows
- Test user registration and login
- Validate data access controls

### 3. Security Validation

- Test RLS policy enforcement
- Verify audit logging
- Check rate limiting
- Validate encryption
- Test security monitoring

## Rollback Procedures

### If Issues Are Found

1. **Immediate Rollback**: Revert to previous stable version
2. **Database Rollback**: Use Supabase point-in-time recovery
3. **Configuration Rollback**: Revert environment variables
4. **Application Rollback**: Deploy previous application version

### Rollback Commands

```bash
# Rollback database to specific point
supabase db reset --project-ref [staging-project-ref]

# Revert to previous migration
supabase migration repair [migration-name] --status reverted

# Rollback edge functions
supabase functions deploy [function-name] --project-ref [staging-project-ref]
```

## Beta Testing Timeline

### Week 1: Infrastructure Testing

- Deploy staging environment
- Validate all migrations
- Test basic functionality
- Configure monitoring

### Week 2: Security & Performance Testing

- Comprehensive security testing
- Performance benchmarking
- Load testing
- Stress testing

### Week 3: Integration Testing

- End-to-end testing
- User acceptance testing
- Bug fixes and improvements
- Documentation updates

### Week 4: Production Readiness

- Final validation
- Performance optimization
- Security hardening
- Production deployment preparation

## Success Criteria

### Technical Criteria

- [ ] All migrations apply successfully
- [ ] All functions work correctly
- [ ] Performance meets requirements
- [ ] Security features operational
- [ ] Backup systems functional

### Business Criteria

- [ ] Application functionality complete
- [ ] User workflows working
- [ ] Data integrity maintained
- [ ] Error handling appropriate
- [ ] Monitoring and alerting operational

## Next Steps After Beta Testing

### If Successful

1. **Production Deployment**: Deploy to production environment
2. **DNS Configuration**: Set up production domain
3. **SSL Certificate**: Configure production SSL
4. **Monitoring Setup**: Configure production monitoring
5. **Documentation**: Finalize production documentation

### If Issues Found

1. **Issue Resolution**: Fix identified problems
2. **Re-testing**: Re-run affected test suites
3. **Validation**: Verify fixes work correctly
4. **Re-deployment**: Deploy fixes to staging
5. **Re-validation**: Complete testing cycle

## Contact Information

### Staging Environment Support

- **Project Reference**: [staging-project-ref]
- **Dashboard URL**: <https://supabase.com/dashboard/project/[staging-project-ref>]
- **API URL**: https://[staging-project-ref].supabase.co
- **Support**: <staging-support@prmcms.com>

---

**Deployment Date**: January 31, 2025
**Beta Testing Period**: 4 weeks
**Production Target**: February 28, 2025
