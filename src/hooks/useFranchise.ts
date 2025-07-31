import { useState, useEffect } from 'react';

interface FranchiseLocation {
  id: string;
  name: string;
  owner: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: 'active' | 'pending' | 'suspended' | 'closed';
  performance_score: number;
  compliance_score: number;
  revenue: number;
  customers: number;
  employees: number;
  established_date: string;
  territory_size: string;
  market_penetration: number;
}

interface NetworkMetrics {
  total_locations: number;
  active_locations: number;
  total_revenue: number;
  total_customers: number;
  total_employees: number;
  average_performance: number;
  average_compliance: number;
  network_growth_rate: number;
  market_coverage: number;
}

interface PerformanceRanking {
  location_id: string;
  location_name: string;
  owner: string;
  rank: number;
  performance_score: number;
  revenue: number;
  growth_rate: number;
  customer_satisfaction: number;
  efficiency_score: number;
}

// Mock data for franchise locations
const mockFranchiseLocations: FranchiseLocation[] = [
  {
    id: '1',
    name: 'PRMCMS San Juan Centro',
    owner: 'María González',
    address: 'Calle San Francisco #123, San Juan, PR',
    coordinates: { lat: 18.4655, lng: -66.1057 },
    status: 'active',
    performance_score: 95,
    compliance_score: 92,
    revenue: 1250000,
    customers: 850,
    employees: 12,
    established_date: '2023-01-15',
    territory_size: 'San Juan Centro',
    market_penetration: 78
  },
  {
    id: '2',
    name: 'PRMCMS Bayamón Express',
    owner: 'Carlos Rodríguez',
    address: 'Ave. Principal #456, Bayamón, PR',
    coordinates: { lat: 18.3985, lng: -66.1617 },
    status: 'active',
    performance_score: 88,
    compliance_score: 85,
    revenue: 980000,
    customers: 720,
    employees: 10,
    established_date: '2023-03-20',
    territory_size: 'Bayamón',
    market_penetration: 65
  },
  {
    id: '3',
    name: 'PRMCMS Caguas Hub',
    owner: 'Ana Martínez',
    address: 'Calle Comercio #789, Caguas, PR',
    coordinates: { lat: 18.2341, lng: -66.0355 },
    status: 'active',
    performance_score: 92,
    compliance_score: 89,
    revenue: 1100000,
    customers: 780,
    employees: 11,
    established_date: '2023-02-10',
    territory_size: 'Caguas',
    market_penetration: 72
  },
  {
    id: '4',
    name: 'PRMCMS Ponce Sur',
    owner: 'Luis Torres',
    address: 'Ave. Las Américas #321, Ponce, PR',
    coordinates: { lat: 18.0111, lng: -66.6141 },
    status: 'active',
    performance_score: 87,
    compliance_score: 83,
    revenue: 920000,
    customers: 680,
    employees: 9,
    established_date: '2023-04-05',
    territory_size: 'Ponce Sur',
    market_penetration: 58
  },
  {
    id: '5',
    name: 'PRMCMS Mayagüez Oeste',
    owner: 'Carmen Vega',
    address: 'Calle McKinley #654, Mayagüez, PR',
    coordinates: { lat: 18.2013, lng: -67.1396 },
    status: 'pending',
    performance_score: 0,
    compliance_score: 0,
    revenue: 0,
    customers: 0,
    employees: 0,
    established_date: '2024-01-15',
    territory_size: 'Mayagüez',
    market_penetration: 0
  },
  {
    id: '6',
    name: 'PRMCMS Arecibo Norte',
    owner: 'Roberto Sánchez',
    address: 'Ave. San Luis #987, Arecibo, PR',
    coordinates: { lat: 18.4725, lng: -66.7156 },
    status: 'active',
    performance_score: 90,
    compliance_score: 87,
    revenue: 1050000,
    customers: 750,
    employees: 10,
    established_date: '2023-05-12',
    territory_size: 'Arecibo',
    market_penetration: 68
  },
  {
    id: '7',
    name: 'PRMCMS Carolina Este',
    owner: 'Isabel Morales',
    address: 'Calle Loíza #147, Carolina, PR',
    coordinates: { lat: 18.3808, lng: -65.9577 },
    status: 'active',
    performance_score: 94,
    compliance_score: 91,
    revenue: 1180000,
    customers: 820,
    employees: 12,
    established_date: '2023-01-28',
    territory_size: 'Carolina',
    market_penetration: 75
  },
  {
    id: '8',
    name: 'PRMCMS Aguadilla Costa',
    owner: 'Fernando López',
    address: 'Ave. Rafael Cordero #258, Aguadilla, PR',
    coordinates: { lat: 18.4277, lng: -67.1547 },
    status: 'suspended',
    performance_score: 45,
    compliance_score: 38,
    revenue: 320000,
    customers: 280,
    employees: 6,
    established_date: '2023-06-18',
    territory_size: 'Aguadilla',
    market_penetration: 25
  }
];

// Mock network metrics
const mockNetworkMetrics: NetworkMetrics = {
  total_locations: 8,
  active_locations: 6,
  total_revenue: 6600000,
  total_customers: 4880,
  total_employees: 70,
  average_performance: 87,
  average_compliance: 84,
  network_growth_rate: 25,
  market_coverage: 68
};

// Mock performance rankings
const mockPerformanceRankings: PerformanceRanking[] = [
  {
    location_id: '1',
    location_name: 'PRMCMS San Juan Centro',
    owner: 'María González',
    rank: 1,
    performance_score: 95,
    revenue: 1250000,
    growth_rate: 18,
    customer_satisfaction: 4.8,
    efficiency_score: 92
  },
  {
    location_id: '7',
    location_name: 'PRMCMS Carolina Este',
    owner: 'Isabel Morales',
    rank: 2,
    performance_score: 94,
    revenue: 1180000,
    growth_rate: 15,
    customer_satisfaction: 4.7,
    efficiency_score: 90
  },
  {
    location_id: '3',
    location_name: 'PRMCMS Caguas Hub',
    owner: 'Ana Martínez',
    rank: 3,
    performance_score: 92,
    revenue: 1100000,
    growth_rate: 12,
    customer_satisfaction: 4.6,
    efficiency_score: 88
  },
  {
    location_id: '6',
    location_name: 'PRMCMS Arecibo Norte',
    owner: 'Roberto Sánchez',
    rank: 4,
    performance_score: 90,
    revenue: 1050000,
    growth_rate: 10,
    customer_satisfaction: 4.5,
    efficiency_score: 85
  },
  {
    location_id: '2',
    location_name: 'PRMCMS Bayamón Express',
    owner: 'Carlos Rodríguez',
    rank: 5,
    performance_score: 88,
    revenue: 980000,
    growth_rate: 8,
    customer_satisfaction: 4.4,
    efficiency_score: 83
  },
  {
    location_id: '4',
    location_name: 'PRMCMS Ponce Sur',
    owner: 'Luis Torres',
    rank: 6,
    performance_score: 87,
    revenue: 920000,
    growth_rate: 6,
    customer_satisfaction: 4.3,
    efficiency_score: 80
  },
  {
    location_id: '8',
    location_name: 'PRMCMS Aguadilla Costa',
    owner: 'Fernando López',
    rank: 7,
    performance_score: 45,
    revenue: 320000,
    growth_rate: -15,
    customer_satisfaction: 3.2,
    efficiency_score: 45
  },
  {
    location_id: '5',
    location_name: 'PRMCMS Mayagüez Oeste',
    owner: 'Carmen Vega',
    rank: 8,
    performance_score: 0,
    revenue: 0,
    growth_rate: 0,
    customer_satisfaction: 0,
    efficiency_score: 0
  }
];

export function useFranchise() {
  const [franchiseLocations, setFranchiseLocations] = useState<FranchiseLocation[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null);
  const [performanceRankings, setPerformanceRankings] = useState<PerformanceRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFranchiseData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFranchiseLocations(mockFranchiseLocations);
        setNetworkMetrics(mockNetworkMetrics);
        setPerformanceRankings(mockPerformanceRankings);
      } catch (error) {
        console.error('Error fetching franchise data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchiseData();
  }, []);

  const updateFranchiseLocation = async (id: string, updates: Partial<FranchiseLocation>) => {
    setFranchiseLocations(prev => 
      prev.map(location => 
        location.id === id ? { ...location, ...updates } : location
      )
    );
  };

  const addFranchiseLocation = async (location: Omit<FranchiseLocation, 'id'>) => {
    const newLocation: FranchiseLocation = {
      ...location,
      id: Date.now().toString()
    };
    setFranchiseLocations(prev => [...prev, newLocation]);
  };

  const removeFranchiseLocation = async (id: string) => {
    setFranchiseLocations(prev => prev.filter(location => location.id !== id));
  };

  const getLocationById = (id: string) => {
    return franchiseLocations.find(location => location.id === id);
  };

  const getLocationsByStatus = (status: FranchiseLocation['status']) => {
    return franchiseLocations.filter(location => location.status === status);
  };

  const getTopPerformers = (limit: number = 5) => {
    return performanceRankings.slice(0, limit);
  };

  const getLocationsNeedingAttention = () => {
    return franchiseLocations.filter(location => 
      location.performance_score < 70 || location.compliance_score < 80
    );
  };

  return {
    franchiseLocations,
    networkMetrics,
    performanceRankings,
    loading,
    updateFranchiseLocation,
    addFranchiseLocation,
    removeFranchiseLocation,
    getLocationById,
    getLocationsByStatus,
    getTopPerformers,
    getLocationsNeedingAttention
  };
} 