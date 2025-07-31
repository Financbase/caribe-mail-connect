import { supabase } from '@/integrations/supabase/client';
import type { 
  CarbonFootprint, 
  GreenInitiative, 
  RecyclingMetrics, 
  EnergyConsumption, 
  SustainabilityScore,
  TreePlanting,
  GreenBadge,
  TreePlantingCounter
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
        greenBadges
      ] = await Promise.all([
        this.getCarbonFootprint(),
        this.getGreenInitiatives(),
        this.getRecyclingMetrics(),
        this.getEnergyConsumption(),
        this.getSustainabilityScore(),
        this.getTreePlantingCounter(),
        this.getTreePlantings(),
        this.getGreenBadges()
      ]);

      return {
        carbonFootprint,
        greenInitiatives,
        recyclingMetrics,
        energyConsumption,
        sustainabilityScore,
        treePlantingCounter,
        treePlantings,
        greenBadges
      };
    } catch (error) {
      console.error('Error fetching sustainability dashboard:', error);
      return null;
    }
  }
} 