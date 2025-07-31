import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Country,
  Currency,
  InternationalPackage,
  InternationalRate,
  CustomsForm,
  ExchangeRate,
  ProhibitedItem,
  RestrictedItem,
  InternationalAnalytics,
  WorldMapData
} from '@/types/international';
import {
  countries,
  currencies,
  internationalPackages,
  prohibitedItems,
  restrictedItems,
  worldMapData,
  internationalAnalytics,
  getCountryByCode,
  getCurrencyByCode,
  getShippingZoneByCountry
} from '@/data/internationalData';

// Mock API functions (replace with actual API calls)
const mockApi = {
  // Exchange rates API
  getExchangeRates: async (): Promise<ExchangeRate[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return currencies.map(currency => ({
      fromCurrency: 'USD',
      toCurrency: currency.code,
      rate: currency.exchangeRate,
      lastUpdated: new Date().toISOString()
    }));
  },

  // Rate calculation API
  calculateRate: async (params: {
    originCountry: string;
    destinationCountry: string;
    weight: number;
    service: 'express' | 'standard' | 'economy';
  }): Promise<InternationalRate> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const origin = getCountryByCode(params.originCountry);
    const destination = getCountryByCode(params.destinationCountry);
    const zone = getShippingZoneByCountry(params.destinationCountry);
    
    if (!origin || !destination || !zone) {
      throw new Error('Invalid country codes');
    }

    const baseRate = zone.baseRate;
    const weightCharge = params.weight * zone.weightMultiplier;
    const fuelSurcharge = (baseRate + weightCharge) * 0.15;
    const customsFees = params.weight * 5; // Simplified calculation
    
    const totalRate = baseRate + weightCharge + fuelSurcharge + customsFees;
    
    return {
      originCountry: params.originCountry,
      destinationCountry: params.destinationCountry,
      weight: params.weight,
      service: params.service,
      baseRate,
      fuelSurcharge,
      customsFees,
      totalRate,
      currency: 'USD',
      transitTime: destination.transitTime[params.service]
    };
  },

  // Package tracking API
  getPackageTracking: async (trackingNumber: string): Promise<InternationalPackage | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return internationalPackages.find(pkg => pkg.trackingNumber === trackingNumber) || null;
  },

  // Customs form generation API
  generateCustomsForm: async (params: {
    type: 'CN22' | 'CN23' | 'CommercialInvoice' | 'ExportDeclaration';
    packageId: string;
    data: Record<string, any>;
  }): Promise<CustomsForm> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const formNumber = `${params.type}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    return {
      id: `form-${Date.now()}`,
      type: params.type,
      formNumber,
      packageId: params.packageId,
      data: params.data,
      isSigned: false,
      createdAt: new Date().toISOString()
    };
  },

  // Address validation API
  validateAddress: async (address: {
    country: string;
    postalCode: string;
    city: string;
    address1: string;
  }): Promise<{ isValid: boolean; suggestions?: string[] }> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simple validation logic
    const isValid = address.address1.length > 5 && address.city.length > 2;
    
    return {
      isValid,
      suggestions: isValid ? undefined : ['Please provide a complete address']
    };
  }
};

export const useInternational = () => {
  const queryClient = useQueryClient();
  const [selectedOriginCountry, setSelectedOriginCountry] = useState<string>('PR');
  const [selectedDestinationCountry, setSelectedDestinationCountry] = useState<string>('DO');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  // Exchange rates query
  const { data: exchangeRates, isLoading: ratesLoading } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: mockApi.getExchangeRates,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // 10 minutes
  });

  // Currency conversion function
  const convertCurrency = useCallback((amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const fromRate = exchangeRates?.find(rate => rate.toCurrency === fromCurrency)?.rate || 1;
    const toRate = exchangeRates?.find(rate => rate.toCurrency === toCurrency)?.rate || 1;
    
    return (amount / fromRate) * toRate;
  }, [exchangeRates]);

  // Rate calculation mutation
  const rateCalculationMutation = useMutation({
    mutationFn: mockApi.calculateRate,
    onSuccess: (data) => {
      queryClient.setQueryData(['rateCalculation', data], data);
    }
  });

  // Package tracking query
  const usePackageTracking = (trackingNumber: string) => {
    return useQuery({
      queryKey: ['packageTracking', trackingNumber],
      queryFn: () => mockApi.getPackageTracking(trackingNumber),
      enabled: !!trackingNumber,
      refetchInterval: 30 * 1000 // 30 seconds
    });
  };

  // Customs form generation mutation
  const customsFormMutation = useMutation({
    mutationFn: mockApi.generateCustomsForm,
    onSuccess: (data) => {
      queryClient.setQueryData(['customsForm', data.id], data);
    }
  });

  // Address validation mutation
  const addressValidationMutation = useMutation({
    mutationFn: mockApi.validateAddress
  });

  // Get countries by region
  const getCountriesByRegion = useCallback((region: string): Country[] => {
    const regionMap: Record<string, string[]> = {
      'caribbean': ['PR', 'DO', 'JM', 'TT', 'BB'],
      'central-america': ['MX'],
      'south-america': ['CO', 'BR', 'AR', 'CL']
    };
    
    const countryCodes = regionMap[region] || [];
    return countries.filter(country => countryCodes.includes(country.code));
  }, []);

  // Get prohibited items by country
  const getProhibitedItemsByCountry = useCallback((countryCode: string): ProhibitedItem[] => {
    return prohibitedItems.filter(item => item.countries.includes(countryCode));
  }, []);

  // Get restricted items by country
  const getRestrictedItemsByCountry = useCallback((countryCode: string): RestrictedItem[] => {
    return restrictedItems.filter(item => item.countries.includes(countryCode));
  }, []);

  // Calculate import duties
  const calculateImportDuties = useCallback((declaredValue: number, countryCode: string): number => {
    const country = getCountryByCode(countryCode);
    if (!country) return 0;
    
    return declaredValue * country.importDutyRate;
  }, []);

  // Calculate VAT
  const calculateVAT = useCallback((declaredValue: number, countryCode: string): number => {
    const country = getCountryByCode(countryCode);
    if (!country) return 0;
    
    return declaredValue * country.vatRate;
  }, []);

  // Get transit time
  const getTransitTime = useCallback((originCountry: string, destinationCountry: string, service: 'express' | 'standard' | 'economy'): number => {
    const destination = getCountryByCode(destinationCountry);
    if (!destination) return 0;
    
    return destination.transitTime[service];
  }, []);

  // Format currency
  const formatCurrency = useCallback((amount: number, currencyCode: string): string => {
    const currency = getCurrencyByCode(currencyCode);
    if (!currency) return `$${amount.toFixed(2)}`;
    
    return `${currency.symbol}${amount.toFixed(2)}`;
  }, []);

  // Get shipping zone info
  const getShippingZoneInfo = useCallback((countryCode: string) => {
    return getShippingZoneByCountry(countryCode);
  }, []);

  // Check if item is prohibited
  const isItemProhibited = useCallback((itemName: string, countryCode: string): boolean => {
    const countryProhibitedItems = getProhibitedItemsByCountry(countryCode);
    return countryProhibitedItems.some(item => 
      item.name.toLowerCase().includes(itemName.toLowerCase()) ||
      item.category.toLowerCase().includes(itemName.toLowerCase())
    );
  }, [getProhibitedItemsByCountry]);

  // Check if item is restricted
  const isItemRestricted = useCallback((itemName: string, countryCode: string): boolean => {
    const countryRestrictedItems = getRestrictedItemsByCountry(countryCode);
    return countryRestrictedItems.some(item => 
      item.name.toLowerCase().includes(itemName.toLowerCase()) ||
      item.category.toLowerCase().includes(itemName.toLowerCase())
    );
  }, [getRestrictedItemsByCountry]);

  // Get required documents for country
  const getRequiredDocuments = useCallback((countryCode: string): string[] => {
    const country = getCountryByCode(countryCode);
    return country?.requiredDocuments || [];
  }, []);

  // Get world map data
  const getWorldMapData = useCallback((): WorldMapData => {
    return worldMapData;
  }, []);

  // Get analytics data
  const getAnalytics = useCallback((): InternationalAnalytics => {
    return internationalAnalytics;
  }, []);

  return {
    // State
    selectedOriginCountry,
    setSelectedOriginCountry,
    selectedDestinationCountry,
    setSelectedDestinationCountry,
    selectedCurrency,
    setSelectedCurrency,
    
    // Data
    countries,
    currencies,
    internationalPackages,
    prohibitedItems,
    restrictedItems,
    worldMapData,
    internationalAnalytics,
    
    // Queries
    exchangeRates,
    ratesLoading,
    
    // Mutations
    rateCalculationMutation,
    customsFormMutation,
    addressValidationMutation,
    
    // Functions
    convertCurrency,
    usePackageTracking,
    getCountriesByRegion,
    getCountryByCode,
    getCurrencyByCode,
    getShippingZoneByCountry,
    getProhibitedItemsByCountry,
    getRestrictedItemsByCountry,
    calculateImportDuties,
    calculateVAT,
    getTransitTime,
    formatCurrency,
    getShippingZoneInfo,
    isItemProhibited,
    isItemRestricted,
    getRequiredDocuments,
    getWorldMapData,
    getAnalytics
  };
}; 