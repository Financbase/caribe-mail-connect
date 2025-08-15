/**
 * Enhanced Package Management Types
 * Story 1.4: Advanced Package Management
 * 
 * Comprehensive package tracking, automation, and customer experience
 * with real-time updates, intelligent workflows, and subscription context
 */

import type { EnhancedCustomer } from './customer';

// =====================================================
// PACKAGE CORE TYPES
// =====================================================

export type PackageStatus = 
  | 'received'           // Package arrived at facility
  | 'processing'         // Being sorted/processed
  | 'ready_for_pickup'   // Ready for customer pickup
  | 'ready_for_delivery' // Ready for delivery
  | 'out_for_delivery'   // On delivery route
  | 'delivered'          // Successfully delivered
  | 'pickup_completed'   // Customer picked up
  | 'failed_delivery'    // Delivery attempt failed
  | 'returned_to_sender' // Returned to sender
  | 'held'               // On hold (payment, customs, etc.)
  | 'damaged'            // Package damaged
  | 'lost'               // Package lost
  | 'archived';          // Archived/completed

export type PackageSize = 'envelope' | 'small' | 'medium' | 'large' | 'oversized';

export type PackageCarrier = 'ups' | 'fedex' | 'usps' | 'dhl' | 'amazon' | 'local' | 'other';

export type PackagePriority = 'standard' | 'expedited' | 'urgent' | 'same_day';

export type PackageType = 'package' | 'envelope' | 'document' | 'fragile' | 'perishable' | 'hazardous' | 'valuable';

// =====================================================
// ENHANCED PACKAGE INTERFACE
// =====================================================

export interface EnhancedPackage {
  id: string;
  subscription_id: string;
  customer_id: string;
  
  // Basic package information
  tracking_number: string;
  carrier: PackageCarrier;
  carrier_service?: string; // e.g., "UPS Ground", "FedEx Express"
  status: PackageStatus;
  type: PackageType;
  size: PackageSize;
  priority: PackagePriority;
  
  // Physical attributes
  weight?: number; // in pounds
  dimensions?: PackageDimensions;
  declared_value?: number;
  
  // Sender information
  sender_name?: string;
  sender_address?: PackageAddress;
  sender_phone?: string;
  sender_email?: string;
  
  // Recipient information (customer)
  recipient_name: string;
  recipient_address?: PackageAddress;
  recipient_phone?: string;
  recipient_email?: string;
  
  // Delivery preferences
  delivery_instructions?: string;
  requires_signature: boolean;
  requires_id_verification: boolean;
  delivery_window_start?: string; // HH:MM format
  delivery_window_end?: string; // HH:MM format
  preferred_delivery_date?: string;
  
  // Special handling
  special_handling: boolean;
  special_handling_notes?: string;
  fragile: boolean;
  perishable: boolean;
  hazardous: boolean;
  high_value: boolean;
  
  // Storage and location
  storage_location?: string;
  shelf_location?: string;
  bin_number?: string;
  location_id?: string;
  
  // Timestamps
  received_at: string;
  processed_at?: string;
  ready_at?: string;
  out_for_delivery_at?: string;
  delivered_at?: string;
  pickup_at?: string;
  
  // Staff tracking
  received_by?: string;
  processed_by?: string;
  delivered_by?: string;
  
  // Customer interaction
  customer_notified: boolean;
  notification_count: number;
  last_notification_at?: string;
  customer_viewed: boolean;
  customer_viewed_at?: string;
  
  // Photos and documentation
  photos: PackagePhoto[];
  documents: PackageDocument[];
  
  // Tracking and events
  tracking_events: PackageTrackingEvent[];
  
  // Delivery information
  delivery_info?: PackageDelivery;
  
  // Billing and costs
  storage_fee?: number;
  handling_fee?: number;
  delivery_fee?: number;
  total_fees?: number;
  
  // Automation and workflows
  automation_rules_applied: string[];
  workflow_status?: string;
  
  // Analytics and metrics
  processing_time_minutes?: number;
  storage_days?: number;
  customer_satisfaction_rating?: number;
  
  // Notes and comments
  internal_notes?: string;
  customer_notes?: string;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// =====================================================
// SUPPORTING TYPES
// =====================================================

export interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'inches' | 'cm';
}

export interface PackageAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PackagePhoto {
  id: string;
  package_id: string;
  url: string;
  thumbnail_url?: string;
  type: 'arrival' | 'condition' | 'damage' | 'delivery_proof' | 'signature';
  description?: string;
  taken_at: string;
  taken_by?: string;
  metadata?: {
    camera_info?: string;
    location?: string;
    file_size?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface PackageDocument {
  id: string;
  package_id: string;
  type: 'invoice' | 'customs_form' | 'delivery_receipt' | 'damage_report' | 'other';
  name: string;
  url: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
  uploaded_by?: string;
}

export interface PackageTrackingEvent {
  id: string;
  package_id: string;
  event_type: PackageEventType;
  status: PackageStatus;
  description: string;
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  created_by?: string;
  metadata?: Record<string, any>;
}

export type PackageEventType = 
  | 'received'
  | 'processed'
  | 'sorted'
  | 'ready'
  | 'notification_sent'
  | 'out_for_delivery'
  | 'delivery_attempted'
  | 'delivered'
  | 'picked_up'
  | 'returned'
  | 'damaged'
  | 'lost'
  | 'held'
  | 'released'
  | 'archived'
  | 'customer_contacted'
  | 'fee_applied'
  | 'payment_received';

export interface PackageDelivery {
  id: string;
  package_id: string;
  delivery_type: 'pickup' | 'home_delivery' | 'office_delivery';
  
  // Address information
  delivery_address?: PackageAddress;
  
  // Scheduling
  scheduled_date?: string;
  scheduled_time_start?: string;
  scheduled_time_end?: string;
  estimated_arrival?: string;
  actual_arrival?: string;
  
  // Delivery details
  delivery_status: 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  delivery_method: 'standard' | 'express' | 'same_day' | 'scheduled';
  
  // Driver and route information
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  route_id?: string;
  vehicle_info?: string;
  
  // Delivery proof
  signature_required: boolean;
  signature_captured?: string; // Base64 signature
  photo_proof?: string; // URL to delivery photo
  recipient_name?: string;
  recipient_relationship?: string; // 'self' | 'family' | 'neighbor' | 'business'
  
  // Delivery attempts
  attempt_count: number;
  max_attempts: number;
  failed_attempts: PackageDeliveryAttempt[];
  
  // Special instructions
  delivery_instructions?: string;
  access_codes?: string;
  special_requirements?: string[];
  
  // Costs and billing
  delivery_fee: number;
  tip_amount?: number;
  total_cost: number;
  
  // Customer communication
  customer_notified: boolean;
  tracking_url?: string;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface PackageDeliveryAttempt {
  attempt_number: number;
  attempted_at: string;
  failure_reason: string;
  notes?: string;
  next_attempt_scheduled?: string;
}

// =====================================================
// PACKAGE AUTOMATION TYPES
// =====================================================

export interface PackageAutomationRule {
  id: string;
  subscription_id: string;
  name: string;
  description?: string;
  
  // Rule configuration
  trigger_conditions: PackageRuleTrigger[];
  actions: PackageRuleAction[];
  
  // Rule settings
  is_active: boolean;
  priority: number;
  max_executions_per_package?: number;
  
  // Analytics
  execution_count: number;
  success_count: number;
  failure_count: number;
  last_executed_at?: string;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

export interface PackageRuleTrigger {
  field: string; // e.g., 'status', 'carrier', 'size', 'days_in_storage'
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface PackageRuleAction {
  type: 'send_notification' | 'update_status' | 'assign_delivery' | 'apply_fee' | 'create_task' | 'send_communication';
  configuration: Record<string, any>;
}

// =====================================================
// PACKAGE ANALYTICS TYPES
// =====================================================

export interface PackageAnalytics {
  subscription_id: string;
  period_start: string;
  period_end: string;
  
  // Volume metrics
  total_packages: number;
  packages_by_status: Record<PackageStatus, number>;
  packages_by_carrier: Record<PackageCarrier, number>;
  packages_by_size: Record<PackageSize, number>;
  packages_by_type: Record<PackageType, number>;
  
  // Performance metrics
  average_processing_time_hours: number;
  average_storage_days: number;
  delivery_success_rate: number;
  pickup_rate: number;
  
  // Customer metrics
  unique_customers: number;
  repeat_customers: number;
  customer_satisfaction_average: number;
  
  // Financial metrics
  total_revenue: number;
  storage_fees: number;
  handling_fees: number;
  delivery_fees: number;
  
  // Operational metrics
  peak_receiving_hour: number;
  peak_delivery_hour: number;
  busiest_day_of_week: string;
  
  computed_at: string;
}

// =====================================================
// API TYPES
// =====================================================

export interface CreatePackageRequest {
  tracking_number: string;
  carrier: PackageCarrier;
  customer_id: string;
  size: PackageSize;
  type?: PackageType;
  priority?: PackagePriority;
  weight?: number;
  dimensions?: PackageDimensions;
  sender_name?: string;
  sender_address?: PackageAddress;
  special_handling?: boolean;
  special_handling_notes?: string;
  requires_signature?: boolean;
  delivery_instructions?: string;
  photos?: File[];
  internal_notes?: string;
}

export interface UpdatePackageRequest {
  status?: PackageStatus;
  storage_location?: string;
  delivery_instructions?: string;
  internal_notes?: string;
  customer_notes?: string;
  photos?: File[];
}

export interface PackageSearchFilters {
  status?: PackageStatus[];
  carrier?: PackageCarrier[];
  customer_id?: string;
  tracking_number?: string;
  date_range?: {
    start: string;
    end: string;
  };
  size?: PackageSize[];
  priority?: PackagePriority[];
  has_special_handling?: boolean;
  location_id?: string;
}

export interface PackageListResponse {
  packages: EnhancedPackage[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
  filters_applied: PackageSearchFilters;
}

export interface PackageStatsResponse {
  total_packages: number;
  packages_today: number;
  ready_for_pickup: number;
  ready_for_delivery: number;
  in_storage: number;
  average_processing_time: number;
  customer_satisfaction: number;
}
