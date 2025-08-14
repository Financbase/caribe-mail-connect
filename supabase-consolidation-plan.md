# PRMCMS Supabase Consolidation Plan

## Executive Summary

**Objective**: Consolidate 3 separate PRMCMS Supabase projects into a single project with proper environment branching to reduce complexity, costs, and improve development workflow.

**Current State**: 
- 3 separate projects (Main, Staging, Production)
- Resource duplication and management overhead
- Inconsistent schemas across environments

**Target State**:
- Single primary project with environment branches
- Unified schema management
- Streamlined development workflow
- Reduced infrastructure costs

## Current Architecture Analysis

### Project Inventory

| Project | ID | Region | Tables | Data | Status |
|---------|----|---------|---------|----|--------|
| PRMCMS Main | flbwqsocnlvsuqgupbra | us-east-2 | 150+ | ~20 rows | **PRIMARY** |
| PRMCMS Staging | bunikaxkvghzudpraqjb | us-east-1 | 2 | ~3 rows | Underutilized |
| PRMCMS Production | affejwamvzsmtvohasgh | us-east-1 | 80+ | 0 rows | Empty |

### Schema Complexity Analysis

**PRMCMS Main** contains the most comprehensive schema including:
- Core business tables (customers, packages, mailboxes)
- Advanced features (loyalty system, sustainability tracking)
- Operational systems (inventory, billing, notifications)
- Compliance and audit systems
- Integration and webhook systems

## Migration Strategy

### Phase 1: Pre-Migration (Week 1)

#### 1.1 Data Backup and Assessment
- [ ] Export complete schema from all 3 projects
- [ ] Backup all existing data (minimal but critical)
- [ ] Document current application connections
- [ ] Identify active integrations and API keys

#### 1.2 Environment Planning
- [ ] Design branch structure (development, staging, production)
- [ ] Plan data seeding strategy for each environment
- [ ] Define environment-specific configurations

### Phase 2: Primary Project Enhancement (Week 2)

#### 2.1 Schema Consolidation
- [ ] Audit PRMCMS Main schema for completeness
- [ ] Merge any missing tables from Production project
- [ ] Standardize naming conventions and constraints
- [ ] Implement comprehensive RLS policies

#### 2.2 Environment Configuration
- [ ] Set up development branch with full schema
- [ ] Create staging branch with production-like data
- [ ] Prepare production branch with optimized settings

### Phase 3: Application Migration (Week 3)

#### 3.1 Connection String Updates
- [ ] Update development applications to use main project
- [ ] Configure staging applications to use staging branch
- [ ] Prepare production deployment configurations

#### 3.2 Testing and Validation
- [ ] Run comprehensive test suite against new setup
- [ ] Validate all API endpoints and integrations
- [ ] Performance testing across all environments

### Phase 4: Cutover and Cleanup (Week 4)

#### 4.1 Production Cutover
- [ ] Deploy applications with new connection strings
- [ ] Monitor system health and performance
- [ ] Validate all functionality in production

#### 4.2 Legacy Cleanup
- [ ] Archive data from old projects
- [ ] Cancel unused Supabase projects
- [ ] Update documentation and runbooks

## Technical Implementation

### Branch Structure Design

```
PRMCMS Main Project (flbwqsocnlvsuqgupbra)
├── main (development)
│   ├── Full schema with development data
│   ├── Relaxed RLS for testing
│   └── Development integrations
├── staging
│   ├── Production schema
│   ├── Production-like data subset
│   └── Staging integrations
└── production
    ├── Production schema
    ├── Live customer data
    └── Production integrations
```

### Data Migration Scripts

#### Export Schema from All Projects
```sql
-- Export from PRMCMS Main
pg_dump --schema-only --no-owner --no-privileges \
  postgresql://postgres:[password]@db.flbwqsocnlvsuqgupbra.supabase.co:5432/postgres \
  > prmcms_main_schema.sql

-- Export from PRMCMS Production (for missing tables)
pg_dump --schema-only --no-owner --no-privileges \
  postgresql://postgres:[password]@db.affejwamvzsmtvohasgh.supabase.co:5432/postgres \
  > prmcms_production_schema.sql
```

#### Data Migration
```sql
-- Export critical data
pg_dump --data-only --no-owner --no-privileges \
  --table=mailboxes --table=test_users \
  postgresql://postgres:[password]@db.flbwqsocnlvsuqgupbra.supabase.co:5432/postgres \
  > prmcms_data_backup.sql
```

### Environment-Specific Configurations

#### Development Environment
- Full schema with all features enabled
- Relaxed security for testing
- Mock data for development
- Debug logging enabled

#### Staging Environment  
- Production schema
- Subset of production data (anonymized)
- Production-like security settings
- Integration testing endpoints

#### Production Environment
- Optimized schema with indexes
- Full security and RLS policies
- Live customer data
- Production integrations and monitoring

## Benefits Analysis

### Cost Reduction
- **Before**: 3 separate Supabase projects = ~$75/month
- **After**: 1 project with branches = ~$25/month
- **Savings**: ~$600/year (67% reduction)

### Operational Benefits
- Unified schema management
- Simplified deployment pipeline
- Consistent development experience
- Reduced maintenance overhead
- Better environment parity

### Development Workflow Improvements
- Single source of truth for schema
- Easier feature branch testing
- Simplified CI/CD pipeline
- Better collaboration between teams
- Consistent data models across environments

## Risk Mitigation

### Data Safety
- Complete backups before migration
- Staged rollout with rollback plan
- Parallel running during transition
- Comprehensive testing at each phase

### Application Continuity
- Zero-downtime migration approach
- Feature flags for gradual cutover
- Monitoring and alerting during transition
- Quick rollback procedures

### Team Coordination
- Clear communication plan
- Training on new workflow
- Documentation updates
- Support during transition period

## Success Metrics

### Technical Metrics
- [ ] 100% schema parity across environments
- [ ] Zero data loss during migration
- [ ] <5 minute deployment times
- [ ] 99.9% uptime during transition

### Business Metrics
- [ ] 67% cost reduction achieved
- [ ] 50% faster development cycles
- [ ] 90% reduction in environment-related issues
- [ ] 100% team adoption of new workflow

## Timeline

| Week | Phase | Key Deliverables |
|------|-------|------------------|
| 1 | Pre-Migration | Backups, assessment, planning |
| 2 | Enhancement | Schema consolidation, branch setup |
| 3 | Migration | Application updates, testing |
| 4 | Cutover | Production deployment, cleanup |

## Next Steps

1. **Immediate**: Approve consolidation plan and timeline
2. **Week 1**: Begin data backup and assessment phase
3. **Week 2**: Start schema consolidation work
4. **Week 3**: Begin application migration testing
5. **Week 4**: Execute production cutover

This consolidation will significantly improve our development workflow while reducing costs and complexity.
