/**
 * Compliance Framework Service
 * Story 1: Clear Product Shape - Compliance Framework
 * 
 * Comprehensive compliance management for GDPR, SOC2, ISO 27001,
 * CCPA, HIPAA, and other regulatory requirements
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// COMPLIANCE TYPES
// =====================================================

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version: string;
  jurisdiction: string[];
  requirements: ComplianceRequirement[];
  certification_required: boolean;
  audit_frequency: 'annual' | 'biannual' | 'quarterly' | 'monthly';
  last_assessment: string | null;
  next_assessment: string | null;
  compliance_status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_assessed';
}

export interface ComplianceRequirement {
  id: string;
  framework_id: string;
  category: string;
  title: string;
  description: string;
  control_id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  implementation_status: 'implemented' | 'in_progress' | 'planned' | 'not_started';
  evidence_required: boolean;
  evidence_documents: string[];
  responsible_team: string;
  due_date: string | null;
  last_reviewed: string | null;
  notes: string;
}

export interface ComplianceAssessment {
  id: string;
  framework_id: string;
  assessment_date: string;
  assessor: string;
  assessment_type: 'internal' | 'external' | 'certification';
  overall_score: number;
  findings: ComplianceFinding[];
  recommendations: string[];
  next_assessment_date: string;
  certification_status?: 'certified' | 'pending' | 'expired' | 'revoked';
}

export interface ComplianceFinding {
  id: string;
  requirement_id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  finding_type: 'gap' | 'weakness' | 'observation' | 'strength';
  description: string;
  remediation_plan: string;
  target_date: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  assigned_to: string;
}

export interface DataProcessingActivity {
  id: string;
  name: string;
  description: string;
  data_controller: string;
  data_processor: string;
  purpose: string[];
  legal_basis: string;
  data_categories: string[];
  data_subjects: string[];
  recipients: string[];
  retention_period: string;
  security_measures: string[];
  cross_border_transfers: boolean;
  transfer_safeguards?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// COMPLIANCE FRAMEWORKS DEFINITION
// =====================================================

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'gdpr',
    name: 'General Data Protection Regulation (GDPR)',
    description: 'EU regulation on data protection and privacy',
    version: '2018',
    jurisdiction: ['EU', 'EEA'],
    certification_required: false,
    audit_frequency: 'annual',
    last_assessment: null,
    next_assessment: null,
    compliance_status: 'not_assessed',
    requirements: [
      {
        id: 'gdpr_001',
        framework_id: 'gdpr',
        category: 'Data Subject Rights',
        title: 'Right to Access',
        description: 'Individuals have the right to access their personal data',
        control_id: 'Art. 15',
        priority: 'critical',
        implementation_status: 'not_started',
        evidence_required: true,
        evidence_documents: [],
        responsible_team: 'Engineering',
        due_date: null,
        last_reviewed: null,
        notes: ''
      },
      {
        id: 'gdpr_002',
        framework_id: 'gdpr',
        category: 'Data Subject Rights',
        title: 'Right to Rectification',
        description: 'Individuals have the right to correct inaccurate personal data',
        control_id: 'Art. 16',
        priority: 'high',
        implementation_status: 'not_started',
        evidence_required: true,
        evidence_documents: [],
        responsible_team: 'Engineering',
        due_date: null,
        last_reviewed: null,
        notes: ''
      },
      {
        id: 'gdpr_003',
        framework_id: 'gdpr',
        category: 'Data Subject Rights',
        title: 'Right to Erasure',
        description: 'Individuals have the right to have their personal data deleted',
        control_id: 'Art. 17',
        priority: 'critical',
        implementation_status: 'not_started',
        evidence_required: true,
        evidence_documents: [],
        responsible_team: 'Engineering',
        due_date: null,
        last_reviewed: null,
        notes: ''
      }
    ]
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    description: 'Security, Availability, Processing Integrity, Confidentiality, and Privacy',
    version: '2017',
    jurisdiction: ['US'],
    certification_required: true,
    audit_frequency: 'annual',
    last_assessment: null,
    next_assessment: null,
    compliance_status: 'not_assessed',
    requirements: [
      {
        id: 'soc2_001',
        framework_id: 'soc2',
        category: 'Security',
        title: 'Access Controls',
        description: 'Logical and physical access controls to protect against unauthorized access',
        control_id: 'CC6.1',
        priority: 'critical',
        implementation_status: 'not_started',
        evidence_required: true,
        evidence_documents: [],
        responsible_team: 'Security',
        due_date: null,
        last_reviewed: null,
        notes: ''
      },
      {
        id: 'soc2_002',
        framework_id: 'soc2',
        category: 'Security',
        title: 'System Monitoring',
        description: 'Monitoring of system components and security events',
        control_id: 'CC7.1',
        priority: 'high',
        implementation_status: 'not_started',
        evidence_required: true,
        evidence_documents: [],
        responsible_team: 'Operations',
        due_date: null,
        last_reviewed: null,
        notes: ''
      }
    ]
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    description: 'Information Security Management System',
    version: '2013',
    jurisdiction: ['Global'],
    certification_required: true,
    audit_frequency: 'annual',
    last_assessment: null,
    next_assessment: null,
    compliance_status: 'not_assessed',
    requirements: [
      {
        id: 'iso27001_001',
        framework_id: 'iso27001',
        category: 'Information Security Policy',
        title: 'Information Security Policy',
        description: 'Management direction and support for information security',
        control_id: 'A.5.1.1',
        priority: 'critical',
        implementation_status: 'not_started',
        evidence_required: true,
        evidence_documents: [],
        responsible_team: 'Security',
        due_date: null,
        last_reviewed: null,
        notes: ''
      }
    ]
  },
  {
    id: 'ccpa',
    name: 'California Consumer Privacy Act (CCPA)',
    description: 'California state statute intended to enhance privacy rights',
    version: '2020',
    jurisdiction: ['California', 'US'],
    certification_required: false,
    audit_frequency: 'annual',
    last_assessment: null,
    next_assessment: null,
    compliance_status: 'not_assessed',
    requirements: [
      {
        id: 'ccpa_001',
        framework_id: 'ccpa',
        category: 'Consumer Rights',
        title: 'Right to Know',
        description: 'Consumers have the right to know what personal information is collected',
        control_id: 'Sec. 1798.100',
        priority: 'high',
        implementation_status: 'not_started',
        evidence_required: true,
        evidence_documents: [],
        responsible_team: 'Legal',
        due_date: null,
        last_reviewed: null,
        notes: ''
      }
    ]
  }
];

// =====================================================
// COMPLIANCE SERVICE
// =====================================================

export class ComplianceService {

  /**
   * Get all compliance frameworks
   */
  static getComplianceFrameworks(): ComplianceFramework[] {
    return COMPLIANCE_FRAMEWORKS;
  }

  /**
   * Get specific compliance framework
   */
  static getComplianceFramework(frameworkId: string): ComplianceFramework | null {
    return COMPLIANCE_FRAMEWORKS.find(framework => framework.id === frameworkId) || null;
  }

  /**
   * Get compliance requirements for framework
   */
  static getComplianceRequirements(frameworkId: string): ComplianceRequirement[] {
    const framework = this.getComplianceFramework(frameworkId);
    return framework?.requirements || [];
  }

  /**
   * Update compliance requirement status
   */
  static async updateRequirementStatus(
    requirementId: string,
    status: ComplianceRequirement['implementation_status'],
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('compliance_requirements')
        .update({
          implementation_status: status,
          notes: notes || '',
          last_reviewed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requirementId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating requirement status:', error);
      return false;
    }
  }

  /**
   * Create compliance assessment
   */
  static async createAssessment(
    frameworkId: string,
    assessmentData: Partial<ComplianceAssessment>
  ): Promise<ComplianceAssessment | null> {
    try {
      const assessment: ComplianceAssessment = {
        id: `assessment_${Date.now()}`,
        framework_id: frameworkId,
        assessment_date: new Date().toISOString(),
        assessor: assessmentData.assessor || 'Internal',
        assessment_type: assessmentData.assessment_type || 'internal',
        overall_score: assessmentData.overall_score || 0,
        findings: assessmentData.findings || [],
        recommendations: assessmentData.recommendations || [],
        next_assessment_date: assessmentData.next_assessment_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        certification_status: assessmentData.certification_status
      };

      const { error } = await supabase
        .from('compliance_assessments')
        .insert(assessment);

      if (error) throw error;
      return assessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      return null;
    }
  }

  /**
   * Get compliance dashboard data
   */
  static async getComplianceDashboard(subscriptionId: string): Promise<any> {
    try {
      const frameworks = this.getComplianceFrameworks();
      const dashboardData = {
        frameworks: frameworks.length,
        compliant_frameworks: frameworks.filter(f => f.compliance_status === 'compliant').length,
        total_requirements: frameworks.reduce((sum, f) => sum + f.requirements.length, 0),
        implemented_requirements: frameworks.reduce((sum, f) => 
          sum + f.requirements.filter(r => r.implementation_status === 'implemented').length, 0
        ),
        critical_gaps: frameworks.reduce((sum, f) => 
          sum + f.requirements.filter(r => 
            r.priority === 'critical' && r.implementation_status !== 'implemented'
          ).length, 0
        ),
        upcoming_assessments: frameworks.filter(f => {
          if (!f.next_assessment) return false;
          const nextAssessment = new Date(f.next_assessment);
          const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          return nextAssessment <= thirtyDaysFromNow;
        }).length,
        framework_status: frameworks.map(f => ({
          id: f.id,
          name: f.name,
          status: f.compliance_status,
          requirements_total: f.requirements.length,
          requirements_implemented: f.requirements.filter(r => r.implementation_status === 'implemented').length,
          next_assessment: f.next_assessment
        }))
      };

      return dashboardData;
    } catch (error) {
      console.error('Error getting compliance dashboard:', error);
      return null;
    }
  }

  /**
   * Create data processing activity (GDPR Article 30)
   */
  static async createDataProcessingActivity(
    subscriptionId: string,
    activityData: Partial<DataProcessingActivity>
  ): Promise<DataProcessingActivity | null> {
    try {
      const activity: DataProcessingActivity = {
        id: `dpa_${Date.now()}`,
        name: activityData.name || '',
        description: activityData.description || '',
        data_controller: activityData.data_controller || '',
        data_processor: activityData.data_processor || '',
        purpose: activityData.purpose || [],
        legal_basis: activityData.legal_basis || '',
        data_categories: activityData.data_categories || [],
        data_subjects: activityData.data_subjects || [],
        recipients: activityData.recipients || [],
        retention_period: activityData.retention_period || '',
        security_measures: activityData.security_measures || [],
        cross_border_transfers: activityData.cross_border_transfers || false,
        transfer_safeguards: activityData.transfer_safeguards,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('data_processing_activities')
        .insert({
          ...activity,
          subscription_id: subscriptionId
        });

      if (error) throw error;
      return activity;
    } catch (error) {
      console.error('Error creating data processing activity:', error);
      return null;
    }
  }

  /**
   * Generate compliance report
   */
  static async generateComplianceReport(
    frameworkId: string,
    subscriptionId: string
  ): Promise<any> {
    try {
      const framework = this.getComplianceFramework(frameworkId);
      if (!framework) return null;

      const requirements = framework.requirements;
      const implementedCount = requirements.filter(r => r.implementation_status === 'implemented').length;
      const inProgressCount = requirements.filter(r => r.implementation_status === 'in_progress').length;
      const notStartedCount = requirements.filter(r => r.implementation_status === 'not_started').length;

      const criticalGaps = requirements.filter(r =>
        r.priority === 'critical' && r.implementation_status !== 'implemented'
      );

      const report = {
        framework: framework.name,
        generated_at: new Date().toISOString(),
        overall_compliance: Math.round((implementedCount / requirements.length) * 100),
        summary: {
          total_requirements: requirements.length,
          implemented: implementedCount,
          in_progress: inProgressCount,
          not_started: notStartedCount,
          critical_gaps: criticalGaps.length
        },
        requirements_by_category: this.groupRequirementsByCategory(requirements),
        critical_gaps: criticalGaps,
        recommendations: this.generateRecommendations(requirements),
        next_steps: this.generateNextSteps(requirements)
      };

      return report;
    } catch (error) {
      console.error('Error generating compliance report:', error);
      return null;
    }
  }

  /**
   * Check compliance readiness for framework
   */
  static checkComplianceReadiness(frameworkId: string): {
    ready: boolean;
    readiness_score: number;
    missing_requirements: ComplianceRequirement[];
    recommendations: string[];
  } {
    const framework = this.getComplianceFramework(frameworkId);
    if (!framework) {
      return {
        ready: false,
        readiness_score: 0,
        missing_requirements: [],
        recommendations: ['Framework not found']
      };
    }

    const requirements = framework.requirements;
    const implementedCount = requirements.filter(r => r.implementation_status === 'implemented').length;
    const readinessScore = Math.round((implementedCount / requirements.length) * 100);

    const missingRequirements = requirements.filter(r =>
      r.implementation_status !== 'implemented'
    );

    const criticalMissing = missingRequirements.filter(r => r.priority === 'critical');
    const isReady = criticalMissing.length === 0 && readinessScore >= 90;

    const recommendations = [];
    if (criticalMissing.length > 0) {
      recommendations.push(`Complete ${criticalMissing.length} critical requirements`);
    }
    if (readinessScore < 90) {
      recommendations.push(`Achieve at least 90% compliance (currently ${readinessScore}%)`);
    }

    return {
      ready: isReady,
      readiness_score: readinessScore,
      missing_requirements: missingRequirements,
      recommendations
    };
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static groupRequirementsByCategory(requirements: ComplianceRequirement[]): any {
    const grouped: Record<string, any> = {};
    
    requirements.forEach(req => {
      if (!grouped[req.category]) {
        grouped[req.category] = {
          total: 0,
          implemented: 0,
          in_progress: 0,
          not_started: 0
        };
      }
      
      grouped[req.category].total++;
      grouped[req.category][req.implementation_status]++;
    });

    return grouped;
  }

  private static generateRecommendations(requirements: ComplianceRequirement[]): string[] {
    const recommendations: string[] = [];
    
    const criticalGaps = requirements.filter(r => 
      r.priority === 'critical' && r.implementation_status !== 'implemented'
    );
    
    if (criticalGaps.length > 0) {
      recommendations.push(`Address ${criticalGaps.length} critical compliance gaps immediately`);
    }

    const overdueRequirements = requirements.filter(r => 
      r.due_date && new Date(r.due_date) < new Date() && r.implementation_status !== 'implemented'
    );
    
    if (overdueRequirements.length > 0) {
      recommendations.push(`Complete ${overdueRequirements.length} overdue requirements`);
    }

    const noEvidenceRequirements = requirements.filter(r => 
      r.evidence_required && r.evidence_documents.length === 0 && r.implementation_status === 'implemented'
    );
    
    if (noEvidenceRequirements.length > 0) {
      recommendations.push(`Collect evidence for ${noEvidenceRequirements.length} implemented requirements`);
    }

    return recommendations;
  }

  private static generateNextSteps(requirements: ComplianceRequirement[]): string[] {
    const nextSteps: string[] = [];
    
    const inProgress = requirements.filter(r => r.implementation_status === 'in_progress');
    if (inProgress.length > 0) {
      nextSteps.push(`Complete ${inProgress.length} requirements currently in progress`);
    }

    const planned = requirements.filter(r => r.implementation_status === 'planned');
    if (planned.length > 0) {
      nextSteps.push(`Begin implementation of ${planned.length} planned requirements`);
    }

    const notStarted = requirements.filter(r => r.implementation_status === 'not_started');
    if (notStarted.length > 0) {
      nextSteps.push(`Plan implementation for ${notStarted.length} requirements not yet started`);
    }

    return nextSteps;
  }
}
