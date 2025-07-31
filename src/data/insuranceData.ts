import { 
  InsurancePolicy, 
  InsuranceClaim, 
  InsuranceCompany, 
  CoverageTier, 
  RiskAssessment, 
  FraudAlert, 
  InsuranceStats,
  ClaimStatus,
  ClaimType,
  PolicyStatus,
  CoverageType,
  RiskLevel,
  AlertSeverity,
  FraudAlertType
} from '@/types/insurance';

// Insurance Companies
export const insuranceCompanies: InsuranceCompany[] = [
  {
    id: '1',
    name: 'Seguros Triple-S',
    logo: '/logos/triple-s.svg',
    contactInfo: {
      phone: '(787) 749-4949',
      email: 'info@triple-s.com',
      website: 'https://www.triple-s.com'
    },
    rating: 4.5,
    claimsProcessTime: 7,
    customerSatisfaction: 4.2
  },
  {
    id: '2',
    name: 'Mapfre Insurance',
    logo: '/logos/mapfre.svg',
    contactInfo: {
      phone: '(787) 754-1111',
      email: 'info@mapfre.com',
      website: 'https://www.mapfre.com'
    },
    rating: 4.3,
    claimsProcessTime: 5,
    customerSatisfaction: 4.0
  },
  {
    id: '3',
    name: 'Cooperativa de Seguros Múltiples',
    logo: '/logos/csm.svg',
    contactInfo: {
      phone: '(787) 751-1111',
      email: 'info@csm.com',
      website: 'https://www.csm.com'
    },
    rating: 4.7,
    claimsProcessTime: 6,
    customerSatisfaction: 4.5
  },
  {
    id: '4',
    name: 'Universal Insurance',
    logo: '/logos/universal.svg',
    contactInfo: {
      phone: '(787) 754-8888',
      email: 'info@universal.com',
      website: 'https://www.universal.com'
    },
    rating: 4.1,
    claimsProcessTime: 8,
    customerSatisfaction: 3.8
  }
];

// Coverage Tiers
export const coverageTiers: CoverageTier[] = [
  {
    id: '1',
    name: 'Básico',
    description: 'Cobertura básica para paquetes de bajo valor',
    maxCoverage: 1000,
    basePremium: 15,
    deductible: 50,
    features: [
      'Cobertura por daños durante el transporte',
      'Cobertura por pérdida',
      'Proceso de reclamo simplificado'
    ],
    recommendedFor: ['Paquetes personales', 'Documentos', 'Artículos de bajo valor']
  },
  {
    id: '2',
    name: 'Estándar',
    description: 'Cobertura estándar para la mayoría de paquetes',
    maxCoverage: 5000,
    basePremium: 35,
    deductible: 100,
    features: [
      'Cobertura por daños durante el transporte',
      'Cobertura por pérdida',
      'Cobertura por robo',
      'Proceso de reclamo acelerado',
      'Soporte telefónico 24/7'
    ],
    recommendedFor: ['Electrónicos', 'Ropa', 'Artículos de valor medio']
  },
  {
    id: '3',
    name: 'Premium',
    description: 'Cobertura premium para artículos de alto valor',
    maxCoverage: 25000,
    basePremium: 75,
    deductible: 250,
    features: [
      'Cobertura completa por daños',
      'Cobertura por pérdida total',
      'Cobertura por robo',
      'Cobertura por desastres naturales',
      'Proceso de reclamo prioritario',
      'Evaluación de daños en 24 horas',
      'Soporte personalizado'
    ],
    recommendedFor: ['Electrónicos costosos', 'Joyas', 'Arte', 'Instrumentos musicales']
  },
  {
    id: '4',
    name: 'Empresarial',
    description: 'Cobertura empresarial para envíos comerciales',
    maxCoverage: 100000,
    basePremium: 150,
    deductible: 500,
    features: [
      'Cobertura completa por daños',
      'Cobertura por pérdida total',
      'Cobertura por robo',
      'Cobertura por desastres naturales',
      'Cobertura por interrupción de negocio',
      'Proceso de reclamo VIP',
      'Evaluación de daños en 12 horas',
      'Soporte empresarial dedicado',
      'Reportes de riesgo personalizados'
    ],
    recommendedFor: ['Envíos comerciales', 'Equipos industriales', 'Mercancía de alto valor']
  }
];

// Mock Insurance Policies
export const mockPolicies: InsurancePolicy[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'María González Rodríguez',
    policyNumber: 'POL-2024-001',
    insuranceCompany: insuranceCompanies[0],
    coverageType: 'Standard',
    coverageAmount: 5000,
    premium: 35,
    deductible: 100,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Active',
    autoRenew: true,
    documents: [
      {
        id: '1',
        name: 'Certificado de Póliza',
        type: 'Policy Certificate',
        url: '/documents/policy-cert-001.pdf',
        uploadedAt: '2024-01-01',
        size: 245760
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Carlos Rivera Santos',
    policyNumber: 'POL-2024-002',
    insuranceCompany: insuranceCompanies[1],
    coverageType: 'Premium',
    coverageAmount: 25000,
    premium: 75,
    deductible: 250,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    status: 'Active',
    autoRenew: true,
    documents: [
      {
        id: '2',
        name: 'Términos y Condiciones',
        type: 'Terms and Conditions',
        url: '/documents/terms-002.pdf',
        uploadedAt: '2024-01-15',
        size: 512000
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Ana Lucia Vega Morales',
    policyNumber: 'POL-2024-003',
    insuranceCompany: insuranceCompanies[2],
    coverageType: 'Basic',
    coverageAmount: 1000,
    premium: 15,
    deductible: 50,
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    status: 'Active',
    autoRenew: false,
    documents: [
      {
        id: '3',
        name: 'Detalles de Cobertura',
        type: 'Coverage Details',
        url: '/documents/coverage-003.pdf',
        uploadedAt: '2024-02-01',
        size: 128000
      }
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  }
];

// Mock Insurance Claims
export const mockClaims: InsuranceClaim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2024-001',
    policyId: '1',
    customerId: '1',
    customerName: 'María González Rodríguez',
    packageId: 'PKG-001',
    claimType: 'Package Damage',
    description: 'Paquete recibido con daños visibles en la esquina. Contenido: laptop Dell XPS 13',
    reportedAmount: 1200,
    estimatedAmount: 1200,
    status: 'Under Review',
    priority: 'High',
    reportedAt: '2024-01-20T10:30:00Z',
    assignedTo: 'Juan Pérez',
    assignedAt: '2024-01-20T11:00:00Z',
    timeline: [
      {
        id: '1',
        timestamp: '2024-01-20T10:30:00Z',
        eventType: 'Claim Filed',
        description: 'Reclamo presentado por daños en paquete',
        performedBy: 'María González'
      },
      {
        id: '2',
        timestamp: '2024-01-20T11:00:00Z',
        eventType: 'Assigned',
        description: 'Reclamo asignado a Juan Pérez',
        performedBy: 'Sistema'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Reporte de Daños',
        type: 'Damage Report',
        url: '/claims/damage-report-001.pdf',
        uploadedAt: '2024-01-20T10:35:00Z',
        uploadedBy: 'María González',
        size: 102400
      }
    ],
    photos: [
      {
        id: '1',
        url: '/claims/photos/damage-001-1.jpg',
        description: 'Daño en esquina del paquete',
        uploadedAt: '2024-01-20T10:35:00Z',
        uploadedBy: 'María González',
        damageType: 'Physical Damage',
        location: 'Esquina superior derecha'
      },
      {
        id: '2',
        url: '/claims/photos/damage-001-2.jpg',
        description: 'Laptop con pantalla rota',
        uploadedAt: '2024-01-20T10:36:00Z',
        uploadedBy: 'María González',
        damageType: 'Physical Damage',
        location: 'Pantalla'
      }
    ],
    notes: [
      {
        id: '1',
        content: 'Cliente reporta que el paquete llegó con daños visibles. Se requiere evaluación técnica.',
        author: 'Juan Pérez',
        timestamp: '2024-01-20T11:15:00Z',
        isInternal: true
      }
    ],
    fraudScore: 15,
    riskLevel: 'Low'
  },
  {
    id: '2',
    claimNumber: 'CLM-2024-002',
    policyId: '2',
    customerId: '2',
    customerName: 'Carlos Rivera Santos',
    claimType: 'Package Loss',
    description: 'Paquete no entregado después de 5 días. Contenido: iPhone 15 Pro Max',
    reportedAmount: 1200,
    estimatedAmount: 1200,
    status: 'Investigation',
    priority: 'Urgent',
    reportedAt: '2024-01-25T14:20:00Z',
    assignedTo: 'Ana López',
    assignedAt: '2024-01-25T14:30:00Z',
    timeline: [
      {
        id: '3',
        timestamp: '2024-01-25T14:20:00Z',
        eventType: 'Claim Filed',
        description: 'Reclamo presentado por pérdida de paquete',
        performedBy: 'Carlos Rivera'
      },
      {
        id: '4',
        timestamp: '2024-01-25T14:30:00Z',
        eventType: 'Assigned',
        description: 'Reclamo asignado a Ana López',
        performedBy: 'Sistema'
      },
      {
        id: '5',
        timestamp: '2024-01-25T15:00:00Z',
        eventType: 'Investigation Started',
        description: 'Iniciada investigación de pérdida',
        performedBy: 'Ana López'
      }
    ],
    documents: [
      {
        id: '2',
        name: 'Comprobante de Compra',
        type: 'Receipt',
        url: '/claims/receipt-002.pdf',
        uploadedAt: '2024-01-25T14:25:00Z',
        uploadedBy: 'Carlos Rivera',
        size: 51200
      }
    ],
    photos: [],
    notes: [
      {
        id: '2',
        content: 'Cliente proporcionó comprobante de compra. Se requiere verificación con transportista.',
        author: 'Ana López',
        timestamp: '2024-01-25T15:30:00Z',
        isInternal: true
      }
    ],
    fraudScore: 25,
    riskLevel: 'Medium'
  },
  {
    id: '3',
    claimNumber: 'CLM-2024-003',
    policyId: '3',
    customerId: '3',
    customerName: 'Ana Lucia Vega Morales',
    claimType: 'Theft',
    description: 'Paquete robado durante el transporte. Contenido: Joyas de oro',
    reportedAmount: 2500,
    estimatedAmount: 2500,
    approvedAmount: 2500,
    status: 'Settled',
    priority: 'Critical',
    reportedAt: '2024-02-05T09:15:00Z',
    assignedTo: 'Miguel Torres',
    assignedAt: '2024-02-05T09:20:00Z',
    resolvedAt: '2024-02-10T16:00:00Z',
    timeline: [
      {
        id: '6',
        timestamp: '2024-02-05T09:15:00Z',
        eventType: 'Claim Filed',
        description: 'Reclamo presentado por robo',
        performedBy: 'Ana Lucia Vega'
      },
      {
        id: '7',
        timestamp: '2024-02-05T09:20:00Z',
        eventType: 'Assigned',
        description: 'Reclamo asignado a Miguel Torres',
        performedBy: 'Sistema'
      },
      {
        id: '8',
        timestamp: '2024-02-05T10:00:00Z',
        eventType: 'Investigation Started',
        description: 'Iniciada investigación de robo',
        performedBy: 'Miguel Torres'
      },
      {
        id: '9',
        timestamp: '2024-02-08T14:00:00Z',
        eventType: 'Investigation Complete',
        description: 'Investigación completada - robo confirmado',
        performedBy: 'Miguel Torres'
      },
      {
        id: '10',
        timestamp: '2024-02-10T10:00:00Z',
        eventType: 'Approved',
        description: 'Reclamo aprobado por $2,500',
        performedBy: 'Miguel Torres'
      },
      {
        id: '11',
        timestamp: '2024-02-10T16:00:00Z',
        eventType: 'Payment Processed',
        description: 'Pago procesado y enviado al cliente',
        performedBy: 'Sistema'
      }
    ],
    documents: [
      {
        id: '3',
        name: 'Reporte de Policía',
        type: 'Police Report',
        url: '/claims/police-report-003.pdf',
        uploadedAt: '2024-02-05T09:30:00Z',
        uploadedBy: 'Ana Lucia Vega',
        size: 204800
      },
      {
        id: '4',
        name: 'Certificado de Joyas',
        type: 'Other',
        url: '/claims/jewelry-cert-003.pdf',
        uploadedAt: '2024-02-05T09:35:00Z',
        uploadedBy: 'Ana Lucia Vega',
        size: 153600
      }
    ],
    photos: [
      {
        id: '3',
        url: '/claims/photos/theft-003-1.jpg',
        description: 'Evidencia de robo en vehículo',
        uploadedAt: '2024-02-05T09:40:00Z',
        uploadedBy: 'Ana Lucia Vega',
        damageType: 'Theft',
        location: 'Vehículo de transporte'
      }
    ],
    notes: [
      {
        id: '3',
        content: 'Reporte de policía confirmado. Joyas certificadas. Reclamo aprobado.',
        author: 'Miguel Torres',
        timestamp: '2024-02-10T10:30:00Z',
        isInternal: true
      }
    ],
    fraudScore: 5,
    riskLevel: 'Low'
  }
];

// Mock Risk Assessments
export const mockRiskAssessments: RiskAssessment[] = [
  {
    id: '1',
    customerId: '1',
    score: 25,
    factors: [
      {
        factor: 'Historial de Reclamos',
        weight: 0.4,
        score: 20,
        description: 'Sin reclamos previos'
      },
      {
        factor: 'Tipo de Paquetes',
        weight: 0.3,
        score: 30,
        description: 'Paquetes de valor medio'
      },
      {
        factor: 'Ubicación',
        weight: 0.2,
        score: 25,
        description: 'Zona de bajo riesgo'
      },
      {
        factor: 'Frecuencia de Envíos',
        weight: 0.1,
        score: 20,
        description: 'Envíos ocasionales'
      }
    ],
    recommendations: [
      'Mantener cobertura estándar',
      'Considerar seguro premium para electrónicos',
      'Documentar valor de paquetes'
    ],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    customerId: '2',
    score: 45,
    factors: [
      {
        factor: 'Historial de Reclamos',
        weight: 0.4,
        score: 50,
        description: '1 reclamo en los últimos 6 meses'
      },
      {
        factor: 'Tipo de Paquetes',
        weight: 0.3,
        score: 40,
        description: 'Paquetes de alto valor'
      },
      {
        factor: 'Ubicación',
        weight: 0.2,
        score: 45,
        description: 'Zona de riesgo medio'
      },
      {
        factor: 'Frecuencia de Envíos',
        weight: 0.1,
        score: 50,
        description: 'Envíos frecuentes'
      }
    ],
    recommendations: [
      'Mantener cobertura premium',
      'Implementar medidas de seguridad adicionales',
      'Revisar rutas de entrega'
    ],
    lastUpdated: '2024-01-20'
  }
];

// Mock Fraud Alerts
export const mockFraudAlerts: FraudAlert[] = [
  {
    id: '1',
    claimId: '2',
    alertType: 'Multiple Claims',
    severity: 'Medium',
    description: 'Cliente ha presentado 3 reclamos en los últimos 6 meses',
    detectedAt: '2024-01-25T15:00:00Z',
    evidence: [
      'Reclamo CLM-2023-045 presentado el 2023-08-15',
      'Reclamo CLM-2023-089 presentado el 2023-11-20',
      'Reclamo CLM-2024-002 presentado el 2024-01-25'
    ]
  },
  {
    id: '2',
    claimId: '1',
    alertType: 'Suspicious Pattern',
    severity: 'Low',
    description: 'Patrón de reclamos similar a otros casos',
    detectedAt: '2024-01-20T12:00:00Z',
    resolvedAt: '2024-01-21T10:00:00Z',
    resolvedBy: 'Juan Pérez',
    evidence: [
      'Daños reportados similares a otros 5 casos',
      'Mismo tipo de producto afectado'
    ]
  }
];

// Insurance Statistics
export const insuranceStats: InsuranceStats = {
  totalPolicies: 156,
  activePolicies: 142,
  totalClaims: 23,
  openClaims: 8,
  totalPremium: 5240,
  totalPayouts: 18500,
  averageClaimAmount: 804,
  claimsByStatus: {
    'Reported': 2,
    'Under Review': 3,
    'Investigation': 2,
    'Documentation Required': 1,
    'Approved': 0,
    'Denied': 0,
    'Settled': 12,
    'Closed': 3
  },
  claimsByType: {
    'Package Damage': 12,
    'Package Loss': 5,
    'Package Delay': 2,
    'Theft': 3,
    'Natural Disaster': 0,
    'Handling Error': 1,
    'Other': 0
  },
  monthlyTrends: [
    {
      month: '2024-01',
      policies: 45,
      claims: 8,
      premium: 1575,
      payouts: 6400
    },
    {
      month: '2024-02',
      policies: 52,
      claims: 6,
      premium: 1820,
      payouts: 4800
    },
    {
      month: '2024-03',
      policies: 59,
      claims: 9,
      premium: 2065,
      payouts: 7300
    }
  ]
};

// Utility functions
export const getPolicyById = (id: string): InsurancePolicy | undefined => {
  return mockPolicies.find(policy => policy.id === id);
};

export const getClaimsByPolicyId = (policyId: string): InsuranceClaim[] => {
  return mockClaims.filter(claim => claim.policyId === policyId);
};

export const getClaimsByCustomerId = (customerId: string): InsuranceClaim[] => {
  return mockClaims.filter(claim => claim.customerId === customerId);
};

export const getRiskAssessmentByCustomerId = (customerId: string): RiskAssessment | undefined => {
  return mockRiskAssessments.find(assessment => assessment.customerId === customerId);
};

export const getFraudAlertsByClaimId = (claimId: string): FraudAlert[] => {
  return mockFraudAlerts.filter(alert => alert.claimId === claimId);
}; 