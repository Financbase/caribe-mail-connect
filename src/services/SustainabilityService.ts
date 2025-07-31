import { supabase } from '@/integrations/supabase/client';
import type { 
  CarbonFootprint, 
  GreenInitiative, 
  RecyclingMetrics, 
  EnergyConsumption, 
  SustainabilityScore,
  TreePlanting,
  GreenBadge,
  TreePlantingCounter,
  EcoFriendlyPackaging,
  CarbonOffsetProgram,
  ElectricVehicle,
  ConsolidatedShipping,
  PaperlessInitiative,
  PackageReuseProgram,
  RecyclingLocation,
  MaterialTracking,
  WasteAudit,
  ReductionGoal,
  SolarPanel,
  EnergyUsageTrend,
  EfficiencyImprovement,
  GreenCertification,
  LocalInitiative,
  EnvironmentalEducation,
  PartnerProgram,
  CustomerParticipation,
  ImpactReport,
  EnvironmentalVisualization
} from '@/types/sustainability';

export class SustainabilityService {
  // Carbon Footprint
  static async getCarbonFootprint(): Promise<CarbonFootprint[]> {
    try {
      const { data, error } = await supabase
        .from('carbon_footprint')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching carbon footprint:', error);
      return [];
    }
  }

  static async addCarbonFootprint(footprint: Omit<CarbonFootprint, 'id'>): Promise<CarbonFootprint | null> {
    try {
      const { data, error } = await supabase
        .from('carbon_footprint')
        .insert([footprint])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding carbon footprint:', error);
      return null;
    }
  }

  // Green Initiatives
  static async getGreenInitiatives(): Promise<GreenInitiative[]> {
    try {
      const { data, error } = await supabase
        .from('green_initiatives')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching green initiatives:', error);
      return [];
    }
  }

  static async addGreenInitiative(initiative: Omit<GreenInitiative, 'id'>): Promise<GreenInitiative | null> {
    try {
      const { data, error } = await supabase
        .from('green_initiatives')
        .insert([initiative])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding green initiative:', error);
      return null;
    }
  }

  // Recycling Metrics
  static async getRecyclingMetrics(): Promise<RecyclingMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('recycling_metrics')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recycling metrics:', error);
      return [];
    }
  }

  // Energy Consumption
  static async getEnergyConsumption(): Promise<EnergyConsumption[]> {
    try {
      const { data, error } = await supabase
        .from('energy_consumption')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching energy consumption:', error);
      return [];
    }
  }

  // Sustainability Score
  static async getSustainabilityScore(): Promise<SustainabilityScore | null> {
    try {
      const { data, error } = await supabase
        .from('sustainability_score')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sustainability score:', error);
      return null;
    }
  }

  // Tree Planting Counter
  static async getTreePlantingCounter(): Promise<TreePlantingCounter | null> {
    try {
      const { data, error } = await supabase
        .from('tree_planting_counter')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tree planting counter:', error);
      return null;
    }
  }

  // Tree Plantings
  static async getTreePlantings(): Promise<TreePlanting[]> {
    try {
      const { data, error } = await supabase
        .from('tree_plantings')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tree plantings:', error);
      return [];
    }
  }

  // Green Badges
  static async getGreenBadges(): Promise<GreenBadge[]> {
    try {
      const { data, error } = await supabase
        .from('green_badges')
        .select('*')
        .order('earned_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching green badges:', error);
      return [];
    }
  }

  // Eco-Friendly Packaging
  static async getEcoFriendlyPackaging(): Promise<EcoFriendlyPackaging[]> {
    try {
      const { data, error } = await supabase
        .from('eco_friendly_packaging')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching eco-friendly packaging:', error);
      return [];
    }
  }

  // Carbon Offset Programs
  static async getCarbonOffsetPrograms(): Promise<CarbonOffsetProgram[]> {
    try {
      const { data, error } = await supabase
        .from('carbon_offset_programs')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching carbon offset programs:', error);
      return [];
    }
  }

  // Electric Vehicles
  static async getElectricVehicles(): Promise<ElectricVehicle[]> {
    try {
      const { data, error } = await supabase
        .from('electric_vehicles')
        .select('*')
        .order('vehicle_id');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching electric vehicles:', error);
      return [];
    }
  }

  // Consolidated Shipping
  static async getConsolidatedShipping(): Promise<ConsolidatedShipping[]> {
    try {
      const { data, error } = await supabase
        .from('consolidated_shipping')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching consolidated shipping:', error);
      return [];
    }
  }

  // Paperless Initiatives
  static async getPaperlessInitiatives(): Promise<PaperlessInitiative[]> {
    try {
      const { data, error } = await supabase
        .from('paperless_initiatives')
        .select('*')
        .order('implementation_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching paperless initiatives:', error);
      return [];
    }
  }

  // Package Reuse Program
  static async getPackageReuseProgram(): Promise<PackageReuseProgram[]> {
    try {
      const { data, error } = await supabase
        .from('package_reuse_program')
        .select('*')
        .order('last_used', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching package reuse program:', error);
      return [];
    }
  }

  // Recycling Locations
  static async getRecyclingLocations(): Promise<RecyclingLocation[]> {
    try {
      const { data, error } = await supabase
        .from('recycling_locations')
        .select('*')
        .order('distance');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recycling locations:', error);
      return [];
    }
  }

  // Material Tracking
  static async getMaterialTracking(): Promise<MaterialTracking[]> {
    try {
      const { data, error } = await supabase
        .from('material_tracking')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching material tracking:', error);
      return [];
    }
  }

  // Waste Audit
  static async getWasteAudit(): Promise<WasteAudit[]> {
    try {
      const { data, error } = await supabase
        .from('waste_audit')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching waste audit:', error);
      return [];
    }
  }

  // Reduction Goals
  static async getReductionGoals(): Promise<ReductionGoal[]> {
    try {
      const { data, error } = await supabase
        .from('reduction_goals')
        .select('*')
        .order('deadline');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reduction goals:', error);
      return [];
    }
  }

  // Solar Panels
  static async getSolarPanels(): Promise<SolarPanel[]> {
    try {
      const { data, error } = await supabase
        .from('solar_panels')
        .select('*')
        .order('location');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching solar panels:', error);
      return [];
    }
  }

  // Energy Usage Trends
  static async getEnergyUsageTrends(): Promise<EnergyUsageTrend[]> {
    try {
      const { data, error } = await supabase
        .from('energy_usage_trends')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching energy usage trends:', error);
      return [];
    }
  }

  // Efficiency Improvements
  static async getEfficiencyImprovements(): Promise<EfficiencyImprovement[]> {
    try {
      const { data, error } = await supabase
        .from('efficiency_improvements')
        .select('*')
        .order('implementation_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching efficiency improvements:', error);
      return [];
    }
  }

  // Green Certifications
  static async getGreenCertifications(): Promise<GreenCertification[]> {
    try {
      const { data, error } = await supabase
        .from('green_certifications')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching green certifications:', error);
      return [];
    }
  }

  // Local Initiatives
  static async getLocalInitiatives(): Promise<LocalInitiative[]> {
    try {
      const { data, error } = await supabase
        .from('local_initiatives')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching local initiatives:', error);
      return [];
    }
  }

  // Environmental Education
  static async getEnvironmentalEducation(): Promise<EnvironmentalEducation[]> {
    try {
      const { data, error } = await supabase
        .from('environmental_education')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching environmental education:', error);
      return [];
    }
  }

  // Partner Programs
  static async getPartnerPrograms(): Promise<PartnerProgram[]> {
    try {
      const { data, error } = await supabase
        .from('partner_programs')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching partner programs:', error);
      return [];
    }
  }

  // Customer Participation
  static async getCustomerParticipation(): Promise<CustomerParticipation[]> {
    try {
      const { data, error } = await supabase
        .from('customer_participation')
        .select('*')
        .order('participation_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customer participation:', error);
      return [];
    }
  }

  // Impact Report
  static async getImpactReport(): Promise<ImpactReport | null> {
    try {
      const { data, error } = await supabase
        .from('impact_report')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching impact report:', error);
      return null;
    }
  }

  // Environmental Visualizations
  static async getEnvironmentalVisualizations(): Promise<EnvironmentalVisualization[]> {
    try {
      const { data, error } = await supabase
        .from('environmental_visualizations')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching environmental visualizations:', error);
      return [];
    }
  }

  // Dashboard Summary
  static async getSustainabilityDashboard() {
    try {
      const [
        carbonFootprint,
        greenInitiatives,
        recyclingMetrics,
        energyConsumption,
        sustainabilityScore,
        treePlantingCounter,
        treePlantings,
        greenBadges,
        ecoFriendlyPackaging,
        carbonOffsetPrograms,
        electricVehicles,
        consolidatedShipping,
        paperlessInitiatives,
        packageReuseProgram,
        recyclingLocations,
        materialTracking,
        wasteAudit,
        reductionGoals,
        solarPanels,
        energyUsageTrends,
        efficiencyImprovements,
        greenCertifications,
        localInitiatives,
        environmentalEducation,
        partnerPrograms,
        customerParticipation,
        impactReport,
        environmentalVisualizations
      ] = await Promise.all([
        this.getCarbonFootprint(),
        this.getGreenInitiatives(),
        this.getRecyclingMetrics(),
        this.getEnergyConsumption(),
        this.getSustainabilityScore(),
        this.getTreePlantingCounter(),
        this.getTreePlantings(),
        this.getGreenBadges(),
        this.getEcoFriendlyPackaging(),
        this.getCarbonOffsetPrograms(),
        this.getElectricVehicles(),
        this.getConsolidatedShipping(),
        this.getPaperlessInitiatives(),
        this.getPackageReuseProgram(),
        this.getRecyclingLocations(),
        this.getMaterialTracking(),
        this.getWasteAudit(),
        this.getReductionGoals(),
        this.getSolarPanels(),
        this.getEnergyUsageTrends(),
        this.getEfficiencyImprovements(),
        this.getGreenCertifications(),
        this.getLocalInitiatives(),
        this.getEnvironmentalEducation(),
        this.getPartnerPrograms(),
        this.getCustomerParticipation(),
        this.getImpactReport(),
        this.getEnvironmentalVisualizations()
      ]);

      return {
        carbonFootprint,
        greenInitiatives,
        recyclingMetrics,
        energyConsumption,
        sustainabilityScore,
        treePlantingCounter,
        treePlantings,
        greenBadges,
        ecoFriendlyPackaging,
        carbonOffsetPrograms,
        electricVehicles,
        consolidatedShipping,
        paperlessInitiatives,
        packageReuseProgram,
        recyclingLocations,
        materialTracking,
        wasteAudit,
        reductionGoals,
        solarPanels,
        energyUsageTrends,
        efficiencyImprovements,
        greenCertifications,
        localInitiatives,
        environmentalEducation,
        partnerPrograms,
        customerParticipation,
        impactReport,
        environmentalVisualizations
      };
    } catch (error) {
      console.error('Error fetching sustainability dashboard:', error);
      return null;
    }
  }

  // Calculate Environmental Impact Summary
  static calculateEnvironmentalImpact(data: any) {
    const totalCarbonSaved = 
      (data.carbonOffsetPrograms?.reduce((sum: number, offset: any) => sum + offset.totalOffset, 0) || 0) +
      (data.electricVehicles?.reduce((sum: number, vehicle: any) => sum + vehicle.carbonSaved, 0) || 0) +
      (data.consolidatedShipping?.reduce((sum: number, shipment: any) => sum + shipment.carbonSaved, 0) || 0) +
      (data.paperlessInitiatives?.reduce((sum: number, initiative: any) => sum + initiative.carbonSaved, 0) || 0) +
      (data.packageReuseProgram?.reduce((sum: number, pkg: any) => sum + pkg.carbonSaved, 0) || 0) +
      (data.solarPanels?.reduce((sum: number, panel: any) => sum + panel.carbonOffset, 0) || 0) +
      (data.efficiencyImprovements?.reduce((sum: number, improvement: any) => sum + improvement.savings.carbon, 0) || 0);

    const totalCostSavings = 
      (data.consolidatedShipping?.reduce((sum: number, shipment: any) => sum + shipment.costSavings, 0) || 0) +
      (data.paperlessInitiatives?.reduce((sum: number, initiative: any) => sum + initiative.costSavings, 0) || 0) +
      (data.packageReuseProgram?.reduce((sum: number, pkg: any) => sum + pkg.costSavings, 0) || 0) +
      (data.solarPanels?.reduce((sum: number, panel: any) => sum + panel.costSavings, 0) || 0) +
      (data.efficiencyImprovements?.reduce((sum: number, improvement: any) => sum + improvement.savings.cost, 0) || 0);

    const totalPeopleReached = 
      (data.localInitiatives?.reduce((sum: number, initiative: any) => sum + initiative.impact.peopleReached, 0) || 0) +
      (data.environmentalEducation?.reduce((sum: number, education: any) => sum + education.participants, 0) || 0);

    const totalTreesPlanted = data.treePlantingCounter?.totalPlanted || 0;

    return {
      carbonSaved: totalCarbonSaved,
      costSavings: totalCostSavings,
      peopleReached: totalPeopleReached,
      treesPlanted: totalTreesPlanted
    };
  }
} 