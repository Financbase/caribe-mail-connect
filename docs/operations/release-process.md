# Release Process
_Last updated: 2025-08-13_

## Table of Contents
- [Overview](#overview)
- [Release Steps](#release-steps)
- [Rollback Steps](#rollback-steps)
- [References](#references)

## Overview
Caribe Mail Connect is part of PRMCE's CEMI Core and uses Cloudflare for cloud infrastructure. Releases prioritize cultural verification and rural accessibility across ventures like Lelolai and EcosystemVentures3D.

## Release Steps
1. Update the [CHANGELOG](../../CHANGELOG.md) and version numbers.
2. Commit changes and create a tag `vX.Y.Z` on GitHub.
3. Deploy via Cloudflare using `npm run build` and upload assets.
4. Store secrets in HashiCorp Vault and verify integration with the shared cultural database.
5. Coordinate announcements across ventures and Urban Latin Media.

## Rollback Steps
1. Revert to the previous Git tag: `git checkout vX.Y.Z`.
2. Redeploy prior artifacts through Cloudflare.
3. Disable new features through environment flags managed by HashiCorp Vault.
4. Notify affected ventures, including Lelolai, Studio Flow X, and Financbase.

## References
- [Cultural Verification](../cultural/cultural-verification-implementation.md)
- [Security Implementation](../security/security-implementation.md)
