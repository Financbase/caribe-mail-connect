// API Types for PRMCMS

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface Package {
  id: string;
  tracking_number: string;
  customer_id: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  carrier: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  is_act60?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mailbox {
  id: string;
  customer_id: string;
  mailbox_number: string;
  plan_type: 'basic' | 'premium' | 'business';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface ComplianceRecord {
  id: string;
  type: 'cmra' | 'usps' | 'pr_regulation';
  status: 'compliant' | 'non_compliant' | 'pending_review';
  description: string;
  due_date?: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'staff' | 'driver';
  location_id?: string;
  status: 'active' | 'inactive' | 'on_leave';
  created_at: string;
  updated_at: string;
}

export interface DeliveryRoute {
  id: string;
  name: string;
  driver_id: string;
  status: 'active' | 'completed' | 'optimizing';
  stops: DeliveryStop[];
  created_at: string;
  updated_at: string;
}

export interface DeliveryStop {
  id: string;
  route_id: string;
  address: string;
  packages: string[];
  status: 'pending' | 'completed' | 'failed';
  eta?: string;
  completed_at?: string;
}

export interface IoTDevice {
  id: string;
  device_id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'gps' | 'scanner';
  location_id?: string;
  status: 'online' | 'offline' | 'error';
  last_reading?: any;
  created_at: string;
  updated_at: string;
}