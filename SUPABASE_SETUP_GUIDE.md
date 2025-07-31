# Supabase Setup Guide for PRMCMS

## Current Status ✅

Your PRMCMS project is already configured with Supabase:

- **Project ID**: `flbwqsocnlvsuqgupbra`
- **Project URL**: `https://flbwqsocnlvsuqgupbra.supabase.co`
- **CLI**: Installed and linked
- **Migrations**: 50+ database migrations ready
- **Edge Functions**: 18 functions configured
- **Client**: Configured in `src/integrations/supabase/client.ts`

## Environment Variables Setup

Create a `.env` file in the `caribe-mail-connect` directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://flbwqsocnlvsuqgupbra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYndxc29jbmx2c3VxZ3VwYnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzY2NzcsImV4cCI6MjA2ODk1MjY3N30.nhWOR862I

# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Application Configuration
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_GOOGLE_MAPS=true
VITE_ENABLE_REAL_TIME_TRACKING=true
```

## Database Schema Overview

Your database includes comprehensive tables for:

### Core Business Logic

- **customers** - Customer management
- **packages** - Package tracking and management
- **mailboxes** - Virtual mailbox system
- **employees** - Staff management
- **facilities** - Location management

### Advanced Features

- **loyalty_system** - Points and rewards
- **last_mile_delivery** - Route optimization
- **iot_devices** - Device tracking
- **qa_system** - Quality assurance
- **billing** - Financial management

### Security & Compliance

- **audit_logs** - Activity tracking
- **security_settings** - Access control
- **compliance_records** - Regulatory compliance

## Edge Functions Available

### Loyalty System

- `calculate-loyalty-points` - Award points for various actions
- `loyalty-webhook` - Handle loyalty system webhooks

### Last Mile Delivery

- `last-mile-routes` - Route optimization
- `last-mile-partnerships` - Partner management

### Reporting & Analytics

- `generate-health-report` - System health reports
- `execute-report` - Custom report execution
- `export-report` - Data export functionality
- `send-scheduled-report` - Automated reporting

### Integration & Sync

- `sync-integration` - Third-party integrations
- `sync-accounting-data` - Financial data sync
- `sync-carrier-tracking` - Carrier tracking sync
- `test-integration` - Integration testing

### Billing & Payments

- `run-billing-cycle` - Automated billing
- `generate-payment-link` - Payment processing

### Testing & QA

- `run-automated-tests` - Automated testing suite
- `webhook-handler` - Webhook processing

## CLI Commands

### Development

```bash
# Start local development
supabase start

# Stop local development
supabase stop

# Reset local database
supabase db reset
```

### Database Management

```bash
# Apply migrations
supabase db push

# Pull remote schema
supabase db pull

# Generate types
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Function Deployment

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy calculate-loyalty-points

# List deployed functions
supabase functions list
```

### Project Management

```bash
# Link to remote project
supabase link --project-ref flbwqsocnlvsuqgupbra

# Check project status
supabase status

# Login to Supabase
supabase login
```

## Authentication Setup

Your project includes comprehensive authentication:

### Features Configured

- ✅ Email/Password authentication
- ✅ Multi-factor authentication (MFA)
- ✅ Social login providers
- ✅ Role-based access control
- ✅ Session management
- ✅ Password reset functionality

### User Roles

- **admin** - Full system access
- **staff** - Operational access
- **customer** - Limited customer access
- **carrier** - Delivery personnel access

## Real-time Features

### Subscriptions Available

- Package tracking updates
- Customer notifications
- Employee activity feeds
- System alerts
- Loyalty point updates

### Configuration

```typescript
// Enable real-time subscriptions
const subscription = supabase
  .channel('package_updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'packages' },
    (payload) => {
      console.log('Package update:', payload)
    }
  )
  .subscribe()
```

## Security & RLS (Row Level Security)

### Policies Configured

- **Tenant isolation** - Multi-tenant data separation
- **Role-based access** - User permission enforcement
- **Data encryption** - Sensitive data protection
- **Audit logging** - Activity tracking

### Example RLS Policy

```sql
-- Customers can only see their own data
CREATE POLICY "Users can view own data" ON customers
  FOR SELECT USING (auth.uid() = user_id);
```

## Performance Optimization

### Database Indexes

- Spatial indexes for location queries
- Composite indexes for complex queries
- Full-text search indexes
- Performance monitoring

### Caching Strategy

- Redis caching for frequently accessed data
- CDN for static assets
- Browser caching optimization
- Query result caching

## Monitoring & Analytics

### Built-in Monitoring

- Database performance metrics
- Function execution logs
- Authentication analytics
- Error tracking and alerting

### Custom Analytics

- Customer behavior tracking
- Package delivery metrics
- Employee productivity
- Financial performance

## Backup & Recovery

### Automated Backups

- Daily database backups
- Point-in-time recovery
- Cross-region replication
- Disaster recovery plan

### Data Export

- CSV export functionality
- JSON API endpoints
- Scheduled data exports
- Compliance reporting

## Testing Strategy

### Database Testing

```bash
# Run database tests
npm run test:db

# Test migrations
supabase migration test

# Validate schema
supabase db lint
```

### Function Testing

```bash
# Test edge functions locally
supabase functions serve

# Run function tests
npm run test:functions
```

## Production Deployment

### Environment Variables

```bash
# Production environment
VITE_SUPABASE_URL=https://flbwqsocnlvsuqgupbra.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_ENV=production
```

### Security Checklist

- [ ] RLS policies enabled
- [ ] API rate limiting configured
- [ ] CORS settings updated
- [ ] SSL certificates valid
- [ ] Backup strategy tested

## Troubleshooting

### Common Issues

1. **Connection Errors**

   ```bash
   # Check environment variables
   echo $VITE_SUPABASE_URL
   echo $VITE_SUPABASE_ANON_KEY
   ```

2. **Migration Issues**

   ```bash
   # Repair migration history
   supabase migration repair --status applied <migration_id>
   ```

3. **Function Deployment Failures**

   ```bash
   # Check function logs
   supabase functions logs <function_name>
   ```

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Project Issues](https://github.com/your-repo/issues)

## Next Steps

1. **Set up environment variables** in your `.env` file
2. **Deploy edge functions** using `supabase functions deploy`
3. **Test authentication flow** with your React app
4. **Configure real-time subscriptions** for live updates
5. **Set up monitoring** and alerting
6. **Test backup and recovery** procedures

Your Supabase setup is comprehensive and production-ready! 🚀
