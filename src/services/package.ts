/**
 * Enhanced Package Service
 * Story 1.4: Advanced Package Management
 * 
 * Comprehensive package management service with real-time tracking,
 * automation, customer experience, and subscription context
 */

import { supabase } from '@/integrations/supabase/client';
import { CommunicationService } from './communication';
import type { 
  EnhancedPackage,
  PackageStatus,
  PackageTrackingEvent,
  PackageAutomationRule,
  PackageAnalytics,
  CreatePackageRequest,
  UpdatePackageRequest,
  PackageSearchFilters,
  PackageListResponse,
  PackageStatsResponse
} from '@/types/package';
import type { EnhancedCustomer } from '@/types/customer';

// =====================================================
// PACKAGE SERVICE
// =====================================================

export class PackageService {
  
  /**
   * Create a new package with enhanced tracking and automation
   */
  static async createPackage(request: CreatePackageRequest): Promise<{ success: boolean; package?: EnhancedPackage; error?: string }> {
    try {
      // Get customer information
      const customer = await this.getCustomerInfo(request.customer_id);
      if (!customer) {
        return { success: false, error: 'Customer not found' };
      }

      // Create package record
      const packageData = {
        tracking_number: request.tracking_number,
        carrier: request.carrier,
        carrier_service: request.carrier_service,
        customer_id: request.customer_id,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        subscription_id: customer.subscription_id,
        size: request.size,
        package_type: request.type || 'package',
        priority: request.priority || 'standard',
        weight: request.weight,
        dimensions: request.dimensions ? JSON.stringify(request.dimensions) : null,
        sender_name: request.sender_name,
        sender_address: request.sender_address ? JSON.stringify(request.sender_address) : null,
        special_handling: request.special_handling || false,
        special_handling_notes: request.special_handling_notes,
        requires_signature: request.requires_signature || false,
        delivery_instructions: request.delivery_instructions,
        internal_notes: request.internal_notes,
        status: 'received' as PackageStatus,
        customer_notified: false,
        notification_count: 0,
        customer_viewed: false,
        fragile: request.type === 'fragile',
        perishable: request.type === 'perishable',
        hazardous: request.type === 'hazardous',
        high_value: (request.declared_value || 0) > 500,
        declared_value: request.declared_value
      };

      const { data: packageRecord, error } = await supabase
        .from('packages')
        .insert(packageData)
        .select()
        .single();

      if (error) throw error;

      // Create initial tracking event
      await this.createTrackingEvent(packageRecord.id, {
        event_type: 'received',
        status: 'received',
        description: `Package received at facility from ${request.carrier}`,
        location: 'Facility',
        subscription_id: customer.subscription_id!
      });

      // Upload photos if provided
      if (request.photos && request.photos.length > 0) {
        await this.uploadPackagePhotos(packageRecord.id, customer.subscription_id!, request.photos, 'arrival');
      }

      // Apply automation rules
      await this.applyAutomationRules(packageRecord.id, customer.subscription_id!);

      // Send arrival notification
      await this.sendPackageNotification(packageRecord.id, 'package_arrival');

      return { success: true, package: packageRecord as EnhancedPackage };

    } catch (error) {
      console.error('Error creating package:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create package'
      };
    }
  }

  /**
   * Update package status with tracking and notifications
   */
  static async updatePackageStatus(
    packageId: string, 
    status: PackageStatus, 
    notes?: string,
    location?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get current package
      const { data: currentPackage, error: fetchError } = await supabase
        .from('packages')
        .select('*, customers(subscription_id)')
        .eq('id', packageId)
        .single();

      if (fetchError || !currentPackage) {
        return { success: false, error: 'Package not found' };
      }

      // Update package status
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      // Add status-specific timestamps
      switch (status) {
        case 'processing':
          updateData.processed_at = new Date().toISOString();
          break;
        case 'ready_for_pickup':
        case 'ready_for_delivery':
          updateData.ready_at = new Date().toISOString();
          break;
        case 'out_for_delivery':
          updateData.out_for_delivery_at = new Date().toISOString();
          break;
        case 'delivered':
        case 'pickup_completed':
          updateData.delivered_at = new Date().toISOString();
          break;
      }

      // Calculate processing time if moving to ready status
      if ((status === 'ready_for_pickup' || status === 'ready_for_delivery') && currentPackage.received_at) {
        const processingTime = Math.floor(
          (new Date().getTime() - new Date(currentPackage.received_at).getTime()) / (1000 * 60)
        );
        updateData.processing_time_minutes = processingTime;
      }

      // Calculate storage days
      if (currentPackage.received_at) {
        const storageDays = Math.floor(
          (new Date().getTime() - new Date(currentPackage.received_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        updateData.storage_days = storageDays;
      }

      const { error: updateError } = await supabase
        .from('packages')
        .update(updateData)
        .eq('id', packageId);

      if (updateError) throw updateError;

      // Create tracking event
      await this.createTrackingEvent(packageId, {
        event_type: this.getEventTypeFromStatus(status),
        status,
        description: notes || this.getDefaultStatusDescription(status),
        location: location || 'Facility',
        subscription_id: currentPackage.customers.subscription_id
      });

      // Send status notification
      await this.sendStatusNotification(packageId, status);

      // Apply automation rules for status change
      await this.applyAutomationRules(packageId, currentPackage.customers.subscription_id);

      return { success: true };

    } catch (error) {
      console.error('Error updating package status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update package status'
      };
    }
  }

  /**
   * Get packages with advanced filtering and search
   */
  static async getPackages(
    subscriptionId: string,
    filters: PackageSearchFilters = {},
    page: number = 1,
    pageSize: number = 50
  ): Promise<PackageListResponse> {
    try {
      let query = supabase
        .from('packages')
        .select(`
          *,
          customers(first_name, last_name, email, phone, mailbox_number),
          package_photos(id, url, thumbnail_url, type),
          package_tracking_events(id, event_type, status, description, timestamp)
        `)
        .eq('subscription_id', subscriptionId);

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.carrier && filters.carrier.length > 0) {
        query = query.in('carrier', filters.carrier);
      }
      if (filters.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      if (filters.tracking_number) {
        query = query.ilike('tracking_number', `%${filters.tracking_number}%`);
      }
      if (filters.date_range) {
        query = query
          .gte('received_at', filters.date_range.start)
          .lte('received_at', filters.date_range.end);
      }
      if (filters.size && filters.size.length > 0) {
        query = query.in('size', filters.size);
      }
      if (filters.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }
      if (filters.has_special_handling !== undefined) {
        query = query.eq('special_handling', filters.has_special_handling);
      }
      if (filters.location_id) {
        query = query.eq('location_id', filters.location_id);
      }

      // Get total count
      const { count } = await query.select('*', { count: 'exact', head: true });

      // Get paginated results
      const { data: packages, error } = await query
        .order('received_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      return {
        packages: packages || [],
        total_count: count || 0,
        page,
        page_size: pageSize,
        has_more: (count || 0) > page * pageSize,
        filters_applied: filters
      };

    } catch (error) {
      console.error('Error fetching packages:', error);
      return {
        packages: [],
        total_count: 0,
        page,
        page_size: pageSize,
        has_more: false,
        filters_applied: filters
      };
    }
  }

  /**
   * Get package statistics for dashboard
   */
  static async getPackageStats(subscriptionId: string): Promise<PackageStatsResponse> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get basic counts
      const { data: allPackages } = await supabase
        .from('packages')
        .select('status, received_at, processing_time_minutes, customer_satisfaction_rating')
        .eq('subscription_id', subscriptionId);

      if (!allPackages) {
        return {
          total_packages: 0,
          packages_today: 0,
          ready_for_pickup: 0,
          ready_for_delivery: 0,
          in_storage: 0,
          average_processing_time: 0,
          customer_satisfaction: 0
        };
      }

      const totalPackages = allPackages.length;
      const packagesToday = allPackages.filter(p => 
        p.received_at && p.received_at.startsWith(today)
      ).length;

      const readyForPickup = allPackages.filter(p => p.status === 'ready_for_pickup').length;
      const readyForDelivery = allPackages.filter(p => p.status === 'ready_for_delivery').length;
      const inStorage = allPackages.filter(p => 
        ['received', 'processing', 'ready_for_pickup', 'ready_for_delivery'].includes(p.status)
      ).length;

      // Calculate averages
      const processingTimes = allPackages
        .filter(p => p.processing_time_minutes)
        .map(p => p.processing_time_minutes);
      const avgProcessingTime = processingTimes.length > 0 
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
        : 0;

      const satisfactionRatings = allPackages
        .filter(p => p.customer_satisfaction_rating)
        .map(p => p.customer_satisfaction_rating);
      const avgSatisfaction = satisfactionRatings.length > 0
        ? satisfactionRatings.reduce((a, b) => a + b, 0) / satisfactionRatings.length
        : 0;

      return {
        total_packages: totalPackages,
        packages_today: packagesToday,
        ready_for_pickup: readyForPickup,
        ready_for_delivery: readyForDelivery,
        in_storage: inStorage,
        average_processing_time: Math.round(avgProcessingTime),
        customer_satisfaction: Math.round(avgSatisfaction * 10) / 10
      };

    } catch (error) {
      console.error('Error fetching package stats:', error);
      return {
        total_packages: 0,
        packages_today: 0,
        ready_for_pickup: 0,
        ready_for_delivery: 0,
        in_storage: 0,
        average_processing_time: 0,
        customer_satisfaction: 0
      };
    }
  }

  /**
   * Create tracking event for package
   */
  private static async createTrackingEvent(
    packageId: string, 
    eventData: Partial<PackageTrackingEvent>
  ): Promise<void> {
    try {
      await supabase
        .from('package_tracking_events')
        .insert({
          package_id: packageId,
          ...eventData,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error creating tracking event:', error);
    }
  }

  /**
   * Upload package photos
   */
  private static async uploadPackagePhotos(
    packageId: string,
    subscriptionId: string,
    photos: File[],
    type: string
  ): Promise<void> {
    try {
      for (const photo of photos) {
        // Upload to Supabase Storage
        const fileName = `${packageId}/${Date.now()}-${photo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('package-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('package-photos')
          .getPublicUrl(fileName);

        // Save photo record
        await supabase
          .from('package_photos')
          .insert({
            package_id: packageId,
            subscription_id: subscriptionId,
            url: urlData.publicUrl,
            type,
            file_size: photo.size,
            mime_type: photo.type
          });
      }
    } catch (error) {
      console.error('Error uploading package photos:', error);
    }
  }

  /**
   * Apply automation rules to package
   */
  private static async applyAutomationRules(packageId: string, subscriptionId: string): Promise<void> {
    try {
      // Get active automation rules
      const { data: rules } = await supabase
        .from('package_automation_rules')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (!rules || rules.length === 0) return;

      // Get package data for rule evaluation
      const { data: packageData } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .single();

      if (!packageData) return;

      // Apply each rule
      for (const rule of rules) {
        if (this.evaluateRuleConditions(packageData, rule.trigger_conditions)) {
          await this.executeRuleActions(packageId, rule.actions);
          
          // Update rule execution count
          await supabase
            .from('package_automation_rules')
            .update({
              execution_count: rule.execution_count + 1,
              success_count: rule.success_count + 1,
              last_executed_at: new Date().toISOString()
            })
            .eq('id', rule.id);
        }
      }
    } catch (error) {
      console.error('Error applying automation rules:', error);
    }
  }

  /**
   * Send package notification based on status
   */
  private static async sendPackageNotification(packageId: string, type: string): Promise<void> {
    try {
      const { data: packageData } = await supabase
        .from('packages')
        .select('*, customers(*)')
        .eq('id', packageId)
        .single();

      if (!packageData || !packageData.customers) return;

      await CommunicationService.sendCommunication({
        customer_id: packageData.customer_id,
        type: type as any,
        channel: 'email', // Will be intelligently routed
        variables: {
          customer_name: packageData.customer_name,
          tracking_number: packageData.tracking_number,
          carrier: packageData.carrier,
          status: packageData.status
        }
      });

      // Update notification tracking
      await supabase
        .from('packages')
        .update({
          customer_notified: true,
          notification_count: packageData.notification_count + 1,
          last_notification_at: new Date().toISOString()
        })
        .eq('id', packageId);

    } catch (error) {
      console.error('Error sending package notification:', error);
    }
  }

  /**
   * Send status-specific notification
   */
  private static async sendStatusNotification(packageId: string, status: PackageStatus): Promise<void> {
    const notificationMap: Record<PackageStatus, string> = {
      'received': 'package_arrival',
      'ready_for_pickup': 'package_ready',
      'ready_for_delivery': 'package_ready',
      'out_for_delivery': 'package_notification',
      'delivered': 'package_delivered',
      'pickup_completed': 'package_delivered',
      // Add other status mappings as needed
    } as any;

    const notificationType = notificationMap[status];
    if (notificationType) {
      await this.sendPackageNotification(packageId, notificationType);
    }
  }

  /**
   * Get customer information
   */
  private static async getCustomerInfo(customerId: string): Promise<EnhancedCustomer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error || !data) return null;
      return data as EnhancedCustomer;
    } catch (error) {
      console.error('Error fetching customer info:', error);
      return null;
    }
  }

  /**
   * Helper methods for automation and tracking
   */
  private static evaluateRuleConditions(packageData: any, conditions: any[]): boolean {
    // Implement rule condition evaluation logic
    return true; // Simplified for now
  }

  private static async executeRuleActions(packageId: string, actions: any[]): Promise<void> {
    // Implement rule action execution logic
  }

  private static getEventTypeFromStatus(status: PackageStatus): string {
    const eventMap: Record<PackageStatus, string> = {
      'received': 'received',
      'processing': 'processed',
      'ready_for_pickup': 'ready',
      'ready_for_delivery': 'ready',
      'out_for_delivery': 'out_for_delivery',
      'delivered': 'delivered',
      'pickup_completed': 'picked_up'
    } as any;

    return eventMap[status] || 'processed';
  }

  private static getDefaultStatusDescription(status: PackageStatus): string {
    const descriptions: Record<PackageStatus, string> = {
      'received': 'Package received at facility',
      'processing': 'Package being processed',
      'ready_for_pickup': 'Package ready for customer pickup',
      'ready_for_delivery': 'Package ready for delivery',
      'out_for_delivery': 'Package out for delivery',
      'delivered': 'Package successfully delivered',
      'pickup_completed': 'Package picked up by customer'
    } as any;

    return descriptions[status] || 'Package status updated';
  }
}
