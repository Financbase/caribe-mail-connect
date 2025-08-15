# API Versioning

*Document updated: 2024-08-30*

## Table of Contents
- [Overview](#overview)
- [Version Numbering](#version-numbering)
- [Deprecation Policy](#deprecation-policy)
- [Backward Compatibility](#backward-compatibility)
- [References](#references)

## Overview
Caribe Mail Connect follows semantic versioning to ensure predictable integration across PRMCE ventures.

## Version Numbering
The API adheres to the MAJOR.MINOR.PATCH scheme:
- **MAJOR** versions introduce incompatible changes.
- **MINOR** versions add backward-compatible functionality.
- **PATCH** versions deliver backward-compatible bug fixes.

## Deprecation Policy
Deprecated endpoints remain functional for at least one release cycle. Clients should migrate before the next MAJOR release.

## Backward Compatibility
Minor and patch releases must not break existing clients. Experimental features are hidden behind explicit opt-in parameters.

## References
- [Glossary](../glossary.md)
