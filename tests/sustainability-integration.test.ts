import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sustainability from '../src/pages/Sustainability';
import { SustainabilityService } from '../src/services/SustainabilityService';
import { mockCarbonFootprint, mockGreenInitiatives } from '../src/data/sustainabilityData';

// Mock the SustainabilityService
vi.mock('../src/services/SustainabilityService', () => ({
  SustainabilityService: {
    getSustainabilityDashboard: vi.fn(),
    calculateEnvironmentalImpact: vi.fn()
  }
}));

// Mock all sustainability components
vi.mock('../src/components/sustainability/CarbonFootprintCalculator', () => ({
  default: () => React.createElement('div', { 'data-testid': 'carbon-calculator' }, 'Carbon Calculator')
}));

vi.mock('../src/components/sustainability/GreenShippingTracker', () => ({
  default: () => React.createElement('div', { 'data-testid': 'green-shipping-tracker' }, 'Green Shipping Tracker')
}));

vi.mock('../src/components/sustainability/WasteReductionTracker', () => ({
  default: () => React.createElement('div', { 'data-testid': 'waste-reduction-tracker' }, 'Waste Reduction Tracker')
}));

vi.mock('../src/components/sustainability/EnergyManagementTracker', () => ({
  default: () => React.createElement('div', { 'data-testid': 'energy-management-tracker' }, 'Energy Management Tracker')
}));

vi.mock('../src/components/sustainability/CommunityImpactTracker', () => ({
  default: () => React.createElement('div', { 'data-testid': 'community-impact-tracker' }, 'Community Impact Tracker')
}));

vi.mock('../src/components/sustainability/EnvironmentalVisualization', () => ({
  default: () => React.createElement('div', { 'data-testid': 'environmental-visualization' }, 'Environmental Visualization')
}));

vi.mock('../src/components/sustainability/GreenBadges', () => ({
  default: () => React.createElement('div', { 'data-testid': 'green-badges' }, 'Green Badges')
}));

vi.mock('../src/components/sustainability/TreePlantingCounter', () => ({
  default: () => React.createElement('div', { 'data-testid': 'tree-planting-counter' }, 'Tree Planting Counter')
}));

const mockDashboardData = {
  carbonFootprint: mockCarbonFootprint,
  greenInitiatives: mockGreenInitiatives,
  recyclingMetrics: [],
  energyConsumption: [],
  sustainabilityScore: { overallScore: 85, categories: {} },
  greenBadges: [],
  treePlantingCounter: { totalPlanted: 1000, goal: 5000, progress: 20, totalCarbonOffset: 5000, recentPlantings: [] },
  ecoFriendlyPackaging: [],
  carbonOffsetPrograms: [],
  electricVehicles: [],
  consolidatedShipping: [],
  paperlessInitiatives: [],
  packageReuseProgram: [],
  recyclingLocations: [],
  materialTracking: [],
  wasteAudit: [],
  reductionGoals: [],
  solarPanels: [],
  energyUsageTrends: [],
  efficiencyImprovements: [],
  greenCertifications: [],
  localInitiatives: [],
  environmentalEducation: [],
  partnerPrograms: [],
  customerParticipation: [],
  impactReport: [],
  environmentalVisualizations: []
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Sustainability Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the sustainability page with loading state initially', () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    renderWithRouter(<Sustainability />);
    
    expect(screen.getByText('Loading sustainability data...')).toBeInTheDocument();
  });

  it('should render the sustainability page with data successfully', async () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(mockDashboardData);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByText('Sustainability Hub')).toBeInTheDocument();
    });

    expect(screen.getByText('Track and manage your environmental impact across all operations')).toBeInTheDocument();
    expect(screen.getByText('Carbon Calculator')).toBeInTheDocument();
    expect(screen.getByText('Environmental Impact Overview')).toBeInTheDocument();
  });

  it('should display environmental impact overview with correct data', async () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(mockDashboardData);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByText('1,500 kg')).toBeInTheDocument();
      expect(screen.getByText('$25,000')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
    });
  });

  it('should render all tab content correctly', async () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(mockDashboardData);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Green Shipping')).toBeInTheDocument();
      expect(screen.getByText('Waste Reduction')).toBeInTheDocument();
      expect(screen.getByText('Energy Management')).toBeInTheDocument();
      expect(screen.getByText('Community Impact')).toBeInTheDocument();
      expect(screen.getByText('Initiatives')).toBeInTheDocument();
      expect(screen.getByText('Achievements')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  it('should render sustainability components in overview tab', async () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(mockDashboardData);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByTestId('tree-planting-counter')).toBeInTheDocument();
      expect(screen.getByTestId('green-badges')).toBeInTheDocument();
    });
  });

  it('should render specialized trackers in their respective tabs', async () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(mockDashboardData);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      // These components should be rendered when their tabs are active
      expect(screen.getByTestId('green-shipping-tracker')).toBeInTheDocument();
      expect(screen.getByTestId('waste-reduction-tracker')).toBeInTheDocument();
      expect(screen.getByTestId('energy-management-tracker')).toBeInTheDocument();
      expect(screen.getByTestId('community-impact-tracker')).toBeInTheDocument();
    });
  });

  it('should handle service errors gracefully and show fallback data', async () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockRejectedValue(new Error('Service error'));

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load sustainability data. Using demo data instead.')).toBeInTheDocument();
    });

    // Should still render the page with fallback data
    expect(screen.getByText('Sustainability Hub')).toBeInTheDocument();
  });

  it('should toggle carbon calculator visibility', async () => {
    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(mockDashboardData);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByText('Carbon Calculator')).toBeInTheDocument();
    });

    // Initially calculator should not be visible
    expect(screen.queryByTestId('carbon-calculator')).not.toBeInTheDocument();

    // Click the calculator button
    const calculatorButton = screen.getByText('Carbon Calculator');
    calculatorButton.click();

    // Calculator should now be visible
    await waitFor(() => {
      expect(screen.getByTestId('carbon-calculator')).toBeInTheDocument();
    });
  });

  it('should display initiative cards with correct data', async () => {
    const mockInitiatives = [
      {
        id: '1',
        name: 'Solar Panel Installation',
        description: 'Install solar panels on warehouse roofs',
        status: 'in-progress',
        carbonSaved: 500,
        costSavings: 10000,
        peopleReached: 50,
        progress: 75
      }
    ];

    const dashboardWithInitiatives = {
      ...mockDashboardData,
      greenInitiatives: mockInitiatives
    };

    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(dashboardWithInitiatives);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByText('Solar Panel Installation')).toBeInTheDocument();
      expect(screen.getByText('Install solar panels on warehouse roofs')).toBeInTheDocument();
      expect(screen.getByText('500 kg CO2')).toBeInTheDocument();
      expect(screen.getByText('$10,000')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  it('should display reduction goals correctly', async () => {
    const mockGoals = [
      {
        id: '1',
        goalType: 'Carbon Reduction',
        targetAmount: 1000,
        currentAmount: 750,
        unit: 'kg CO2',
        targetDate: '2024-12-31',
        status: 'in_progress',
        description: 'Reduce carbon emissions by 1000 kg'
      }
    ];

    const dashboardWithGoals = {
      ...mockDashboardData,
      reductionGoals: mockGoals
    };

    (SustainabilityService.getSustainabilityDashboard as any).mockResolvedValue(dashboardWithGoals);
    (SustainabilityService.calculateEnvironmentalImpact as any).mockReturnValue({
      totalCarbonSaved: 1500,
      totalCostSavings: 25000,
      totalPeopleReached: 500,
      totalTreesPlanted: 1000
    });

    renderWithRouter(<Sustainability />);
    
    await waitFor(() => {
      expect(screen.getByText('Carbon Reduction')).toBeInTheDocument();
      expect(screen.getByText('750 / 1000 kg CO2')).toBeInTheDocument();
    });
  });
}); 