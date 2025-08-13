# Tenancy, Pricing, and Compliance Overview

*Last updated: August 13, 2025*

## Table of Contents
- [Tenancy Separation](#tenancy-separation)
- [Pricing Tiers](#pricing-tiers)
- [Compliance Commitments](#compliance-commitments)
- [Component Mapping](#component-mapping)

## Tenancy Separation
Caribe Mail Connect operates within the PRMCE ecosystem, aligning with the CEMI Core to maintain clear boundaries between tenants. Each location operates as an isolated tenant, ensuring data and configuration separation across ventures. Location-level metadata, such as address and operating hours, is maintained per tenant to preserve integrity and privacy.

## Pricing Tiers
The platform supports multiple pricing tiers to match varying service needs. Current tiers include **Standard**, **Premium**, and **Enterprise**. Tiers determine available features and service-level agreements for each tenant. The `LocationManagement` page captures the tier assigned to each tenant so that billing and feature access reflect the selected level.

## Compliance Commitments
PRMCE prioritizes cultural authenticity and regulatory compliance. Caribe Mail Connect enforces document tracking, expiration monitoring, and sensitive data handling to honor these commitments. Compliance metrics, review workflows, and urgency indicators help maintain adherence to regional and cultural standards.

## Component Mapping
- **LocationManagement (`src/pages/LocationManagement.tsx`)** – Captures tenant-specific metadata, including the `pricing_tier` field, and supports location isolation within the CEMI Core.
- **ComplianceDashboard (`src/components/documents/ComplianceDashboard.tsx`)** – Aggregates document status, highlights expiring or sensitive records, and summarizes compliance health for each tenant.

This document is part of ongoing efforts to ensure rural accessibility, cultural verification, and cross-venture integration throughout the PRMCE initiatives.
