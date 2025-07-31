import { useState, useEffect } from 'react';

interface PnLData {
  revenue: number;
  expenses: number;
  gross_profit: number;
  net_profit: number;
  profit_margin: number;
  monthly_trends: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  expense_breakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

interface BenchmarkComparison {
  metric: string;
  your_value: number;
  network_average: number;
  top_performer: number;
  your_rank: number;
  total_locations: number;
  improvement_potential: number;
}

interface BestPractice {
  id: string;
  title: string;
  category: 'operations' | 'marketing' | 'customer_service' | 'financial' | 'compliance';
  description: string;
  author: string;
  location: string;
  implementation_difficulty: 'easy' | 'medium' | 'hard';
  impact_score: number;
  implementation_time: string;
  resources_needed: string[];
  created_at: string;
  likes: number;
  downloads: number;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'operational' | 'financial' | 'marketing' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolution?: string;
}

interface TrainingResource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'interactive' | 'webinar';
  category: 'onboarding' | 'operations' | 'compliance' | 'marketing' | 'technology';
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completion_rate: number;
  rating: number;
  url: string;
  thumbnail?: string;
  required: boolean;
  last_updated: string;
}

// Mock P&L data
const mockPnLData: PnLData = {
  revenue: 1250000,
  expenses: 875000,
  gross_profit: 375000,
  net_profit: 287500,
  profit_margin: 23,
  monthly_trends: [
    { month: 'Enero', revenue: 95000, expenses: 72000, profit: 23000 },
    { month: 'Febrero', revenue: 102000, expenses: 78000, profit: 24000 },
    { month: 'Marzo', revenue: 108000, expenses: 82000, profit: 26000 },
    { month: 'Abril', revenue: 115000, expenses: 85000, profit: 30000 },
    { month: 'Mayo', revenue: 122000, expenses: 88000, profit: 34000 },
    { month: 'Junio', revenue: 128000, expenses: 92000, profit: 36000 },
    { month: 'Julio', revenue: 135000, expenses: 95000, profit: 40000 },
    { month: 'Agosto', revenue: 142000, expenses: 98000, profit: 44000 },
    { month: 'Septiembre', revenue: 148000, expenses: 102000, profit: 46000 },
    { month: 'Octubre', revenue: 155000, expenses: 105000, profit: 50000 },
    { month: 'Noviembre', revenue: 162000, expenses: 108000, profit: 54000 },
    { month: 'Diciembre', revenue: 168000, expenses: 112000, profit: 56000 }
  ],
  expense_breakdown: [
    { category: 'Personal', amount: 420000, percentage: 48 },
    { category: 'Alquiler', amount: 180000, percentage: 21 },
    { category: 'Equipos', amount: 87500, percentage: 10 },
    { category: 'Marketing', amount: 70000, percentage: 8 },
    { category: 'Servicios', amount: 52500, percentage: 6 },
    { category: 'Seguros', amount: 35000, percentage: 4 },
    { category: 'Otros', amount: 35000, percentage: 3 }
  ]
};

// Mock benchmark comparisons
const mockBenchmarkComparisons: BenchmarkComparison[] = [
  {
    metric: 'performance_score',
    your_value: 95,
    network_average: 87,
    top_performer: 98,
    your_rank: 1,
    total_locations: 8,
    improvement_potential: 3
  },
  {
    metric: 'revenue_growth',
    your_value: 18,
    network_average: 12,
    top_performer: 22,
    your_rank: 2,
    total_locations: 8,
    improvement_potential: 4
  },
  {
    metric: 'customer_satisfaction',
    your_value: 4.8,
    network_average: 4.3,
    top_performer: 4.9,
    your_rank: 1,
    total_locations: 8,
    improvement_potential: 0.1
  },
  {
    metric: 'efficiency_score',
    your_value: 92,
    network_average: 78,
    top_performer: 95,
    your_rank: 2,
    total_locations: 8,
    improvement_potential: 3
  },
  {
    metric: 'compliance_score',
    your_value: 92,
    network_average: 84,
    top_performer: 96,
    your_rank: 3,
    total_locations: 8,
    improvement_potential: 4
  }
];

// Mock best practices
const mockBestPractices: BestPractice[] = [
  {
    id: '1',
    title: 'Optimización de Rutas con IA',
    category: 'operations',
    description: 'Implementación de algoritmos de IA para optimizar rutas de entrega y reducir costos operativos.',
    author: 'María González',
    location: 'PRMCMS San Juan Centro',
    implementation_difficulty: 'medium',
    impact_score: 9,
    implementation_time: '2-3 meses',
    resources_needed: ['Software de IA', 'Capacitación', 'Integración GPS'],
    created_at: '2024-01-15',
    likes: 45,
    downloads: 23
  },
  {
    id: '2',
    title: 'Campaña de Marketing Digital Local',
    category: 'marketing',
    description: 'Estrategia de marketing digital enfocada en la comunidad local con resultados comprobados.',
    author: 'Carlos Rodríguez',
    location: 'PRMCMS Bayamón Express',
    implementation_difficulty: 'easy',
    impact_score: 7,
    implementation_time: '1 mes',
    resources_needed: ['Redes Sociales', 'Contenido Visual', 'Presupuesto Marketing'],
    created_at: '2024-01-10',
    likes: 38,
    downloads: 31
  },
  {
    id: '3',
    title: 'Sistema de Feedback en Tiempo Real',
    category: 'customer_service',
    description: 'Implementación de sistema de feedback instantáneo para mejorar la satisfacción del cliente.',
    author: 'Ana Martínez',
    location: 'PRMCMS Caguas Hub',
    implementation_difficulty: 'easy',
    impact_score: 8,
    implementation_time: '2 semanas',
    resources_needed: ['App Móvil', 'Tablets', 'Capacitación Staff'],
    created_at: '2024-01-08',
    likes: 52,
    downloads: 28
  },
  {
    id: '4',
    title: 'Gestión Financiera Avanzada',
    category: 'financial',
    description: 'Sistema de gestión financiera que mejoró la rentabilidad en un 15% en 6 meses.',
    author: 'Luis Torres',
    location: 'PRMCMS Ponce Sur',
    implementation_difficulty: 'hard',
    impact_score: 9,
    implementation_time: '3-4 meses',
    resources_needed: ['Software Contable', 'Consultor Financiero', 'Capacitación'],
    created_at: '2024-01-05',
    likes: 41,
    downloads: 19
  },
  {
    id: '5',
    title: 'Protocolo de Cumplimiento CMRA',
    category: 'compliance',
    description: 'Protocolo completo para asegurar cumplimiento con regulaciones CMRA y evitar sanciones.',
    author: 'Roberto Sánchez',
    location: 'PRMCMS Arecibo Norte',
    implementation_difficulty: 'medium',
    impact_score: 10,
    implementation_time: '1 mes',
    resources_needed: ['Documentación', 'Capacitación Legal', 'Auditoría'],
    created_at: '2024-01-03',
    likes: 67,
    downloads: 42
  }
];

// Mock support tickets
const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'Problema con Sistema de Facturación',
    description: 'El sistema de facturación no está generando facturas automáticamente para algunos clientes.',
    category: 'technical',
    priority: 'high',
    status: 'in_progress',
    assigned_to: 'Soporte Técnico',
    created_at: '2024-01-20',
    updated_at: '2024-01-21',
    resolution: 'Se identificó un problema en la configuración de reglas de facturación. Solución implementada.'
  },
  {
    id: '2',
    title: 'Consulta sobre Nuevas Tarifas',
    description: 'Necesito aclaración sobre la implementación de las nuevas tarifas de servicios premium.',
    category: 'financial',
    priority: 'medium',
    status: 'resolved',
    assigned_to: 'Departamento Financiero',
    created_at: '2024-01-18',
    updated_at: '2024-01-19',
    resolution: 'Se proporcionó documentación completa sobre las nuevas tarifas y su implementación.'
  },
  {
    id: '3',
    title: 'Solicitud de Materiales de Marketing',
    description: 'Solicito materiales de marketing actualizados con el nuevo logo corporativo.',
    category: 'marketing',
    priority: 'low',
    status: 'open',
    created_at: '2024-01-22',
    updated_at: '2024-01-22'
  }
];

// Mock training resources
const mockTrainingResources: TrainingResource[] = [
  {
    id: '1',
    title: 'Onboarding Completo PRMCMS',
    type: 'interactive',
    category: 'onboarding',
    description: 'Curso completo de onboarding para nuevos franquiciados con todos los procesos esenciales.',
    duration: '8 horas',
    difficulty: 'beginner',
    completion_rate: 95,
    rating: 4.8,
    url: '/training/onboarding',
    required: true,
    last_updated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Gestión de Inventario Avanzada',
    type: 'video',
    category: 'operations',
    description: 'Técnicas avanzadas para la gestión eficiente de inventario y reducción de pérdidas.',
    duration: '2 horas',
    difficulty: 'intermediate',
    completion_rate: 78,
    rating: 4.6,
    url: '/training/inventory',
    required: false,
    last_updated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Cumplimiento Regulatorio CMRA',
    type: 'document',
    category: 'compliance',
    description: 'Guía completa de cumplimiento con regulaciones CMRA y mejores prácticas.',
    duration: '3 horas',
    difficulty: 'intermediate',
    completion_rate: 88,
    rating: 4.9,
    url: '/training/compliance',
    required: true,
    last_updated: '2024-01-12'
  },
  {
    id: '4',
    title: 'Marketing Digital para Franquicias',
    type: 'webinar',
    category: 'marketing',
    description: 'Webinar sobre estrategias de marketing digital específicas para franquicias de servicios postales.',
    duration: '1.5 horas',
    difficulty: 'advanced',
    completion_rate: 65,
    rating: 4.7,
    url: '/training/marketing',
    required: false,
    last_updated: '2024-01-08'
  },
  {
    id: '5',
    title: 'Nuevas Tecnologías en Logística',
    type: 'video',
    category: 'technology',
    description: 'Introducción a las nuevas tecnologías que están transformando la industria logística.',
    duration: '1 hora',
    difficulty: 'beginner',
    completion_rate: 82,
    rating: 4.5,
    url: '/training/technology',
    required: false,
    last_updated: '2024-01-05'
  }
];

export function useFranchisee() {
  const [pnlData, setPnLData] = useState<PnLData | null>(null);
  const [benchmarkComparisons, setBenchmarkComparisons] = useState<BenchmarkComparison[]>([]);
  const [bestPractices, setBestPractices] = useState<BestPractice[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [trainingResources, setTrainingResources] = useState<TrainingResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFranchiseeData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPnLData(mockPnLData);
        setBenchmarkComparisons(mockBenchmarkComparisons);
        setBestPractices(mockBestPractices);
        setSupportTickets(mockSupportTickets);
        setTrainingResources(mockTrainingResources);
      } catch (error) {
        console.error('Error fetching franchisee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchiseeData();
  }, []);

  const createSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const updateSupportTicket = async (id: string, updates: Partial<SupportTicket>) => {
    setSupportTickets(prev => 
      prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updated_at: new Date().toISOString() }
          : ticket
      )
    );
  };

  const getPnLByMonth = (month: string) => {
    return pnlData?.monthly_trends.find(trend => trend.month === month);
  };

  const getTopExpenses = (limit: number = 3) => {
    return pnlData?.expense_breakdown
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit) || [];
  };

  const getBestPracticesByCategory = (category: BestPractice['category']) => {
    return bestPractices.filter(practice => practice.category === category);
  };

  const getTrainingResourcesByCategory = (category: TrainingResource['category']) => {
    return trainingResources.filter(resource => resource.category === category);
  };

  const getRequiredTraining = () => {
    return trainingResources.filter(resource => resource.required);
  };

  const getOpenSupportTickets = () => {
    return supportTickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in_progress');
  };

  return {
    pnlData,
    benchmarkComparisons,
    bestPractices,
    supportTickets,
    trainingResources,
    loading,
    createSupportTicket,
    updateSupportTicket,
    getPnLByMonth,
    getTopExpenses,
    getBestPracticesByCategory,
    getTrainingResourcesByCategory,
    getRequiredTraining,
    getOpenSupportTickets
  };
} 