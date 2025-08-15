# 🔐 Secrets Management Guide

## Overview

This document outlines the secure secrets management procedures for the caribe-mail-connect application, including rotation procedures, access controls, and best practices.

## 🏗️ Architecture

### Secrets Manager
- **Location**: `src/lib/secrets.ts`
- **Purpose**: Centralized, secure access to environment variables
- **Features**: Validation, masking, environment-specific configuration

### Environment Files
- **Development**: `.env` (local only, never committed)
- **Staging**: `.env.staging` (managed by CI/CD)
- **Production**: `.env.production` (managed by secure vault)

## 🔑 Secret Categories

### Critical Secrets (Require Immediate Rotation if Compromised)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_KEY` - API authentication key
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_SENTRY_DSN` - Sentry error tracking DSN

### Configuration Secrets (Environment-Specific)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_API_BASE_URL` - API base URL

### Optional Secrets
- `VITE_GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID

## 🔄 Rotation Procedures

### Quarterly Rotation (Scheduled)
1. **Generate New Secrets**
   ```bash
   # Generate new API key
   openssl rand -hex 32
   
   # Generate new webhook secret
   openssl rand -base64 32
   ```

2. **Update Secrets in Order**
   - Development environment first
   - Staging environment second
   - Production environment last

3. **Validation Steps**
   ```bash
   # Validate new secrets
   npm run validate:secrets production
   
   # Test application functionality
   npm run test:integration
   ```

### Emergency Rotation (Compromise Detected)
1. **Immediate Actions**
   - Revoke compromised secrets immediately
   - Generate new secrets
   - Update all environments simultaneously
   - Monitor for unauthorized access

2. **Communication**
   - Notify security team
   - Document incident
   - Update access logs

## 🛡️ Security Best Practices

### Development Environment
```bash
# Copy example file
cp .env.example .env

# Set development values
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_dev_anon_key
```

### Staging Environment
```bash
# Use staging-specific secrets
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
VITE_API_BASE_URL=https://staging-api.prmcms.com
```

### Production Environment
```bash
# Use production secrets (managed by CI/CD)
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_prod_anon_key
VITE_API_BASE_URL=https://api.prmcms.com
VITE_GOOGLE_MAPS_API_KEY=your_prod_google_maps_key
VITE_SENTRY_DSN=https://your-prod-sentry-dsn
```

## 🔍 Validation Commands

### Check for Hardcoded Secrets
```bash
npm run validate:secrets
```

### Environment-Specific Validation
```bash
npm run validate:secrets development
npm run validate:secrets staging
npm run validate:secrets production
```

### Security Audit
```bash
npm run security:audit
```

## 🚨 Incident Response

### If Secrets Are Compromised
1. **Immediate Response**
   - Revoke compromised secrets
   - Generate new secrets
   - Update all environments
   - Monitor access logs

2. **Investigation**
   - Identify compromise source
   - Assess impact
   - Document findings

3. **Recovery**
   - Implement additional security measures
   - Update procedures
   - Conduct security review

## 📋 Checklist

### Before Deployment
- [ ] All required secrets configured
- [ ] No hardcoded secrets in code
- [ ] Environment validation passes
- [ ] Secrets properly masked in logs
- [ ] .gitignore configured correctly

### Monthly Review
- [ ] Review access logs
- [ ] Check for unused secrets
- [ ] Validate secret rotation schedule
- [ ] Update documentation
- [ ] Conduct security assessment

### Quarterly Tasks
- [ ] Rotate all critical secrets
- [ ] Review access permissions
- [ ] Update security procedures
- [ ] Conduct penetration testing
- [ ] Train team on security practices

## 🔧 Tools and Scripts

### Validation Scripts
- `scripts/validate-secrets.js` - Comprehensive secrets validation
- `scripts/security-audit.js` - Security audit with secrets check

### Secrets Manager
- `src/lib/secrets.ts` - Centralized secrets management
- Environment validation and masking
- Production safety checks

## 📞 Emergency Contacts

### Security Team
- **Primary**: security@prmcms.com
- **Secondary**: admin@prmcms.com

### Service Providers
- **Supabase**: support@supabase.io
- **Google Cloud**: cloud-support@google.com
- **Sentry**: support@sentry.io

## 📚 Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Owner**: Security Team
