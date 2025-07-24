import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { Database } from '@/integrations/supabase/types';

type VirtualMailbox = Database['public']['Tables']['virtual_mailboxes']['Row'];
type MailPiece = Database['public']['Tables']['mail_pieces']['Row'];
type MailAction = Database['public']['Tables']['mail_actions']['Row'];
type ScanningQueueItem = Database['public']['Tables']['scanning_queue']['Row'];
type CheckDeposit = Database['public']['Tables']['check_deposits']['Row'];
type VirtualMailboxPricing = Database['public']['Tables']['virtual_mailbox_pricing']['Row'];

type VirtualMailboxInsert = Database['public']['Tables']['virtual_mailboxes']['Insert'];
type MailPieceInsert = Database['public']['Tables']['mail_pieces']['Insert'];
type MailActionInsert = Database['public']['Tables']['mail_actions']['Insert'];
type CheckDepositInsert = Database['public']['Tables']['check_deposits']['Insert'];

export function useVirtualMailbox() {
  const [loading, setLoading] = useState(false);
  const [virtualMailboxes, setVirtualMailboxes] = useState<VirtualMailbox[]>([]);
  const [mailPieces, setMailPieces] = useState<MailPiece[]>([]);
  const [mailActions, setMailActions] = useState<MailAction[]>([]);
  const [scanningQueue, setScanningQueue] = useState<ScanningQueueItem[]>([]);
  const [checkDeposits, setCheckDeposits] = useState<CheckDeposit[]>([]);
  const [pricing, setPricing] = useState<VirtualMailboxPricing[]>([]);
  const { toast } = useToast();

  // Fetch virtual mailboxes
  const fetchVirtualMailboxes = async (locationId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('virtual_mailboxes').select('*');
      
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setVirtualMailboxes(data || []);
    } catch (error: any) {
      console.error('Error fetching virtual mailboxes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load virtual mailboxes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch mail pieces
  const fetchMailPieces = async (virtualMailboxId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('mail_pieces').select('*');
      
      if (virtualMailboxId) {
        query = query.eq('virtual_mailbox_id', virtualMailboxId);
      }
      
      const { data, error } = await query.order('received_date', { ascending: false });
      
      if (error) throw error;
      setMailPieces(data || []);
    } catch (error: any) {
      console.error('Error fetching mail pieces:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mail pieces',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create virtual mailbox
  const createVirtualMailbox = async (mailboxData: VirtualMailboxInsert) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('virtual_mailboxes')
        .insert(mailboxData)
        .select()
        .single();

      if (error) throw error;
      
      setVirtualMailboxes(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Virtual mailbox created successfully',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating virtual mailbox:', error);
      toast({
        title: 'Error',
        description: 'Failed to create virtual mailbox',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add mail piece
  const addMailPiece = async (pieceData: Omit<MailPieceInsert, 'piece_number'>) => {
    try {
      setLoading(true);
      
      // Generate piece number
      const pieceNumber = await generateMailPieceNumber(pieceData.virtual_mailbox_id);
      
      const { data, error } = await supabase
        .from('mail_pieces')
        .insert({ ...pieceData, piece_number: pieceNumber })
        .select()
        .single();

      if (error) throw error;
      
      setMailPieces(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Mail piece added successfully',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding mail piece:', error);
      toast({
        title: 'Error',
        description: 'Failed to add mail piece',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create mail action
  const createMailAction = async (actionData: MailActionInsert) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mail_actions')
        .insert(actionData)
        .select()
        .single();

      if (error) throw error;
      
      setMailActions(prev => [data, ...prev]);
      
      // If it's a scan action, add to scanning queue
      if (actionData.action_type === 'scan') {
        await addToScanningQueue(data.id, data.mail_piece_id);
      }
      
      toast({
        title: 'Success',
        description: 'Mail action created successfully',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating mail action:', error);
      toast({
        title: 'Error',
        description: 'Failed to create mail action',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add to scanning queue
  const addToScanningQueue = async (mailActionId: string, mailPieceId: string) => {
    try {
      const { data, error } = await supabase
        .from('scanning_queue')
        .insert({
          mail_action_id: mailActionId,
          mail_piece_id: mailPieceId,
          status: 'queued'
        })
        .select()
        .single();

      if (error) throw error;
      setScanningQueue(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Error adding to scanning queue:', error);
      throw error;
    }
  };

  // Create check deposit
  const createCheckDeposit = async (depositData: CheckDepositInsert) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('check_deposits')
        .insert(depositData)
        .select()
        .single();

      if (error) throw error;
      
      setCheckDeposits(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Check deposit captured successfully',
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating check deposit:', error);
      toast({
        title: 'Error',
        description: 'Failed to create check deposit',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch pricing
  const fetchPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('virtual_mailbox_pricing')
        .select('*')
        .eq('is_active', true)
        .order('service_tier');

      if (error) throw error;
      setPricing(data || []);
    } catch (error: any) {
      console.error('Error fetching pricing:', error);
    }
  };

  // Calculate action cost
  const calculateActionCost = (actionType: string, serviceTier: string, additionalData?: any) => {
    const tierPricing = pricing.find(p => p.service_tier === serviceTier);
    if (!tierPricing) return 0;

    switch (actionType) {
      case 'scan':
        const pages = additionalData?.pages || 1;
        return tierPricing.scan_fee_per_page * pages;
      case 'forward':
        const weight = additionalData?.weight || 1;
        return tierPricing.forward_fee_base + (tierPricing.forward_fee_per_ounce * weight);
      case 'shred':
        return tierPricing.shred_fee;
      case 'check_deposit':
        return tierPricing.check_deposit_fee;
      default:
        return 0;
    }
  };

  // Generate piece number using database function
  const generateMailPieceNumber = async (virtualMailboxId: string): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_mail_piece_number', {
      vm_id: virtualMailboxId
    });
    
    if (error) throw error;
    return data;
  };

  // Update mail piece status
  const updateMailPieceStatus = async (pieceId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('mail_pieces')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', pieceId);

      if (error) throw error;
      
      // Update local state
      setMailPieces(prev => 
        prev.map(piece => 
          piece.id === pieceId 
            ? { ...piece, status, updated_at: new Date().toISOString() }
            : piece
        )
      );
    } catch (error: any) {
      console.error('Error updating mail piece status:', error);
      throw error;
    }
  };

  return {
    loading,
    virtualMailboxes,
    mailPieces,
    mailActions,
    scanningQueue,
    checkDeposits,
    pricing,
    fetchVirtualMailboxes,
    fetchMailPieces,
    createVirtualMailbox,
    addMailPiece,
    createMailAction,
    createCheckDeposit,
    fetchPricing,
    calculateActionCost,
    updateMailPieceStatus,
  };
}

export type {
  VirtualMailbox,
  MailPiece,
  MailAction,
  ScanningQueueItem,
  CheckDeposit,
  VirtualMailboxPricing,
};