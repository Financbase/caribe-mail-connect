import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Customer = Tables<'customers'>;
export type CustomerInsert = TablesInsert<'customers'>;

export interface CustomerFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  business_name?: string;
  mailbox_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  customer_type: Customer['customer_type'];
  notes?: string;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Cache management
  const cacheKey = 'prmcms-customers-cache';

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedCustomers = JSON.parse(cached);
        setCustomers(cachedCustomers);
        console.log('Loaded customers from cache:', cachedCustomers.length);
      } catch (err) {
        console.error('Error parsing cached customers:', err);
        localStorage.removeItem(cacheKey);
      }
    }
  }, []);

  // Save to cache whenever customers change
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(customers));
      console.log('Cached customers:', customers.length);
    }
  }, [customers]);

  const fetchCustomers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Fetching customers from database...');
      
      // Fetch customers with package count
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          packages!packages_customer_id_fkey (
            id,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process customer data to include package counts
      const customersWithCounts = data?.map(customer => ({
        ...customer,
        activePackages: customer.packages?.filter(
          (pkg: any) => pkg.status === 'Received' || pkg.status === 'Ready'
        ).length || 0,
        totalPackages: customer.packages?.length || 0
      })) || [];

      console.log('Fetched customers:', customersWithCounts.length);
      setCustomers(customersWithCounts);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      
      // If offline, use cached data
      if (err instanceof Error && err.message.includes('fetch')) {
        console.log('Using cached customers due to network error');
      }
    } finally {
      setLoading(false);
    }
  };
  const createCustomer = async (customerData: CustomerFormData): Promise<{ success: boolean; error?: string; data?: Customer }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      console.log('Creating customer:', customerData.email);
      
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...customerData,
          created_by: user.id,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state with default package counts
      const customerWithCounts = {
        ...data,
        activePackages: 0,
        totalPackages: 0
      };
      
      setCustomers(prev => [customerWithCounts, ...prev]);
      
      console.log('Customer created successfully:', data.id);
      return { success: true, data: customerWithCounts };
      
    } catch (err) {
      console.error('Error creating customer:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create customer' 
      };
    }
  };

  const updateCustomer = async (
    customerId: string, 
    customerData: Partial<CustomerFormData>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          ...customerData,
          updated_by: user.id
        })
        .eq('id', customerId);

      if (error) throw error;

      // Update local state
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...customerData }
          : customer
      ));

      return { success: true };
    } catch (err) {
      console.error('Error updating customer:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update customer' 
      };
    }
  };

  const getCustomerById = (id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id);
  };

  const searchCustomers = (searchTerm: string): Customer[] => {
    if (!searchTerm.trim()) return customers;
    
    const term = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.first_name.toLowerCase().includes(term) ||
      customer.last_name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.mailbox_number.toLowerCase().includes(term) ||
      (customer.business_name && customer.business_name.toLowerCase().includes(term))
    );
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  // Set up real-time updates for customers
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('Customer change received:', payload);
          // Refresh customers on any change
          fetchCustomers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    getCustomerById,
    searchCustomers,
    refetch: fetchCustomers
  };
}