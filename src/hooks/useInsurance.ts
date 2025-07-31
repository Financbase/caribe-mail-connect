import { useState, useEffect, useCallback } from 'react';
import { 
  InsurancePolicy, 
  InsuranceClaim, 
  RiskAssessment, 
  FraudAlert,
  InsuranceStats,
  CoverageCalculator,
  ClaimsFilter,
  PolicyFilter,
  ClaimStatus,
  PolicyStatus,
  CoverageType
} from '@/types/insurance';
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
} from '@/data/insuranceData';

export function useInsurance() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>(mockPolicies);
  const [claims, setClaims] = useState<InsuranceClaim[]>(mockClaims);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(mockRiskAssessments);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(mockFraudAlerts);
  const [stats, setStats] = useState<InsuranceStats>(insuranceStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Policy Management
  const getPolicies = useCallback((filter?: PolicyFilter) => {
    if (!filter) return policies;
    
    return policies.filter(policy => {
      if (filter.status && !filter.status.includes(policy.status)) return false;
      if (filter.coverageType && !filter.coverageType.includes(policy.coverageType)) return false;
      if (filter.insuranceCompany && !filter.insuranceCompany.includes(policy.insuranceCompany.name)) return false;
      if (filter.customerId && policy.customerId !== filter.customerId) return false;
      if (filter.dateRange) {
        const policyDate = new Date(policy.startDate);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        if (policyDate < startDate || policyDate > endDate) return false;
      }
      return true;
    });
  }, [policies]);

  const getPolicy = useCallback((id: string) => {
    return getPolicyById(id);
  }, []);

  const createPolicy = useCallback(async (policyData: Partial<InsurancePolicy>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPolicy: InsurancePolicy = {
        id: `POL-${Date.now()}`,
        customerId: policyData.customerId || '',
        customerName: policyData.customerName || '',
        policyNumber: `POL-${Date.now()}`,
        insuranceCompany: policyData.insuranceCompany || insuranceCompanies[0],
        coverageType: policyData.coverageType || 'Standard',
        coverageAmount: policyData.coverageAmount || 5000,
        premium: policyData.premium || 35,
        deductible: policyData.deductible || 100,
        startDate: policyData.startDate || new Date().toISOString().split('T')[0],
        endDate: policyData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active',
        autoRenew: policyData.autoRenew || true,
        documents: policyData.documents || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPolicies(prev => [...prev, newPolicy]);
      return newPolicy;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePolicy = useCallback(async (id: string, updates: Partial<InsurancePolicy>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPolicies(prev => prev.map(policy => 
        policy.id === id 
          ? { ...policy, ...updates, updatedAt: new Date().toISOString() }
          : policy
      ));
      
      return getPolicyById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update policy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Claims Management
  const getClaims = useCallback((filter?: ClaimsFilter) => {
    if (!filter) return claims;
    
    return claims.filter(claim => {
      if (filter.status && !filter.status.includes(claim.status)) return false;
      if (filter.type && !filter.type.includes(claim.claimType)) return false;
      if (filter.priority && !filter.priority.includes(claim.priority)) return false;
      if (filter.assignedTo && claim.assignedTo !== filter.assignedTo) return false;
      if (filter.customerId && claim.customerId !== filter.customerId) return false;
      if (filter.dateRange) {
        const claimDate = new Date(claim.reportedAt);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        if (claimDate < startDate || claimDate > endDate) return false;
      }
      return true;
    });
  }, [claims]);

  const getClaim = useCallback((id: string) => {
    return claims.find(claim => claim.id === id);
  }, [claims]);

  const createClaim = useCallback(async (claimData: Partial<InsuranceClaim>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClaim: InsuranceClaim = {
        id: `CLM-${Date.now()}`,
        claimNumber: `CLM-${Date.now()}`,
        policyId: claimData.policyId || '',
        customerId: claimData.customerId || '',
        customerName: claimData.customerName || '',
        packageId: claimData.packageId,
        claimType: claimData.claimType || 'Package Damage',
        description: claimData.description || '',
        reportedAmount: claimData.reportedAmount || 0,
        estimatedAmount: claimData.estimatedAmount || 0,
        status: 'Reported',
        priority: claimData.priority || 'Medium',
        reportedAt: new Date().toISOString(),
        timeline: [{
          id: `timeline-${Date.now()}`,
          timestamp: new Date().toISOString(),
          eventType: 'Claim Filed',
          description: 'Reclamo presentado',
          performedBy: claimData.customerName || 'Cliente'
        }],
        documents: claimData.documents || [],
        photos: claimData.photos || [],
        notes: claimData.notes || [],
        riskLevel: 'Low'
      };
      
      setClaims(prev => [...prev, newClaim]);
      return newClaim;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create claim');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClaim = useCallback(async (id: string, updates: Partial<InsuranceClaim>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClaims(prev => prev.map(claim => 
        claim.id === id 
          ? { ...claim, ...updates }
          : claim
      ));
      
      return claims.find(claim => claim.id === id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update claim');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [claims]);

  // Risk Assessment
  const getRiskAssessment = useCallback((customerId: string) => {
    return getRiskAssessmentByCustomerId(customerId);
  }, []);

  const updateRiskAssessment = useCallback(async (customerId: string, updates: Partial<RiskAssessment>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRiskAssessments(prev => prev.map(assessment => 
        assessment.customerId === customerId 
          ? { ...assessment, ...updates, lastUpdated: new Date().toISOString() }
          : assessment
      ));
      
      return getRiskAssessmentByCustomerId(customerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update risk assessment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fraud Alerts
  const getFraudAlerts = useCallback((claimId?: string) => {
    if (claimId) {
      return getFraudAlertsByClaimId(claimId);
    }
    return fraudAlerts;
  }, [fraudAlerts]);

  const resolveFraudAlert = useCallback(async (alertId: string, resolvedBy: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFraudAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolvedAt: new Date().toISOString(), resolvedBy }
          : alert
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve fraud alert');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Coverage Calculator
  const calculateCoverage = useCallback((packageValue: number, coverageType: CoverageType) => {
    const tier = coverageTiers.find(t => t.name === coverageType);
    if (!tier) return { premium: 0, deductible: 0, coverage: 0 };
    
    const coverage = Math.min(packageValue, tier.maxCoverage);
    const premium = tier.basePremium + (packageValue * 0.01);
    
    return {
      packageValue,
      coverageTier: coverageType,
      deductible: tier.deductible,
      premium: Math.round(premium * 100) / 100,
      coverageAmount: coverage,
      monthlyCost: Math.round(premium * 100) / 100,
      annualCost: Math.round(premium * 12 * 100) / 100
    };
  }, []);

  // Statistics
  const getStats = useCallback(() => {
    return stats;
  }, [stats]);

  const refreshStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Recalculate stats based on current data
      const newStats: InsuranceStats = {
        totalPolicies: policies.length,
        activePolicies: policies.filter(p => p.status === 'Active').length,
        totalClaims: claims.length,
        openClaims: claims.filter(c => ['Reported', 'Under Review', 'Investigation', 'Documentation Required'].includes(c.status)).length,
        totalPremium: policies.reduce((sum, p) => sum + p.premium, 0),
        totalPayouts: claims.filter(c => c.status === 'Settled').reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
        averageClaimAmount: claims.length > 0 ? claims.reduce((sum, c) => sum + c.reportedAmount, 0) / claims.length : 0,
        claimsByStatus: {
          'Reported': claims.filter(c => c.status === 'Reported').length,
          'Under Review': claims.filter(c => c.status === 'Under Review').length,
          'Investigation': claims.filter(c => c.status === 'Investigation').length,
          'Documentation Required': claims.filter(c => c.status === 'Documentation Required').length,
          'Approved': claims.filter(c => c.status === 'Approved').length,
          'Denied': claims.filter(c => c.status === 'Denied').length,
          'Settled': claims.filter(c => c.status === 'Settled').length,
          'Closed': claims.filter(c => c.status === 'Closed').length
        },
        claimsByType: {
          'Package Damage': claims.filter(c => c.claimType === 'Package Damage').length,
          'Package Loss': claims.filter(c => c.claimType === 'Package Loss').length,
          'Package Delay': claims.filter(c => c.claimType === 'Package Delay').length,
          'Theft': claims.filter(c => c.claimType === 'Theft').length,
          'Natural Disaster': claims.filter(c => c.claimType === 'Natural Disaster').length,
          'Handling Error': claims.filter(c => c.claimType === 'Handling Error').length,
          'Other': claims.filter(c => c.claimType === 'Other').length
        },
        monthlyTrends: stats.monthlyTrends // Keep existing trends for now
      };
      
      setStats(newStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh stats');
    } finally {
      setLoading(false);
    }
  }, [policies, claims, stats.monthlyTrends]);

  return {
    // State
    policies,
    claims,
    riskAssessments,
    fraudAlerts,
    stats,
    loading,
    error,
    
    // Policy Management
    getPolicies,
    getPolicy,
    createPolicy,
    updatePolicy,
    
    // Claims Management
    getClaims,
    getClaim,
    createClaim,
    updateClaim,
    
    // Risk Assessment
    getRiskAssessment,
    updateRiskAssessment,
    
    // Fraud Alerts
    getFraudAlerts,
    resolveFraudAlert,
    
    // Coverage Calculator
    calculateCoverage,
    
    // Statistics
    getStats,
    refreshStats
  };
} 