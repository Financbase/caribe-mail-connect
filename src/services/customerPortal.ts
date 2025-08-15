/**
 * Customer Portal Service
 * Story 3: Customer Portal - Self-Service Customer Portal
 * 
 * Comprehensive customer portal with package tracking, notifications,
 * account management, and self-service capabilities
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// CUSTOMER PORTAL TYPES
// =====================================================

export interface CustomerPortalSession {
  customer_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
  last_activity: string;
  ip_address?: string;
  user_agent?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  preferences: CustomerPreferences;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CustomerPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  communication_frequency: 'immediate' | 'daily' | 'weekly';
  language: string;
  timezone: string;
  delivery_instructions: string;
  special_requirements: string[];
}

export interface PackageTrackingInfo {
  id: string;
  tracking_number: string;
  description: string;
  status: 'pending' | 'in_transit' | 'arrived' | 'delivered' | 'returned';
  weight: number;
  value: number;
  sender_name: string;
  sender_address: string;
  arrived_date?: string;
  delivered_date?: string;
  special_instructions?: string;
  tracking_history: TrackingEvent[];
  estimated_delivery?: string;
  delivery_photos?: string[];
}

export interface TrackingEvent {
  id: string;
  event_type: 'created' | 'in_transit' | 'arrived' | 'out_for_delivery' | 'delivered' | 'exception';
  description: string;
  location: string;
  timestamp: string;
  notes?: string;
}

export interface CustomerNotification {
  id: string;
  customer_id: string;
  type: 'package_arrival' | 'package_delivered' | 'account_update' | 'system_message';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  action_required: boolean;
  action_url?: string;
  created_at: string;
  read_at?: string;
}

export interface CustomerTicket {
  id: string;
  customer_id: string;
  subject: string;
  description: string;
  category: 'package_inquiry' | 'account_issue' | 'billing' | 'technical_support' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'customer' | 'staff';
  sender_name: string;
  message: string;
  attachments: string[];
  created_at: string;
}

// =====================================================
// CUSTOMER PORTAL SERVICE
// =====================================================

export class CustomerPortalService {

  /**
   * Authenticate customer for portal access
   */
  static async authenticateCustomer(
    email: string,
    verificationCode?: string
  ): Promise<CustomerPortalSession | null> {
    try {
      // Find customer by email
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (customerError || !customer) {
        throw new Error('Customer not found');
      }

      // Create portal session
      const session: CustomerPortalSession = {
        customer_id: customer.id,
        session_token: `portal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      };

      const { error: sessionError } = await supabase
        .from('customer_portal_sessions')
        .insert(session);

      if (sessionError) throw sessionError;

      return session;
    } catch (error) {
      console.error('Error authenticating customer:', error);
      return null;
    }
  }

  /**
   * Get customer profile
   */
  static async getCustomerProfile(customerId: string): Promise<CustomerProfile | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) throw error;

      return {
        ...data,
        preferences: data.preferences || {
          notifications: { email: true, sms: false, push: false },
          communication_frequency: 'immediate',
          language: 'en',
          timezone: 'America/New_York',
          delivery_instructions: '',
          special_requirements: []
        }
      };
    } catch (error) {
      console.error('Error getting customer profile:', error);
      return null;
    }
  }

  /**
   * Update customer profile
   */
  static async updateCustomerProfile(
    customerId: string,
    updates: Partial<CustomerProfile>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating customer profile:', error);
      return false;
    }
  }

  /**
   * Get customer packages with tracking info
   */
  static async getCustomerPackages(
    customerId: string,
    status?: string,
    limit: number = 20
  ): Promise<PackageTrackingInfo[]> {
    try {
      let query = supabase
        .from('packages')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Enhance with tracking history
      const packagesWithTracking = await Promise.all(
        (data || []).map(async (pkg) => {
          const trackingHistory = await this.getPackageTrackingHistory(pkg.id);
          return {
            ...pkg,
            tracking_history: trackingHistory,
            estimated_delivery: this.calculateEstimatedDelivery(pkg),
            delivery_photos: await this.getDeliveryPhotos(pkg.id)
          };
        })
      );

      return packagesWithTracking;
    } catch (error) {
      console.error('Error getting customer packages:', error);
      return [];
    }
  }

  /**
   * Get package tracking history
   */
  static async getPackageTrackingHistory(packageId: string): Promise<TrackingEvent[]> {
    try {
      const { data, error } = await supabase
        .from('package_tracking_events')
        .select('*')
        .eq('package_id', packageId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting tracking history:', error);
      return [];
    }
  }

  /**
   * Get customer notifications
   */
  static async getCustomerNotifications(
    customerId: string,
    unreadOnly: boolean = false
  ): Promise<CustomerNotification[]> {
    try {
      let query = supabase
        .from('customer_notifications')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting customer notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Create customer support ticket
   */
  static async createSupportTicket(
    customerId: string,
    ticketData: Partial<CustomerTicket>
  ): Promise<CustomerTicket | null> {
    try {
      const ticket: CustomerTicket = {
        id: `ticket_${Date.now()}`,
        customer_id: customerId,
        subject: ticketData.subject || '',
        description: ticketData.description || '',
        category: ticketData.category || 'general',
        priority: ticketData.priority || 'medium',
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: []
      };

      const { error } = await supabase
        .from('customer_tickets')
        .insert(ticket);

      if (error) throw error;

      // Create initial message
      if (ticket.description) {
        await this.addTicketMessage(ticket.id, {
          sender_type: 'customer',
          sender_name: 'Customer',
          message: ticket.description,
          attachments: []
        });
      }

      return ticket;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      return null;
    }
  }

  /**
   * Add message to support ticket
   */
  static async addTicketMessage(
    ticketId: string,
    messageData: Partial<TicketMessage>
  ): Promise<boolean> {
    try {
      const message: TicketMessage = {
        id: `msg_${Date.now()}`,
        ticket_id: ticketId,
        sender_type: messageData.sender_type || 'customer',
        sender_name: messageData.sender_name || 'Customer',
        message: messageData.message || '',
        attachments: messageData.attachments || [],
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('ticket_messages')
        .insert(message);

      if (error) throw error;

      // Update ticket timestamp
      await supabase
        .from('customer_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      return true;
    } catch (error) {
      console.error('Error adding ticket message:', error);
      return false;
    }
  }

  /**
   * Get customer support tickets
   */
  static async getCustomerTickets(customerId: string): Promise<CustomerTicket[]> {
    try {
      const { data: tickets, error: ticketsError } = await supabase
        .from('customer_tickets')
        .select('*')
        .eq('customer_id', customerId)
        .order('updated_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Get messages for each ticket
      const ticketsWithMessages = await Promise.all(
        (tickets || []).map(async (ticket) => {
          const { data: messages, error: messagesError } = await supabase
            .from('ticket_messages')
            .select('*')
            .eq('ticket_id', ticket.id)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error getting ticket messages:', messagesError);
            return { ...ticket, messages: [] };
          }

          return { ...ticket, messages: messages || [] };
        })
      );

      return ticketsWithMessages;
    } catch (error) {
      console.error('Error getting customer tickets:', error);
      return [];
    }
  }

  /**
   * Get customer portal dashboard data
   */
  static async getCustomerDashboard(customerId: string): Promise<any> {
    try {
      const [packages, notifications, tickets] = await Promise.all([
        this.getCustomerPackages(customerId, undefined, 5),
        this.getCustomerNotifications(customerId, true),
        this.getCustomerTickets(customerId)
      ]);

      const packageStats = {
        total: packages.length,
        pending: packages.filter(p => p.status === 'pending').length,
        in_transit: packages.filter(p => p.status === 'in_transit').length,
        arrived: packages.filter(p => p.status === 'arrived').length,
        delivered: packages.filter(p => p.status === 'delivered').length
      };

      const recentActivity = [
        ...packages.slice(0, 3).map(p => ({
          type: 'package',
          title: `Package ${p.tracking_number}`,
          description: `Status: ${p.status}`,
          timestamp: p.updated_at || p.created_at
        })),
        ...notifications.slice(0, 2).map(n => ({
          type: 'notification',
          title: n.title,
          description: n.message,
          timestamp: n.created_at
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        package_stats: packageStats,
        unread_notifications: notifications.length,
        open_tickets: tickets.filter(t => t.status === 'open').length,
        recent_activity: recentActivity.slice(0, 5),
        quick_actions: [
          { title: 'Track Package', description: 'Enter tracking number', action: 'track_package' },
          { title: 'Contact Support', description: 'Get help with your account', action: 'create_ticket' },
          { title: 'Update Profile', description: 'Manage your information', action: 'update_profile' },
          { title: 'Notification Settings', description: 'Manage preferences', action: 'notification_settings' }
        ]
      };
    } catch (error) {
      console.error('Error getting customer dashboard:', error);
      return null;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static calculateEstimatedDelivery(pkg: any): string | undefined {
    if (pkg.status === 'delivered') return undefined;
    
    // Simple estimation logic - in reality this would be more sophisticated
    const baseDeliveryDays = 2;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + baseDeliveryDays);
    
    return estimatedDate.toISOString();
  }

  private static async getDeliveryPhotos(packageId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('package_delivery_photos')
        .select('photo_url')
        .eq('package_id', packageId);

      if (error) throw error;
      return (data || []).map(photo => photo.photo_url);
    } catch (error) {
      console.error('Error getting delivery photos:', error);
      return [];
    }
  }
}
