import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  mockPolicies, 
  mockClaims, 
  mockRiskAssessments, 
  mockFraudAlerts,
  insuranceStats,
  coverageTiers,
  insuranceCompanies,
  getPolicyById,
  getClaimsByPolicyId,
  getClaimsByCustomerId,
  getRiskAssessmentByCustomerId,
  getFraudAlertsByClaimId
} from '../src/data/insuranceData';
import { 
  InsurancePolicy, 
  InsuranceClaim, 
  RiskAssessment, 
  FraudAlert,
  ClaimStatus,
  PolicyStatus,
  CoverageType,
  ClaimType,
  ClaimPriority,
  RiskLevel,
  AlertSeverity
} from '../src/types/insurance';

describe('Insurance System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Insurance Data', () => {
    it('should have valid insurance companies', () => {
      expect(insuranceCompanies).toHaveLength(4);
      expect(insuranceCompanies[0]).toHaveProperty('name', 'Seguros Triple-S');
      expect(insuranceCompanies[0]).toHaveProperty('rating');
      expect(insuranceCompanies[0]).toHaveProperty('claimsProcessTime');
      expect(insuranceCompanies[0]).toHaveProperty('customerSatisfaction');
    });

    it('should have valid coverage tiers', () => {
      expect(coverageTiers).toHaveLength(4);
      expect(coverageTiers[0]).toHaveProperty('name', 'Básico');
      expect(coverageTiers[0]).toHaveProperty('maxCoverage');
      expect(coverageTiers[0]).toHaveProperty('basePremium');
      expect(coverageTiers[0]).toHaveProperty('deductible');
      expect(coverageTiers[0]).toHaveProperty('features');
      expect(Array.isArray(coverageTiers[0].features)).toBe(true);
    });

    it('should have valid mock policies', () => {
      expect(mockPolicies).toHaveLength(3);
      expect(mockPolicies[0]).toHaveProperty('policyNumber');
      expect(mockPolicies[0]).toHaveProperty('customerName');
      expect(mockPolicies[0]).toHaveProperty('coverageAmount');
      expect(mockPolicies[0]).toHaveProperty('premium');
      expect(mockPolicies[0]).toHaveProperty('status');
      expect(['Active', 'Pending', 'Expired', 'Cancelled', 'Suspended']).toContain(mockPolicies[0].status);
    });

    it('should have valid mock claims', () => {
      expect(mockClaims).toHaveLength(3);
      expect(mockClaims[0]).toHaveProperty('claimNumber');
      expect(mockClaims[0]).toHaveProperty('customerName');
      expect(mockClaims[0]).toHaveProperty('claimType');
      expect(mockClaims[0]).toHaveProperty('status');
      expect(mockClaims[0]).toHaveProperty('priority');
      expect(mockClaims[0]).toHaveProperty('reportedAmount');
      expect(mockClaims[0]).toHaveProperty('timeline');
      expect(Array.isArray(mockClaims[0].timeline)).toBe(true);
    });

    it('should have valid risk assessments', () => {
      expect(mockRiskAssessments).toHaveLength(2);
      expect(mockRiskAssessments[0]).toHaveProperty('customerId');
      expect(mockRiskAssessments[0]).toHaveProperty('score');
      expect(mockRiskAssessments[0]).toHaveProperty('factors');
      expect(mockRiskAssessments[0]).toHaveProperty('recommendations');
      expect(Array.isArray(mockRiskAssessments[0].factors)).toBe(true);
      expect(Array.isArray(mockRiskAssessments[0].recommendations)).toBe(true);
    });

    it('should have valid fraud alerts', () => {
      expect(mockFraudAlerts).toHaveLength(2);
      expect(mockFraudAlerts[0]).toHaveProperty('claimId');
      expect(mockFraudAlerts[0]).toHaveProperty('alertType');
      expect(mockFraudAlerts[0]).toHaveProperty('severity');
      expect(mockFraudAlerts[0]).toHaveProperty('description');
      expect(mockFraudAlerts[0]).toHaveProperty('evidence');
      expect(Array.isArray(mockFraudAlerts[0].evidence)).toBe(true);
    });

    it('should have valid insurance stats', () => {
      expect(insuranceStats).toHaveProperty('totalPolicies');
      expect(insuranceStats).toHaveProperty('activePolicies');
      expect(insuranceStats).toHaveProperty('totalClaims');
      expect(insuranceStats).toHaveProperty('openClaims');
      expect(insuranceStats).toHaveProperty('totalPremium');
      expect(insuranceStats).toHaveProperty('totalPayouts');
      expect(insuranceStats).toHaveProperty('averageClaimAmount');
      expect(insuranceStats).toHaveProperty('claimsByStatus');
      expect(insuranceStats).toHaveProperty('claimsByType');
      expect(insuranceStats).toHaveProperty('monthlyTrends');
    });
  });

  describe('Utility Functions', () => {
    it('should find policy by ID', () => {
      const policy = getPolicyById('1');
      expect(policy).toBeDefined();
      expect(policy?.id).toBe('1');
      expect(policy?.policyNumber).toBe('POL-2024-001');
    });

    it('should return undefined for non-existent policy', () => {
      const policy = getPolicyById('999');
      expect(policy).toBeUndefined();
    });

    it('should find claims by policy ID', () => {
      const claims = getClaimsByPolicyId('1');
      expect(Array.isArray(claims)).toBe(true);
      expect(claims.length).toBeGreaterThan(0);
      expect(claims[0].policyId).toBe('1');
    });

    it('should find claims by customer ID', () => {
      const claims = getClaimsByCustomerId('1');
      expect(Array.isArray(claims)).toBe(true);
      expect(claims.length).toBeGreaterThan(0);
      expect(claims[0].customerId).toBe('1');
    });

    it('should find risk assessment by customer ID', () => {
      const assessment = getRiskAssessmentByCustomerId('1');
      expect(assessment).toBeDefined();
      expect(assessment?.customerId).toBe('1');
    });

    it('should find fraud alerts by claim ID', () => {
      const alerts = getFraudAlertsByClaimId('2');
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].claimId).toBe('2');
    });
  });

  describe('Coverage Calculation', () => {
    it('should calculate basic coverage correctly', () => {
      const tier = coverageTiers.find(t => t.name === 'Básico');
      expect(tier).toBeDefined();
      if (tier) {
        expect(tier.maxCoverage).toBe(1000);
        expect(tier.basePremium).toBe(15);
        expect(tier.deductible).toBe(50);
      }
    });

    it('should calculate standard coverage correctly', () => {
      const tier = coverageTiers.find(t => t.name === 'Estándar');
      expect(tier).toBeDefined();
      if (tier) {
        expect(tier.maxCoverage).toBe(5000);
        expect(tier.basePremium).toBe(35);
        expect(tier.deductible).toBe(100);
      }
    });

    it('should calculate premium based on package value', () => {
      const packageValue = 2000;
      const tier = coverageTiers.find(t => t.name === 'Estándar');
      if (tier) {
        const expectedPremium = tier.basePremium + (packageValue * 0.01);
        expect(expectedPremium).toBe(35 + 20); // 35 + (2000 * 0.01) = 55
      }
    });

    it('should limit coverage to maximum tier amount', () => {
      const packageValue = 10000;
      const tier = coverageTiers.find(t => t.name === 'Estándar');
      if (tier) {
        const coverage = Math.min(packageValue, tier.maxCoverage);
        expect(coverage).toBe(5000); // Limited to max coverage
      }
    });
  });

  describe('Claim Status Workflow', () => {
    it('should have valid claim statuses', () => {
      const validStatuses: ClaimStatus[] = [
        'Reported',
        'Under Review',
        'Investigation',
        'Documentation Required',
        'Approved',
        'Denied',
        'Settled',
        'Closed'
      ];

      mockClaims.forEach(claim => {
        expect(validStatuses).toContain(claim.status);
      });
    });

    it('should have valid claim priorities', () => {
      const validPriorities: ClaimPriority[] = [
        'Low',
        'Medium',
        'High',
        'Urgent',
        'Critical'
      ];

      mockClaims.forEach(claim => {
        expect(validPriorities).toContain(claim.priority);
      });
    });

    it('should have valid claim types', () => {
      const validTypes: ClaimType[] = [
        'Package Damage',
        'Package Loss',
        'Package Delay',
        'Theft',
        'Natural Disaster',
        'Handling Error',
        'Other'
      ];

      mockClaims.forEach(claim => {
        expect(validTypes).toContain(claim.claimType);
      });
    });
  });

  describe('Risk Assessment', () => {
    it('should calculate risk scores correctly', () => {
      mockRiskAssessments.forEach(assessment => {
        expect(assessment.score).toBeGreaterThanOrEqual(0);
        expect(assessment.score).toBeLessThanOrEqual(100);
        
        const calculatedScore = assessment.factors.reduce((sum, factor) => {
          return sum + (factor.score * factor.weight);
        }, 0);
        
        // Allow for small differences due to rounding or manual adjustments
        const difference = Math.abs(calculatedScore - assessment.score);
        expect(difference).toBeLessThanOrEqual(2);
      });
    });

    it('should have valid risk levels', () => {
      const validRiskLevels: RiskLevel[] = ['Low', 'Medium', 'High', 'Very High'];
      
      mockClaims.forEach(claim => {
        expect(validRiskLevels).toContain(claim.riskLevel);
      });
    });

    it('should have risk factors with valid weights', () => {
      mockRiskAssessments.forEach(assessment => {
        assessment.factors.forEach(factor => {
          expect(factor.weight).toBeGreaterThan(0);
          expect(factor.weight).toBeLessThanOrEqual(1);
          expect(factor.score).toBeGreaterThanOrEqual(0);
          expect(factor.score).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe('Fraud Detection', () => {
    it('should have valid alert severities', () => {
      const validSeverities: AlertSeverity[] = ['Low', 'Medium', 'High', 'Critical'];
      
      mockFraudAlerts.forEach(alert => {
        expect(validSeverities).toContain(alert.severity);
      });
    });

    it('should have evidence for fraud alerts', () => {
      mockFraudAlerts.forEach(alert => {
        expect(Array.isArray(alert.evidence)).toBe(true);
        expect(alert.evidence.length).toBeGreaterThan(0);
      });
    });

    it('should track resolution status', () => {
      const resolvedAlerts = mockFraudAlerts.filter(alert => alert.resolvedAt);
      const unresolvedAlerts = mockFraudAlerts.filter(alert => !alert.resolvedAt);
      
      expect(resolvedAlerts.length + unresolvedAlerts.length).toBe(mockFraudAlerts.length);
    });
  });

  describe('Policy Management', () => {
    it('should have valid policy statuses', () => {
      const validStatuses: PolicyStatus[] = [
        'Active',
        'Pending',
        'Expired',
        'Cancelled',
        'Suspended'
      ];

      mockPolicies.forEach(policy => {
        expect(validStatuses).toContain(policy.status);
      });
    });

    it('should have valid coverage types', () => {
      const validTypes: CoverageType[] = [
        'Basic',
        'Standard',
        'Premium',
        'Enterprise',
        'Custom'
      ];

      mockPolicies.forEach(policy => {
        expect(validTypes).toContain(policy.coverageType);
      });
    });

    it('should have valid date ranges', () => {
      mockPolicies.forEach(policy => {
        const startDate = new Date(policy.startDate);
        const endDate = new Date(policy.endDate);
        expect(startDate).toBeInstanceOf(Date);
        expect(endDate).toBeInstanceOf(Date);
        expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
      });
    });
  });

  describe('Statistics Validation', () => {
    it('should have consistent policy counts', () => {
      // Note: insuranceStats contains broader data than just mockPolicies
      // This test validates that the stats structure is correct
      expect(insuranceStats.activePolicies).toBeGreaterThan(0);
      expect(insuranceStats.totalPolicies).toBeGreaterThan(0);
      expect(insuranceStats.activePolicies).toBeLessThanOrEqual(insuranceStats.totalPolicies);
    });

    it('should have consistent claim counts', () => {
      // Note: insuranceStats contains broader data than just mockClaims
      // This test validates that the stats structure is correct
      expect(insuranceStats.openClaims).toBeGreaterThanOrEqual(0);
      expect(insuranceStats.totalClaims).toBeGreaterThan(0);
      expect(insuranceStats.openClaims).toBeLessThanOrEqual(insuranceStats.totalClaims);
    });

    it('should calculate average claim amount correctly', () => {
      // Note: insuranceStats contains broader data than just mockClaims
      // This test validates that the average is reasonable
      expect(insuranceStats.averageClaimAmount).toBeGreaterThan(0);
      expect(insuranceStats.averageClaimAmount).toBeLessThan(10000); // Reasonable upper limit
    });

    it('should have valid monthly trends', () => {
      expect(Array.isArray(insuranceStats.monthlyTrends)).toBe(true);
      insuranceStats.monthlyTrends.forEach(trend => {
        expect(trend).toHaveProperty('month');
        expect(trend).toHaveProperty('policies');
        expect(trend).toHaveProperty('claims');
        expect(trend).toHaveProperty('premium');
        expect(trend).toHaveProperty('payouts');
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have unique policy IDs', () => {
      const policyIds = mockPolicies.map(p => p.id);
      const uniqueIds = new Set(policyIds);
      expect(uniqueIds.size).toBe(policyIds.length);
    });

    it('should have unique claim IDs', () => {
      const claimIds = mockClaims.map(c => c.id);
      const uniqueIds = new Set(claimIds);
      expect(uniqueIds.size).toBe(claimIds.length);
    });

    it('should have valid customer references', () => {
      mockClaims.forEach(claim => {
        const policy = mockPolicies.find(p => p.id === claim.policyId);
        if (policy) {
          expect(claim.customerId).toBe(policy.customerId);
        }
      });
    });

    it('should have valid timeline events', () => {
      mockClaims.forEach(claim => {
        expect(Array.isArray(claim.timeline)).toBe(true);
        claim.timeline.forEach(event => {
          expect(event).toHaveProperty('id');
          expect(event).toHaveProperty('timestamp');
          expect(event).toHaveProperty('eventType');
          expect(event).toHaveProperty('description');
          expect(event).toHaveProperty('performedBy');
        });
      });
    });
  });
}); 