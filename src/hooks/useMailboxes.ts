import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Mailbox = Tables<'mailboxes'> & {
  current_customer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  package_count?: number;
};
export type MailboxInsert = TablesInsert<'mailboxes'>;

export interface MailboxStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
  expiring: number;
  overdue: number;
}

export function useMailboxes() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const cacheKey = 'prmcms-mailboxes-cache';

  // Load from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedMailboxes = JSON.parse(cached);
        setMailboxes(cachedMailboxes);
        console.log('Loaded mailboxes from cache:', cachedMailboxes.length);
      } catch (err) {
        console.error('Error parsing cached mailboxes:', err);
        localStorage.removeItem(cacheKey);
      }
    }
  }, []);

  // Save to cache whenever mailboxes change
  useEffect(() => {
    if (mailboxes.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(mailboxes));
      console.log('Cached mailboxes:', mailboxes.length);
    }
  }, [mailboxes]);

  const fetchMailboxes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Fetching mailboxes from database...');
      
      const { data, error } = await supabase
        .from('mailboxes')
        .select(`
          *,
          current_customer:customers!mailboxes_current_customer_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order('number', { ascending: true });

      if (error) throw error;

      // Get package counts separately for each mailbox
      const mailboxesWithCounts = await Promise.all((data || []).map(async (mailbox) => {
        if (mailbox.current_customer_id) {
          const { data: packages } = await supabase
            .from('packages')
            .select('id, status')
            .eq('customer_id', mailbox.current_customer_id);
          
          return {
            ...mailbox,
            package_count: packages?.filter(
              (pkg) => pkg.status === 'Received' || pkg.status === 'Ready'
            ).length || 0
          };
        }
        return {
          ...mailbox,
          package_count: 0
        };
      }));

      console.log('Fetched mailboxes:', mailboxesWithCounts.length);
      setMailboxes(mailboxesWithCounts);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching mailboxes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch mailboxes');
    } finally {
      setLoading(false);
    }
  };

  const assignMailbox = async (
    mailboxId: string,
    customerId: string,
    paymentFrequency: 'monthly' | 'annual',
    startDate: Date
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const mailbox = mailboxes.find(m => m.id === mailboxId);
      if (!mailbox) return { success: false, error: 'Mailbox not found' };

      const endDate = new Date(startDate);
      if (paymentFrequency === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const nextPaymentDue = new Date(startDate);
      if (paymentFrequency === 'monthly') {
        nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);
      } else {
        nextPaymentDue.setFullYear(nextPaymentDue.getFullYear() + 1);
      }

      // Update mailbox
      const { error: updateError } = await supabase
        .from('mailboxes')
        .update({
          status: 'occupied',
          current_customer_id: customerId,
          rental_start_date: startDate.toISOString().split('T')[0],
          rental_end_date: endDate.toISOString().split('T')[0],
          next_payment_due: nextPaymentDue.toISOString().split('T')[0],
          payment_status: 'current',
          updated_by: user.id
        })
        .eq('id', mailboxId);

      if (updateError) throw updateError;

      // Create rental history record
      const { error: historyError } = await supabase
        .from('mailbox_rental_history')
        .insert({
          mailbox_id: mailboxId,
          customer_id: customerId,
          start_date: startDate.toISOString().split('T')[0],
          monthly_rate: mailbox.monthly_rate,
          annual_rate: mailbox.annual_rate,
          payment_frequency: paymentFrequency,
          created_by: user.id
        });

      if (historyError) throw historyError;

      await fetchMailboxes();
      return { success: true };
      
    } catch (err) {
      console.error('Error assigning mailbox:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to assign mailbox' 
      };
    }
  };

  const terminateRental = async (
    mailboxId: string,
    reason: string,
    endDate: Date
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Update mailbox
      const { error: updateError } = await supabase
        .from('mailboxes')
        .update({
          status: 'available',
          current_customer_id: null,
          rental_start_date: null,
          rental_end_date: null,
          next_payment_due: null,
          payment_status: 'current',
          updated_by: user.id
        })
        .eq('id', mailboxId);

      if (updateError) throw updateError;

      // Update rental history
      const { error: historyError } = await supabase
        .from('mailbox_rental_history')
        .update({
          end_date: endDate.toISOString().split('T')[0],
          termination_reason: reason
        })
        .eq('mailbox_id', mailboxId)
        .is('end_date', null);

      if (historyError) throw historyError;

      await fetchMailboxes();
      return { success: true };
      
    } catch (err) {
      console.error('Error terminating rental:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to terminate rental' 
      };
    }
  };

  const updateMailboxStatus = async (
    mailboxId: string,
    status: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('mailboxes')
        .update({
          status,
          notes,
          updated_by: user.id
        })
        .eq('id', mailboxId);

      if (error) throw error;

      await fetchMailboxes();
      return { success: true };
      
    } catch (err) {
      console.error('Error updating mailbox status:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update mailbox' 
      };
    }
  };

  const getMailboxStats = (): MailboxStats => {
    const stats = {
      total: mailboxes.length,
      available: 0,
      occupied: 0,
      maintenance: 0,
      expiring: 0,
      overdue: 0
    };

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    mailboxes.forEach(mailbox => {
      switch (mailbox.status) {
        case 'available':
          stats.available++;
          break;
        case 'occupied':
          stats.occupied++;
          if (mailbox.rental_end_date) {
            const endDate = new Date(mailbox.rental_end_date);
            if (endDate < today) {
              stats.overdue++;
            } else if (endDate < thirtyDaysFromNow) {
              stats.expiring++;
            }
          }
          break;
        case 'maintenance':
          stats.maintenance++;
          break;
      }
    });

    return stats;
  };

  const searchMailboxes = (searchTerm: string): Mailbox[] => {
    if (!searchTerm.trim()) return mailboxes;
    
    const term = searchTerm.toLowerCase();
    return mailboxes.filter(mailbox => 
      mailbox.number.toLowerCase().includes(term) ||
      (mailbox.current_customer?.first_name?.toLowerCase().includes(term)) ||
      (mailbox.current_customer?.last_name?.toLowerCase().includes(term)) ||
      (mailbox.current_customer?.email?.toLowerCase().includes(term))
    );
  };

  const filterBySize = (size: string): Mailbox[] => {
    if (size === 'all') return mailboxes;
    return mailboxes.filter(mailbox => mailbox.size === size);
  };

  const filterByStatus = (status: string): Mailbox[] => {
    if (status === 'all') return mailboxes;
    return mailboxes.filter(mailbox => mailbox.status === status);
  };

  useEffect(() => {
    fetchMailboxes();
  }, [user]);

  // Set up real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('mailboxes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mailboxes'
        },
        (payload) => {
          console.log('Mailbox change received:', payload);
          fetchMailboxes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    mailboxes,
    loading,
    error,
    assignMailbox,
    terminateRental,
    updateMailboxStatus,
    getMailboxStats,
    searchMailboxes,
    filterBySize,
    filterByStatus,
    refetch: fetchMailboxes
  };
}