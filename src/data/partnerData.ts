import {
  Partner,
  Vendor,
  AffiliateProgram,
  IntegrationPartner,
  PartnerContract,
  Commission,
  PartnerAnalytics,
  CollaborationWorkflow,
  PartnerStats,
  PartnerActivity
} from '../types/partners';

// Mock Partner Data
export const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    type: 'business',
    logo: '/logos/techcorp.svg',
    website: 'https://techcorp.com',
    email: 'partnerships@techcorp.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    contactPerson: {
      name: 'Sarah Johnson',
      title: 'Partnership Director',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1-555-0124'
    },
    status: 'active',
    rating: 4.8,
    joinDate: '2023-01-15',
    lastActivity: '2024-01-15',
    revenue: 125000,
    commission: 18750,
    performanceScore: 92,
    tags: ['technology', 'enterprise', 'premium'],
    notes: 'Strategic technology partner with excellent performance'
  },
  {
    id: '2',
    name: 'Global Logistics Inc',
    type: 'vendor',
    logo: '/logos/global-logistics.svg',
    website: 'https://globallogistics.com',
    email: 'partners@globallogistics.com',
    phone: '+1-555-0125',
    address: {
      street: '456 Shipping Lane',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    contactPerson: {
      name: 'Carlos Rodriguez',
      title: 'VP of Partnerships',
      email: 'carlos.rodriguez@globallogistics.com',
      phone: '+1-555-0126'
    },
    status: 'active',
    rating: 4.5,
    joinDate: '2023-03-20',
    lastActivity: '2024-01-14',
    revenue: 89000,
    commission: 13350,
    performanceScore: 87,
    tags: ['logistics', 'shipping', 'international'],
    notes: 'Reliable logistics partner for international shipments'
  },
  {
    id: '3',
    name: 'Digital Marketing Pro',
    type: 'affiliate',
    logo: '/logos/digital-marketing-pro.svg',
    website: 'https://digitalmarketingpro.com',
    email: 'affiliate@digitalmarketingpro.com',
    phone: '+1-555-0127',
    address: {
      street: '789 Marketing Ave',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA'
    },
    contactPerson: {
      name: 'Emily Chen',
      title: 'Affiliate Manager',
      email: 'emily.chen@digitalmarketingpro.com',
      phone: '+1-555-0128'
    },
    status: 'active',
    rating: 4.7,
    joinDate: '2023-06-10',
    lastActivity: '2024-01-13',
    revenue: 67000,
    commission: 10050,
    performanceScore: 89,
    tags: ['marketing', 'digital', 'affiliate'],
    notes: 'High-performing affiliate with strong conversion rates'
  },
  {
    id: '4',
    name: 'CloudConnect API',
    type: 'integration',
    logo: '/logos/cloudconnect.svg',
    website: 'https://cloudconnectapi.com',
    email: 'dev@cloudconnectapi.com',
    phone: '+1-555-0129',
    address: {
      street: '321 Cloud Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    contactPerson: {
      name: 'Michael Thompson',
      title: 'Technical Lead',
      email: 'michael.thompson@cloudconnectapi.com',
      phone: '+1-555-0130'
    },
    status: 'active',
    rating: 4.9,
    joinDate: '2023-08-05',
    lastActivity: '2024-01-15',
    revenue: 156000,
    commission: 23400,
    performanceScore: 95,
    tags: ['api', 'cloud', 'integration'],
    notes: 'Premium API integration partner with excellent uptime'
  }
];

// Mock Vendor Data
export const mockVendors: Vendor[] = [
  {
    ...mockPartners[1],
    vendorType: 'service-provider',
    categories: ['logistics', 'shipping', 'warehousing'],
    certifications: [
      {
        name: 'ISO 9001:2015',
        issuer: 'International Organization for Standardization',
        issueDate: '2022-01-15',
        expiryDate: '2025-01-15',
        status: 'active'
      },
      {
        name: 'C-TPAT',
        issuer: 'U.S. Customs and Border Protection',
        issueDate: '2021-06-20',
        expiryDate: '2024-06-20',
        status: 'active'
      }
    ],
    insurance: {
      type: 'General Liability',
      provider: 'Global Insurance Co',
      policyNumber: 'GL-2024-001',
      coverage: 5000000,
      expiryDate: '2024-12-31'
    },
    qualityRating: 4.5,
    complianceScore: 92,
    procurementHistory: [
      {
        id: 'proc-1',
        date: '2024-01-10',
        description: 'International shipping services',
        amount: 15000,
        status: 'completed',
        invoiceId: 'INV-2024-001'
      },
      {
        id: 'proc-2',
        date: '2024-01-05',
        description: 'Warehouse management system',
        amount: 25000,
        status: 'approved',
        invoiceId: 'INV-2024-002'
      }
    ]
  }
];

// Mock Affiliate Program Data
export const mockAffiliatePrograms: AffiliateProgram[] = [
  {
    id: 'aff-1',
    partnerId: '3',
    referralCode: 'DIGITALPRO2024',
    commissionStructure: {
      baseRate: 0.15,
      tiers: [
        {
          level: 1,
          minSales: 0,
          rate: 0.15,
          description: 'Standard rate'
        },
        {
          level: 2,
          minSales: 50000,
          rate: 0.18,
          description: 'Silver tier'
        },
        {
          level: 3,
          minSales: 100000,
          rate: 0.20,
          description: 'Gold tier'
        }
      ],
      bonuses: [
        {
          type: 'seasonal',
          description: 'Q4 Holiday Bonus',
          rate: 0.05,
          conditions: 'Valid for Q4 2024',
          validFrom: '2024-10-01',
          validTo: '2024-12-31'
        }
      ],
      restrictions: ['No self-referrals', 'Valid for new customers only']
    },
    marketingMaterials: [
      {
        id: 'mat-1',
        name: 'Banner Ad - 728x90',
        type: 'banner',
        url: '/materials/banner-728x90.png',
        description: 'Standard banner for website placement',
        tags: ['banner', 'website'],
        usageCount: 45,
        conversionRate: 0.025
      },
      {
        id: 'mat-2',
        name: 'Email Template - Welcome',
        type: 'email',
        url: '/materials/email-welcome.html',
        description: 'Welcome email template for new subscribers',
        tags: ['email', 'welcome'],
        usageCount: 23,
        conversionRate: 0.045
      }
    ],
    performance: {
      totalReferrals: 156,
      successfulReferrals: 89,
      conversionRate: 0.57,
      totalRevenue: 67000,
      totalCommission: 10050,
      monthlyStats: [
        {
          month: '2024-01',
          referrals: 23,
          conversions: 14,
          revenue: 8900,
          commission: 1335
        },
        {
          month: '2023-12',
          referrals: 31,
          conversions: 18,
          revenue: 12400,
          commission: 1860
        }
      ]
    },
    paymentHistory: [
      {
        id: 'pay-1',
        date: '2024-01-15',
        amount: 1335,
        method: 'bank-transfer',
        status: 'completed',
        reference: 'PAY-2024-001'
      },
      {
        id: 'pay-2',
        date: '2023-12-15',
        amount: 1860,
        method: 'bank-transfer',
        status: 'completed',
        reference: 'PAY-2023-012'
      }
    ]
  }
];

// Mock Integration Partner Data
export const mockIntegrationPartners: IntegrationPartner[] = [
  {
    ...mockPartners[3],
    apiAccess: {
      apiKey: 'cc_api_sk_live_1234567890abcdef',
      permissions: ['read:data', 'write:data', 'webhooks'],
      rateLimit: 1000,
      lastUsed: '2024-01-15T10:30:00Z',
      usageCount: 45678,
      status: 'active'
    },
    technicalDocs: [
      {
        id: 'doc-1',
        title: 'API Reference v2.1',
        type: 'api-docs',
        url: '/docs/api-reference-v2.1',
        version: '2.1.0',
        lastUpdated: '2024-01-10',
        downloads: 1234
      },
      {
        id: 'doc-2',
        title: 'SDK for Node.js',
        type: 'sdk',
        url: '/docs/sdk-nodejs',
        version: '1.5.2',
        lastUpdated: '2024-01-08',
        downloads: 567
      }
    ],
    supportTickets: [
      {
        id: 'ticket-1',
        title: 'API Rate Limiting Issue',
        description: 'Experiencing unexpected rate limiting at 500 requests/hour',
        priority: 'medium',
        status: 'resolved',
        createdAt: '2024-01-12T14:30:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
        assignedTo: 'support-team',
        resolution: 'Rate limit increased to 1000 requests/hour'
      }
    ],
    usageMetrics: {
      totalRequests: 45678,
      successfulRequests: 45123,
      failedRequests: 555,
      averageResponseTime: 245,
      peakUsage: 150,
      monthlyUsage: [
        {
          month: '2024-01',
          requests: 12345,
          errors: 123,
          responseTime: 245
        },
        {
          month: '2023-12',
          requests: 11890,
          errors: 98,
          responseTime: 238
        }
      ]
    },
    slaAgreement: {
      uptime: 99.9,
      responseTime: 200,
      supportResponseTime: 4,
      penalties: [
        {
          type: 'uptime',
          threshold: 99.5,
          penalty: 0.1,
          description: '10% credit for uptime below 99.5%'
        }
      ],
      lastReview: '2024-01-01',
      nextReview: '2024-04-01'
    }
  }
];

// Mock Contract Data
export const mockContracts: PartnerContract[] = [
  {
    id: 'contract-1',
    partnerId: '1',
    contractNumber: 'CTR-2024-001',
    type: 'service',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    renewalDate: '2024-11-01',
    terms: 'Annual service agreement with quarterly reviews',
    commissionRate: 0.15,
    paymentTerms: 'Net 30',
    documents: [
      {
        id: 'doc-1',
        name: 'Service Agreement 2024',
        type: 'contract',
        url: '/contracts/service-agreement-2024.pdf',
        uploadDate: '2024-01-01'
      }
    ],
    milestones: [
      {
        id: 'milestone-1',
        description: 'Q1 Performance Review',
        dueDate: '2024-03-31',
        status: 'pending',
        value: 25000
      }
    ],
    totalValue: 125000,
    currency: 'USD'
  }
];

// Mock Commission Data
export const mockCommissions: Commission[] = [
  {
    id: 'comm-1',
    partnerId: '1',
    period: '2024-01',
    amount: 18750,
    status: 'pending',
    reference: 'COMM-2024-001',
    breakdown: [
      {
        type: 'service',
        description: 'Technology consulting services',
        amount: 15000,
        quantity: 1,
        rate: 0.15
      },
      {
        type: 'product',
        description: 'Software licensing',
        amount: 3750,
        quantity: 1,
        rate: 0.15
      }
    ]
  }
];

// Mock Analytics Data
export const mockPartnerAnalytics: PartnerAnalytics[] = [
  {
    partnerId: '1',
    period: '2024-01',
    revenue: {
      total: 125000,
      byService: {
        'Technology Consulting': 80000,
        'Software Licensing': 45000
      },
      byMonth: {
        '2024-01': 125000,
        '2023-12': 118000,
        '2023-11': 112000
      }
    },
    performance: {
      score: 92,
      metrics: [
        {
          name: 'Response Time',
          value: 2.5,
          target: 3.0,
          unit: 'hours',
          trend: 'up'
        },
        {
          name: 'Customer Satisfaction',
          value: 4.8,
          target: 4.5,
          unit: 'stars',
          trend: 'stable'
        }
      ],
      trends: [
        {
          metric: 'Revenue',
          values: [
            { date: '2023-11', value: 112000 },
            { date: '2023-12', value: 118000 },
            { date: '2024-01', value: 125000 }
          ],
          forecast: [
            { date: '2024-02', value: 132000 },
            { date: '2024-03', value: 138000 }
          ]
        }
      ]
    },
    growth: {
      opportunities: [
        {
          id: 'opp-1',
          title: 'Expand to European Market',
          description: 'Opportunity to expand services to European clients',
          potentialRevenue: 50000,
          effort: 'medium',
          timeline: '6 months',
          status: 'identified'
        }
      ],
      recommendations: [
        'Increase marketing budget for Q2',
        'Develop new service offerings',
        'Strengthen relationship with key contacts'
      ],
      riskFactors: [
        {
          type: 'operational',
          description: 'Dependency on key personnel',
          severity: 'medium',
          probability: 0.3,
          impact: 0.7,
          mitigation: 'Cross-train team members'
        }
      ]
    },
    relationship: {
      score: 88,
      factors: [
        {
          factor: 'Communication',
          score: 90,
          weight: 0.3,
          description: 'Regular and clear communication'
        },
        {
          factor: 'Performance',
          score: 92,
          weight: 0.4,
          description: 'Consistent high performance'
        },
        {
          factor: 'Innovation',
          score: 85,
          weight: 0.3,
          description: 'Proactive innovation and improvement'
        }
      ],
      history: [
        {
          date: '2024-01-15',
          type: 'milestone',
          description: 'Achieved Q1 revenue target',
          impact: 'positive'
        },
        {
          date: '2024-01-10',
          type: 'meeting',
          description: 'Quarterly business review',
          impact: 'positive'
        }
      ]
    }
  }
];

// Mock Partner Activity
export const mockPartnerActivity: PartnerActivity[] = [
  {
    id: 'activity-1',
    partnerId: '1',
    type: 'contract-signed',
    description: 'New service agreement signed with TechCorp Solutions',
    timestamp: '2024-01-15T10:30:00Z',
    data: { contractValue: 125000, duration: '12 months' }
  },
  {
    id: 'activity-2',
    partnerId: '3',
    type: 'commission-earned',
    description: 'Commission payment processed for Digital Marketing Pro',
    timestamp: '2024-01-15T09:15:00Z',
    data: { amount: 1335, period: '2024-01' }
  },
  {
    id: 'activity-3',
    partnerId: '4',
    type: 'milestone-reached',
    description: 'CloudConnect API achieved 99.9% uptime for Q4 2023',
    timestamp: '2024-01-14T16:45:00Z',
    data: { uptime: 99.9, period: 'Q4 2023' }
  }
];

// Mock Collaboration Workflows
export const mockCollaborationWorkflows: CollaborationWorkflow[] = [
  {
    id: 'workflow-1',
    partnerId: '1',
    type: 'integration',
    title: 'TechCorp API Integration',
    description: 'Integrate TechCorp Solutions API for enhanced data sharing',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    participants: [
      {
        id: 'participant-1',
        name: 'Sarah Johnson',
        role: 'Project Manager',
        email: 'sarah.johnson@techcorp.com',
        status: 'active'
      },
      {
        id: 'participant-2',
        name: 'John Smith',
        role: 'Technical Lead',
        email: 'john.smith@prmcms.com',
        status: 'active'
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'API Documentation Review',
        description: 'Review and approve API documentation',
        assignee: 'John Smith',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-15',
        completedDate: '2024-01-14',
        dependencies: []
      },
      {
        id: 'task-2',
        title: 'Integration Testing',
        description: 'Perform end-to-end integration testing',
        assignee: 'John Smith',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-15',
        dependencies: ['task-1']
      },
      {
        id: 'task-3',
        title: 'User Training',
        description: 'Conduct training sessions for end users',
        assignee: 'Sarah Johnson',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-03-01',
        dependencies: ['task-2']
      }
    ],
    milestones: [
      {
        id: 'milestone-1',
        title: 'API Documentation Complete',
        description: 'API documentation reviewed and approved',
        dueDate: '2024-01-15',
        status: 'completed',
        tasks: ['task-1']
      },
      {
        id: 'milestone-2',
        title: 'Integration Testing Complete',
        description: 'All integration tests passed',
        dueDate: '2024-02-15',
        status: 'pending',
        tasks: ['task-2']
      },
      {
        id: 'milestone-3',
        title: 'Go-Live',
        description: 'Integration goes live in production',
        dueDate: '2024-03-31',
        status: 'pending',
        tasks: ['task-3']
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'API Integration Plan',
        type: 'document',
        url: '/workflows/api-integration-plan.pdf',
        uploadDate: '2024-01-01',
        uploadedBy: 'Sarah Johnson',
        version: '1.0'
      }
    ]
  },
  {
    id: 'workflow-2',
    partnerId: '2',
    type: 'project',
    title: 'Global Logistics Route Optimization',
    description: 'Collaborate on route optimization for international shipments',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    participants: [
      {
        id: 'participant-3',
        name: 'Carlos Rodriguez',
        role: 'Logistics Manager',
        email: 'carlos.rodriguez@globallogistics.com',
        status: 'active'
      },
      {
        id: 'participant-4',
        name: 'Maria Garcia',
        role: 'Operations Director',
        email: 'maria.garcia@prmcms.com',
        status: 'active'
      }
    ],
    tasks: [
      {
        id: 'task-4',
        title: 'Route Analysis',
        description: 'Analyze current routes and identify optimization opportunities',
        assignee: 'Carlos Rodriguez',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-02-01',
        completedDate: '2024-01-28',
        dependencies: []
      },
      {
        id: 'task-5',
        title: 'Software Integration',
        description: 'Integrate route optimization software',
        assignee: 'Maria Garcia',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-04-15',
        dependencies: ['task-4']
      },
      {
        id: 'task-6',
        title: 'Pilot Testing',
        description: 'Conduct pilot testing with select routes',
        assignee: 'Carlos Rodriguez',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-05-15',
        dependencies: ['task-5']
      }
    ],
    milestones: [
      {
        id: 'milestone-4',
        title: 'Analysis Complete',
        description: 'Route analysis completed and recommendations ready',
        dueDate: '2024-02-01',
        status: 'completed',
        tasks: ['task-4']
      },
      {
        id: 'milestone-5',
        title: 'Software Deployed',
        description: 'Route optimization software deployed and tested',
        dueDate: '2024-04-15',
        status: 'pending',
        tasks: ['task-5']
      },
      {
        id: 'milestone-6',
        title: 'Pilot Complete',
        description: 'Pilot testing completed successfully',
        dueDate: '2024-05-15',
        status: 'pending',
        tasks: ['task-6']
      }
    ],
    documents: [
      {
        id: 'doc-2',
        name: 'Route Optimization Proposal',
        type: 'document',
        url: '/workflows/route-optimization-proposal.pdf',
        uploadDate: '2024-01-15',
        uploadedBy: 'Carlos Rodriguez',
        version: '1.0'
      }
    ]
  },
  {
    id: 'workflow-3',
    partnerId: '3',
    type: 'campaign',
    title: 'Digital Marketing Campaign',
    description: 'Joint marketing campaign to promote services',
    status: 'planning',
    startDate: '2024-02-01',
    endDate: '2024-05-31',
    participants: [
      {
        id: 'participant-5',
        name: 'Emily Chen',
        role: 'Marketing Manager',
        email: 'emily.chen@digitalmarketingpro.com',
        status: 'active'
      },
      {
        id: 'participant-6',
        name: 'David Wilson',
        role: 'Marketing Director',
        email: 'david.wilson@prmcms.com',
        status: 'active'
      }
    ],
    tasks: [
      {
        id: 'task-7',
        title: 'Campaign Strategy',
        description: 'Develop comprehensive marketing campaign strategy',
        assignee: 'Emily Chen',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-15',
        dependencies: []
      },
      {
        id: 'task-8',
        title: 'Content Creation',
        description: 'Create marketing materials and content',
        assignee: 'David Wilson',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-03-01',
        dependencies: ['task-7']
      },
      {
        id: 'task-9',
        title: 'Campaign Launch',
        description: 'Launch the marketing campaign across all channels',
        assignee: 'Emily Chen',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-03-15',
        dependencies: ['task-8']
      }
    ],
    milestones: [
      {
        id: 'milestone-7',
        title: 'Strategy Approved',
        description: 'Marketing campaign strategy approved by both parties',
        dueDate: '2024-02-15',
        status: 'pending',
        tasks: ['task-7']
      },
      {
        id: 'milestone-8',
        title: 'Content Ready',
        description: 'All marketing content created and approved',
        dueDate: '2024-03-01',
        status: 'pending',
        tasks: ['task-8']
      },
      {
        id: 'milestone-9',
        title: 'Campaign Live',
        description: 'Marketing campaign launched successfully',
        dueDate: '2024-03-15',
        status: 'pending',
        tasks: ['task-9']
      }
    ],
    documents: [
      {
        id: 'doc-3',
        name: 'Marketing Campaign Brief',
        type: 'document',
        url: '/workflows/marketing-campaign-brief.pdf',
        uploadDate: '2024-02-01',
        uploadedBy: 'Emily Chen',
        version: '1.0'
      }
    ]
  }
];

// Mock Partner Stats
export const mockPartnerStats: PartnerStats = {
  totalPartners: 156,
  activePartners: 142,
  totalRevenue: 2840000,
  averageRating: 4.6,
  topPerformers: mockPartners.slice(0, 3),
  recentActivity: [
    {
      id: 'activity-1',
      partnerId: '1',
      type: 'contract-signed',
      description: 'New service agreement signed with TechCorp Solutions',
      timestamp: '2024-01-15T10:30:00Z',
      data: { contractValue: 125000, duration: '12 months' }
    },
    {
      id: 'activity-2',
      partnerId: '3',
      type: 'commission-earned',
      description: 'Commission payment processed for Digital Marketing Pro',
      timestamp: '2024-01-15T09:15:00Z',
      data: { amount: 1335, period: '2024-01' }
    }
  ]
}; 