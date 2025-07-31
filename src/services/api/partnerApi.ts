import { 
  Partner, 
  PartnersResponse, 
  PartnerFilters,
  Vendor,
  AffiliateProgram,
  IntegrationPartner,
  PartnerAnalytics,
  PartnerContract,
  Commission
} from '../../types/partners';

export class PartnerApiService {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Partner Management APIs
  async getPartners(filters?: PartnerFilters): Promise<PartnersResponse> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type.join(','));
    if (filters?.status) params.append('status', filters.status.join(','));
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }

    return this.request<PartnersResponse>(`/api/partners?${params.toString()}`);
  }

  async getPartner(id: string): Promise<Partner> {
    return this.request<Partner>(`/api/partners/${id}`);
  }

  async createPartner(partner: Omit<Partner, 'id'>): Promise<Partner> {
    return this.request<Partner>('/api/partners', {
      method: 'POST',
      body: JSON.stringify(partner),
    });
  }

  async updatePartner(id: string, partner: Partial<Partner>): Promise<Partner> {
    return this.request<Partner>(`/api/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partner),
    });
  }

  async deletePartner(id: string): Promise<void> {
    return this.request<void>(`/api/partners/${id}`, {
      method: 'DELETE',
    });
  }

  // Vendor Management APIs
  async getVendors(): Promise<Vendor[]> {
    return this.request<Vendor[]>('/api/vendors');
  }

  async getVendor(id: string): Promise<Vendor> {
    return this.request<Vendor>(`/api/vendors/${id}`);
  }

  async createVendor(vendor: Omit<Vendor, 'id'>): Promise<Vendor> {
    return this.request<Vendor>('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
  }

  async updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor> {
    return this.request<Vendor>(`/api/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendor),
    });
  }

  async getVendorProcurementHistory(id: string): Promise<any[]> {
    return this.request<any[]>(`/api/vendors/${id}/procurement`);
  }

  // Affiliate Program APIs
  async getAffiliatePrograms(): Promise<AffiliateProgram[]> {
    return this.request<AffiliateProgram[]>('/api/affiliates');
  }

  async getAffiliateProgram(id: string): Promise<AffiliateProgram> {
    return this.request<AffiliateProgram>(`/api/affiliates/${id}`);
  }

  async createAffiliateProgram(affiliate: Omit<AffiliateProgram, 'id'>): Promise<AffiliateProgram> {
    return this.request<AffiliateProgram>('/api/affiliates', {
      method: 'POST',
      body: JSON.stringify(affiliate),
    });
  }

  async getAffiliateReferrals(id: string): Promise<any[]> {
    return this.request<any[]>(`/api/affiliates/${id}/referrals`);
  }

  async processCommission(id: string, commission: any): Promise<Commission> {
    return this.request<Commission>(`/api/affiliates/${id}/commissions`, {
      method: 'POST',
      body: JSON.stringify(commission),
    });
  }

  // Integration Partners APIs
  async getIntegrationPartners(): Promise<IntegrationPartner[]> {
    return this.request<IntegrationPartner[]>('/api/integrations');
  }

  async getIntegrationPartner(id: string): Promise<IntegrationPartner> {
    return this.request<IntegrationPartner>(`/api/integrations/${id}`);
  }

  async createIntegrationPartner(integration: Omit<IntegrationPartner, 'id'>): Promise<IntegrationPartner> {
    return this.request<IntegrationPartner>('/api/integrations', {
      method: 'POST',
      body: JSON.stringify(integration),
    });
  }

  async getIntegrationUsage(id: string): Promise<any> {
    return this.request<any>(`/api/integrations/${id}/usage`);
  }

  async handleWebhook(id: string, webhookData: any): Promise<void> {
    return this.request<void>(`/api/integrations/${id}/webhook`, {
      method: 'POST',
      body: JSON.stringify(webhookData),
    });
  }

  // Analytics APIs
  async getPartnerAnalytics(partnerId: string, period: string): Promise<PartnerAnalytics> {
    return this.request<PartnerAnalytics>(`/api/analytics/partners/${partnerId}?period=${period}`);
  }

  async getRevenueAnalytics(filters?: any): Promise<any> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, value as string);
      });
    }
    return this.request<any>(`/api/analytics/revenue?${params.toString()}`);
  }

  async getGrowthAnalytics(): Promise<any> {
    return this.request<any>('/api/analytics/growth');
  }

  // Contract Management APIs
  async getPartnerContracts(partnerId: string): Promise<PartnerContract[]> {
    return this.request<PartnerContract[]>(`/api/partners/${partnerId}/contracts`);
  }

  async createContract(contract: Omit<PartnerContract, 'id'>): Promise<PartnerContract> {
    return this.request<PartnerContract>('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(contract),
    });
  }

  async updateContract(id: string, contract: Partial<PartnerContract>): Promise<PartnerContract> {
    return this.request<PartnerContract>(`/api/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contract),
    });
  }

  // Commission Management APIs
  async getCommissions(partnerId: string, period?: string): Promise<Commission[]> {
    const params = period ? `?period=${period}` : '';
    return this.request<Commission[]>(`/api/partners/${partnerId}/commissions${params}`);
  }

  async createCommission(commission: Omit<Commission, 'id'>): Promise<Commission> {
    return this.request<Commission>('/api/commissions', {
      method: 'POST',
      body: JSON.stringify(commission),
    });
  }

  async updateCommissionStatus(id: string, status: 'pending' | 'paid' | 'cancelled'): Promise<Commission> {
    return this.request<Commission>(`/api/commissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

// Default API service instance
export const partnerApi = new PartnerApiService(
  process.env.REACT_APP_API_URL || 'http://localhost:3000',
  localStorage.getItem('authToken') || ''
); 