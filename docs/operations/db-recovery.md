# Database Recovery and Failover Procedures

*Updated: 2025-03-04*

## Table of Contents
- [Overview](#overview)
- [Automated Backups](#automated-backups)
- [Failover Workflow](#failover-workflow)
- [Restoring from Backup](#restoring-from-backup)
- [Verification](#verification)
- [References](#references)

## Overview
Caribe Mail Connect operates within the Preserving and Revitalizing Musical Cultural Expression (PRMCE) initiative. Reliable data continuity ensures the CEMI Core supports our communities even in adverse conditions. This document outlines how to recover the database and fail over to a standby instance.

## Automated Backups
Scheduled jobs call [`services/db/backup/backup.sh`](../../services/db/backup/backup.sh) to create timestamped SQL dumps. Store the resulting files in a secure location managed by HashiCorp Vault and replicate them across Cloudflare R2 for geographic resilience.

## Failover Workflow
1. Detect primary database failure through monitoring alerts.
2. Promote a standby replica or provision a new instance in Cloudflare.
3. Update application secrets in Vault to point to the new instance.
4. Verify connectivity from all ventures, including Pichonario and Studio Flow X.

## Restoring from Backup
1. Retrieve the most recent backup file.
2. Run [`services/db/backup/restore.sh`](../../services/db/backup/restore.sh) with the file path:
   ```bash
   services/db/backup/restore.sh path/to/backup.sql
   ```
3. Reapply pending migrations using the regular deployment process.

## Verification
After restore or failover, run integration tests and perform cultural verification checks to ensure data integrity for all PRMCE ventures. Confirm access from rural connectivity simulations to guarantee service availability.

## References
- PRMCE Glossary
- Cultural Verification Implementation
- Monitoring Implementation
