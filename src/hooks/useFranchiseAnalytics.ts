import { useState, useEffect } from 'react';

interface NetworkGrowthMetrics {
  total_locations: number;
  new_locations_this_year: number;
  growth_rate: number;
  target_locations: number;
  market_coverage: number;
  expansion_opportunities: {
    region: string;
    potential_locations: number;
    market_size: number;
    competition_level: 'low' | 'medium' | 'high';
  }[];
  monthly_growth: {
    month: string;
    locations: number;
    revenue: number;
    customers: number;
  }[];
}

interface FranchiseeSatisfaction {
  overall_score: number;
  total_surveys: number;
  response_rate: number;
  satisfaction_breakdown: {
    category: string;
    score: number;
    responses: number;
  }[];
  top_concerns: {
    issue: string;
    frequency: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  improvement_areas: {
    area: string;
    current_score: number;
    target_score: number;
    priority: 'low' | 'medium' | 'high';
  }[];
}

interface BrandConsistencyScore {
  overall_score: number;
  total_assessments: number;
  consistency_breakdown: {
    category: string;
    score: number;
    weight: number;
  }[];
  location_scores: {
    location_id: string;
    location_name: string;
    score: number;
    last_assessment: string;
    issues: string[];
  }[];
  improvement_recommendations: {
    category: string;
    recommendation: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
  }[];
}

interface MarketPenetration {
  total_market_size: number;
  current_market_share: number;
  target_market_share: number;
  penetration_by_region: {
    region: string;
    current_share: number;
    target_share: number;
    growth_potential: number;
  }[];
  competitive_analysis: {
    competitor: string;
    market_share: number;
    strength: 'weak' | 'medium' | 'strong';
  }[];
  customer_segments: {
    segment: string;
    penetration_rate: number;
    growth_rate: number;
    potential: number;
  }[];
}

interface ROIAnalysis {
  average_roi: number;
  roi_by_location: {
    location_id: string;
    location_name: string;
    investment: number;
    annual_revenue: number;
    roi: number;
    payback_period: number;
  }[];
  roi_trends: {
    year: string;
    average_roi: number;
    best_performer: number;
    worst_performer: number;
  }[];
  roi_factors: {
    factor: string;
    impact: number;
    correlation: number;
  }[];
}

interface LeaderboardEntry {
  rank: number;
  location_id: string;
  location_name: string;
  owner: string;
  score: number;
  metrics: {
    revenue: number;
    growth_rate: number;
    customer_satisfaction: number;
    efficiency: number;
    compliance: number;
  };
  achievements: string[];
  badges: string[];
  trend: 'up' | 'down' | 'stable';
}

// Mock network growth metrics
const mockNetworkGrowth: NetworkGrowthMetrics = {
  total_locations: 8,
  new_locations_this_year: 2,
  growth_rate: 25,
  target_locations: 15,
  market_coverage: 68,
  expansion_opportunities: [
    {
      region: 'San Juan Metro',
      potential_locations: 3,
      market_size: 2500000,
      competition_level: 'medium'
    },
    {
      region: 'Ponce Sur',
      potential_locations: 2,
      market_size: 1800000,
      competition_level: 'low'
    },
    {
      region: 'Mayagüez Oeste',
      potential_locations: 2,
      market_size: 1200000,
      competition_level: 'low'
    },
    {
      region: 'Fajardo Este',
      potential_locations: 1,
      market_size: 800000,
      competition_level: 'low'
    }
  ],
  monthly_growth: [
    { month: 'Enero', locations: 6, revenue: 580000, customers: 4200 },
    { month: 'Febrero', locations: 6, revenue: 620000, customers: 4400 },
    { month: 'Marzo', locations: 6, revenue: 650000, customers: 4600 },
    { month: 'Abril', locations: 6, revenue: 680000, customers: 4800 },
    { month: 'Mayo', locations: 7, revenue: 720000, customers: 5000 },
    { month: 'Junio', locations: 7, revenue: 750000, customers: 5200 },
    { month: 'Julio', locations: 7, revenue: 780000, customers: 5400 },
    { month: 'Agosto', locations: 7, revenue: 810000, customers: 5600 },
    { month: 'Septiembre', locations: 8, revenue: 850000, customers: 5800 },
    { month: 'Octubre', locations: 8, revenue: 880000, customers: 6000 },
    { month: 'Noviembre', locations: 8, revenue: 920000, customers: 6200 },
    { month: 'Diciembre', locations: 8, revenue: 960000, customers: 6400 }
  ]
};

// Mock franchisee satisfaction
const mockFranchiseeSatisfaction: FranchiseeSatisfaction = {
  overall_score: 87,
  total_surveys: 45,
  response_rate: 92,
  satisfaction_breakdown: [
    { category: 'Soporte Técnico', score: 92, responses: 45 },
    { category: 'Materiales de Marketing', score: 85, responses: 42 },
    { category: 'Capacitación', score: 89, responses: 44 },
    { category: 'Comunicación Corporativa', score: 83, responses: 41 },
    { category: 'Sistemas y Tecnología', score: 88, responses: 43 }
  ],
  top_concerns: [
    { issue: 'Tiempo de respuesta del soporte', frequency: 12, severity: 'medium' },
    { issue: 'Actualización de materiales de marca', frequency: 8, severity: 'low' },
    { issue: 'Integración de sistemas', frequency: 6, severity: 'high' },
    { issue: 'Capacitación en nuevas tecnologías', frequency: 5, severity: 'medium' }
  ],
  improvement_areas: [
    { area: 'Comunicación Proactiva', current_score: 83, target_score: 90, priority: 'high' },
    { area: 'Materiales de Marketing', current_score: 85, target_score: 90, priority: 'medium' },
    { area: 'Soporte 24/7', current_score: 92, target_score: 95, priority: 'low' }
  ]
};

// Mock brand consistency scores
const mockBrandConsistency: BrandConsistencyScore = {
  overall_score: 89,
  total_assessments: 8,
  consistency_breakdown: [
    { category: 'Identidad Visual', score: 92, weight: 30 },
    { category: 'Comunicación', score: 87, weight: 25 },
    { category: 'Servicio al Cliente', score: 91, weight: 25 },
    { category: 'Operaciones', score: 85, weight: 20 }
  ],
  location_scores: [
    {
      location_id: '1',
      location_name: 'PRMCMS San Juan Centro',
      score: 95,
      last_assessment: '2024-01-15',
      issues: []
    },
    {
      location_id: '7',
      location_name: 'PRMCMS Carolina Este',
      score: 93,
      last_assessment: '2024-01-12',
      issues: ['Logo ligeramente desalineado']
    },
    {
      location_id: '3',
      location_name: 'PRMCMS Caguas Hub',
      score: 91,
      last_assessment: '2024-01-10',
      issues: ['Materiales de marketing desactualizados']
    },
    {
      location_id: '6',
      location_name: 'PRMCMS Arecibo Norte',
      score: 88,
      last_assessment: '2024-01-08',
      issues: ['Uniforme no estándar', 'Señalización incompleta']
    },
    {
      location_id: '2',
      location_name: 'PRMCMS Bayamón Express',
      score: 87,
      last_assessment: '2024-01-05',
      issues: ['Colores de marca incorrectos', 'Falta capacitación en servicio']
    },
    {
      location_id: '4',
      location_name: 'PRMCMS Ponce Sur',
      score: 85,
      last_assessment: '2024-01-03',
      issues: ['Logo desactualizado', 'Procedimientos no estándar']
    },
    {
      location_id: '8',
      location_name: 'PRMCMS Aguadilla Costa',
      score: 72,
      last_assessment: '2024-01-01',
      issues: ['Múltiples incumplimientos de marca', 'Necesita renovación completa']
    },
    {
      location_id: '5',
      location_name: 'PRMCMS Mayagüez Oeste',
      score: 0,
      last_assessment: '2024-01-15',
      issues: ['Locación en construcción']
    }
  ],
  improvement_recommendations: [
    {
      category: 'Identidad Visual',
      recommendation: 'Implementar auditoría visual mensual en todas las locaciones',
      impact: 'high',
      effort: 'medium'
    },
    {
      category: 'Comunicación',
      recommendation: 'Crear sistema de comunicación centralizado con plantillas aprobadas',
      impact: 'high',
      effort: 'high'
    },
    {
      category: 'Servicio al Cliente',
      recommendation: 'Establecer programa de capacitación continua en servicio',
      impact: 'medium',
      effort: 'medium'
    }
  ]
};

// Mock market penetration
const mockMarketPenetration: MarketPenetration = {
  total_market_size: 15000000,
  current_market_share: 4.3,
  target_market_share: 8.0,
  penetration_by_region: [
    { region: 'San Juan', current_share: 6.2, target_share: 10.0, growth_potential: 3.8 },
    { region: 'Bayamón', current_share: 4.8, target_share: 8.0, growth_potential: 3.2 },
    { region: 'Caguas', current_share: 5.1, target_share: 7.5, growth_potential: 2.4 },
    { region: 'Ponce', current_share: 3.2, target_share: 6.0, growth_potential: 2.8 },
    { region: 'Arecibo', current_share: 2.8, target_share: 5.5, growth_potential: 2.7 },
    { region: 'Mayagüez', current_share: 1.5, target_share: 4.0, growth_potential: 2.5 }
  ],
  competitive_analysis: [
    { competitor: 'USPS', market_share: 65.0, strength: 'strong' },
    { competitor: 'FedEx', market_share: 12.0, strength: 'strong' },
    { competitor: 'UPS', market_share: 8.5, strength: 'medium' },
    { competitor: 'DHL', market_share: 3.2, strength: 'medium' },
    { competitor: 'Otros', market_share: 7.0, strength: 'weak' }
  ],
  customer_segments: [
    { segment: 'Act 60 Decree Holders', penetration_rate: 15.0, growth_rate: 25, potential: 85 },
    { segment: 'Pequeñas Empresas', penetration_rate: 8.5, growth_rate: 18, potential: 91.5 },
    { segment: 'Individuos', penetration_rate: 3.2, growth_rate: 12, potential: 96.8 },
    { segment: 'Corporaciones', penetration_rate: 2.1, growth_rate: 8, potential: 97.9 }
  ]
};

// Mock ROI analysis
const mockROIAnalysis: ROIAnalysis = {
  average_roi: 28.5,
  roi_by_location: [
    {
      location_id: '1',
      location_name: 'PRMCMS San Juan Centro',
      investment: 150000,
      annual_revenue: 1500000,
      roi: 35.2,
      payback_period: 18
    },
    {
      location_id: '7',
      location_name: 'PRMCMS Carolina Este',
      investment: 140000,
      annual_revenue: 1416000,
      roi: 33.8,
      payback_period: 19
    },
    {
      location_id: '3',
      location_name: 'PRMCMS Caguas Hub',
      investment: 135000,
      annual_revenue: 1320000,
      roi: 32.1,
      payback_period: 20
    },
    {
      location_id: '6',
      location_name: 'PRMCMS Arecibo Norte',
      investment: 130000,
      annual_revenue: 1260000,
      roi: 30.5,
      payback_period: 21
    },
    {
      location_id: '2',
      location_name: 'PRMCMS Bayamón Express',
      investment: 125000,
      annual_revenue: 1176000,
      roi: 28.8,
      payback_period: 22
    },
    {
      location_id: '4',
      location_name: 'PRMCMS Ponce Sur',
      investment: 120000,
      annual_revenue: 1104000,
      roi: 27.2,
      payback_period: 23
    },
    {
      location_id: '8',
      location_name: 'PRMCMS Aguadilla Costa',
      investment: 100000,
      annual_revenue: 384000,
      roi: 12.8,
      payback_period: 42
    },
    {
      location_id: '5',
      location_name: 'PRMCMS Mayagüez Oeste',
      investment: 0,
      annual_revenue: 0,
      roi: 0,
      payback_period: 0
    }
  ],
  roi_trends: [
    { year: '2021', average_roi: 22.5, best_performer: 28.0, worst_performer: 15.0 },
    { year: '2022', average_roi: 25.8, best_performer: 32.0, worst_performer: 18.0 },
    { year: '2023', average_roi: 27.2, best_performer: 34.0, worst_performer: 20.0 },
    { year: '2024', average_roi: 28.5, best_performer: 35.2, worst_performer: 12.8 }
  ],
  roi_factors: [
    { factor: 'Ubicación', impact: 35, correlation: 0.85 },
    { factor: 'Gestión Operacional', impact: 25, correlation: 0.78 },
    { factor: 'Marketing Local', impact: 20, correlation: 0.72 },
    { factor: 'Eficiencia de Costos', impact: 15, correlation: 0.68 },
    { factor: 'Satisfacción del Cliente', impact: 5, correlation: 0.65 }
  ]
};

// Mock leaderboard with gamification
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    location_id: '1',
    location_name: 'PRMCMS San Juan Centro',
    owner: 'María González',
    score: 98,
    metrics: {
      revenue: 1500000,
      growth_rate: 18,
      customer_satisfaction: 4.8,
      efficiency: 92,
      compliance: 95
    },
    achievements: ['top_performer', 'growth_champion', 'customer_excellence'],
    badges: ['first_month', 'revenue_milestone', 'perfect_score'],
    trend: 'up'
  },
  {
    rank: 2,
    location_id: '7',
    location_name: 'PRMCMS Carolina Este',
    owner: 'Isabel Morales',
    score: 96,
    metrics: {
      revenue: 1416000,
      growth_rate: 15,
      customer_satisfaction: 4.7,
      efficiency: 90,
      compliance: 93
    },
    achievements: ['top_performer', 'efficiency_master'],
    badges: ['first_month', 'revenue_milestone'],
    trend: 'up'
  },
  {
    rank: 3,
    location_id: '3',
    location_name: 'PRMCMS Caguas Hub',
    owner: 'Ana Martínez',
    score: 94,
    metrics: {
      revenue: 1320000,
      growth_rate: 12,
      customer_satisfaction: 4.6,
      efficiency: 88,
      compliance: 91
    },
    achievements: ['customer_excellence'],
    badges: ['first_month', 'innovation'],
    trend: 'stable'
  },
  {
    rank: 4,
    location_id: '6',
    location_name: 'PRMCMS Arecibo Norte',
    owner: 'Roberto Sánchez',
    score: 91,
    metrics: {
      revenue: 1260000,
      growth_rate: 10,
      customer_satisfaction: 4.5,
      efficiency: 85,
      compliance: 88
    },
    achievements: ['compliance_leader'],
    badges: ['first_month'],
    trend: 'up'
  },
  {
    rank: 5,
    location_id: '2',
    location_name: 'PRMCMS Bayamón Express',
    owner: 'Carlos Rodríguez',
    score: 89,
    metrics: {
      revenue: 1176000,
      growth_rate: 8,
      customer_satisfaction: 4.4,
      efficiency: 83,
      compliance: 85
    },
    achievements: [],
    badges: ['first_month'],
    trend: 'stable'
  },
  {
    rank: 6,
    location_id: '4',
    location_name: 'PRMCMS Ponce Sur',
    owner: 'Luis Torres',
    score: 87,
    metrics: {
      revenue: 1104000,
      growth_rate: 6,
      customer_satisfaction: 4.3,
      efficiency: 80,
      compliance: 83
    },
    achievements: [],
    badges: [],
    trend: 'down'
  },
  {
    rank: 7,
    location_id: '8',
    location_name: 'PRMCMS Aguadilla Costa',
    owner: 'Fernando López',
    score: 45,
    metrics: {
      revenue: 384000,
      growth_rate: -15,
      customer_satisfaction: 3.2,
      efficiency: 45,
      compliance: 38
    },
    achievements: [],
    badges: [],
    trend: 'down'
  },
  {
    rank: 8,
    location_id: '5',
    location_name: 'PRMCMS Mayagüez Oeste',
    owner: 'Carmen Vega',
    score: 0,
    metrics: {
      revenue: 0,
      growth_rate: 0,
      customer_satisfaction: 0,
      efficiency: 0,
      compliance: 0
    },
    achievements: [],
    badges: [],
    trend: 'stable'
  }
];

export function useFranchiseAnalytics() {
  const [networkGrowth, setNetworkGrowth] = useState<NetworkGrowthMetrics | null>(null);
  const [franchiseeSatisfaction, setFranchiseeSatisfaction] = useState<FranchiseeSatisfaction | null>(null);
  const [brandConsistency, setBrandConsistency] = useState<BrandConsistencyScore | null>(null);
  const [marketPenetration, setMarketPenetration] = useState<MarketPenetration | null>(null);
  const [roiAnalysis, setRoiAnalysis] = useState<ROIAnalysis | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setNetworkGrowth(mockNetworkGrowth);
        setFranchiseeSatisfaction(mockFranchiseeSatisfaction);
        setBrandConsistency(mockBrandConsistency);
        setMarketPenetration(mockMarketPenetration);
        setRoiAnalysis(mockROIAnalysis);
        setLeaderboard(mockLeaderboard);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const getTopPerformers = (limit: number = 5) => {
    return leaderboard.slice(0, limit);
  };

  const getLocationsNeedingImprovement = () => {
    return leaderboard.filter(entry => entry.score < 80);
  };

  const getTrendingLocations = () => {
    return leaderboard.filter(entry => entry.trend === 'up');
  };

  const getLocationsByRegion = (region: string) => {
    return marketPenetration?.penetration_by_region.find(r => r.region === region);
  };

  const getROIByLocation = (locationId: string) => {
    return roiAnalysis?.roi_by_location.find(location => location.location_id === locationId);
  };

  const getConsistencyByLocation = (locationId: string) => {
    return brandConsistency?.location_scores.find(location => location.location_id === locationId);
  };

  const getAchievementStats = () => {
    const achievementCounts: { [key: string]: number } = {};
    leaderboard.forEach(entry => {
      entry.achievements.forEach(achievement => {
        achievementCounts[achievement] = (achievementCounts[achievement] || 0) + 1;
      });
    });
    return achievementCounts;
  };

  const getBadgeStats = () => {
    const badgeCounts: { [key: string]: number } = {};
    leaderboard.forEach(entry => {
      entry.badges.forEach(badge => {
        badgeCounts[badge] = (badgeCounts[badge] || 0) + 1;
      });
    });
    return badgeCounts;
  };

  const calculateNetworkHealth = () => {
    if (!networkGrowth || !franchiseeSatisfaction || !brandConsistency) return 0;
    
    const growthScore = (networkGrowth.growth_rate / 30) * 100; // Normalize to 100
    const satisfactionScore = franchiseeSatisfaction.overall_score;
    const consistencyScore = brandConsistency.overall_score;
    
    return Math.round((growthScore + satisfactionScore + consistencyScore) / 3);
  };

  const getGrowthProjection = (months: number = 12) => {
    if (!networkGrowth) return null;
    
    const currentGrowthRate = networkGrowth.growth_rate;
    const projectedLocations = networkGrowth.total_locations * Math.pow(1 + currentGrowthRate / 100, months / 12);
    
    return {
      projected_locations: Math.round(projectedLocations),
      growth_needed: Math.max(0, networkGrowth.target_locations - projectedLocations),
      months_to_target: networkGrowth.target_locations > projectedLocations 
        ? Math.ceil(Math.log(networkGrowth.target_locations / networkGrowth.total_locations) / Math.log(1 + currentGrowthRate / 100) * 12)
        : 0
    };
  };

  return {
    networkGrowth,
    franchiseeSatisfaction,
    brandConsistency,
    marketPenetration,
    roiAnalysis,
    leaderboard,
    loading,
    getTopPerformers,
    getLocationsNeedingImprovement,
    getTrendingLocations,
    getLocationsByRegion,
    getROIByLocation,
    getConsistencyByLocation,
    getAchievementStats,
    getBadgeStats,
    calculateNetworkHealth,
    getGrowthProjection
  };
} 