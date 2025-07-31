import { supabase } from '@/integrations/supabase/client';
import type { 
  Partner, 
  PartnerContract, 
  Commission, 
  Vendor, 
  AffiliateProgram, 
  IntegrationPartner, 
  PartnerAnalytics,
  CollaborationWorkflow
} from '@/types/partners';

export class PartnerService {
  // Business Partners
  static async getPartners(): Promise<Partner[]> {
    try {
      const { data, error } = await supabase
        .from('business_partners')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching partners:', error);
      return [];
    }
  }

  static async addPartner(partner: Omit<Partner, 'id'>): Promise<Partner | null> {
    try {
      const { data, error } = await supabase
        .from('business_partners')
        .insert([partner])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding partner:', error);
      return null;
    }
  }

  // Partner Contracts
  static async getPartnerContracts(): Promise<PartnerContract[]> {
    try {
      const { data, error } = await supabase
        .from('partner_contracts')
        .select(`
          *,
          business_partners (
            id,
            name,
            type,
            status
          )
        `)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching partner contracts:', error);
      return [];
    }
  }

  // Commissions
  static async getCommissions(): Promise<Commission[]> {
    try {
      const { data, error } = await supabase
        .from('partner_commissions')
        .select(`
          *,
          business_partners (
            id,
            name,
            type
          ),
          partner_contracts (
            id,
            contract_number,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching commissions:', error);
      return [];
    }
  }

  // Partner Vendors
  static async getPartnerVendors(): Promise<Vendor[]> {
    try {
      const { data, error } = await supabase
        .from('partner_vendors')
        .select(`
          *,
          business_partners (
            id,
            name,
            type,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching partner vendors:', error);
      return [];
    }
  }

  // Affiliate Programs
  static async getAffiliatePrograms(): Promise<AffiliateProgram[]> {
    try {
      const { data, error } = await supabase
        .from('affiliate_programs')
        .select(`
          *,
          business_partners (
            id,
            name,
            type,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching affiliate programs:', error);
      return [];
    }
  }

  // Integration Partners
  static async getIntegrationPartners(): Promise<IntegrationPartner[]> {
    try {
      const { data, error } = await supabase
        .from('integration_partners')
        .select(`
          *,
          business_partners (
            id,
            name,
            type,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching integration partners:', error);
      return [];
    }
  }

  // Partner Analytics
  static async getPartnerAnalytics(): Promise<PartnerAnalytics[]> {
    try {
      const { data, error } = await supabase
        .from('partner_analytics')
        .select(`
          *,
          business_partners (
            id,
            name,
            type,
            status
          )
        `)
        .order('period', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching partner analytics:', error);
      return [];
    }
  }

  // Collaboration Workflows
  static async getCollaborationWorkflows(): Promise<CollaborationWorkflow[]> {
    try {
      const { data, error } = await supabase
        .from('collaboration_workflows')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching collaboration workflows:', error);
      return [];
    }
  }

  // Partner Dashboard Summary
  static async getPartnerDashboard() {
    try {
      const [
        partners,
        contracts,
        commissions,
        vendors,
        affiliatePrograms,
        integrationPartners,
        analytics,
        workflows
      ] = await Promise.all([
        this.getPartners(),
        this.getPartnerContracts(),
        this.getCommissions(),
        this.getPartnerVendors(),
        this.getAffiliatePrograms(),
        this.getIntegrationPartners(),
        this.getPartnerAnalytics(),
        this.getCollaborationWorkflows()
      ]);

      return {
        partners,
        contracts,
        commissions,
        vendors,
        affiliatePrograms,
        integrationPartners,
        analytics,
        workflows
      };
    } catch (error) {
      console.error('Error fetching partner dashboard:', error);
      return null;
    }
  }

  // Get partners by type
  static async getPartnersByType(type: string): Promise<Partner[]> {
    try {
      const { data, error } = await supabase
        .from('business_partners')
        .select('*')
        .eq('type', type)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching partners by type ${type}:`, error);
      return [];
    }
  }

  // Get partner by ID
  static async getPartnerById(id: string): Promise<Partner | null> {
    try {
      const { data, error } = await supabase
        .from('business_partners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching partner by ID:', error);
      return null;
    }
  }
} 