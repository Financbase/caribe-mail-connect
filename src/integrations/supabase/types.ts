export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      act_60_compliance: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string
          document_type: string
          document_url: string | null
          expiration_date: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string | null
          updated_by: string | null
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          document_type: string
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          document_type?: string
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
          updated_by?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "act_60_compliance_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          id: string
          notes: string | null
          performed_by: string | null
          performed_by_name: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          performed_by?: string | null
          performed_by_name?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          id?: string
          notes?: string | null
          performed_by?: string | null
          performed_by_name?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      customer_compliance: {
        Row: {
          compliance_score: number | null
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          id_verification_status: string
          last_reviewed_at: string | null
          next_review_due: string | null
          notes: string | null
          ps_form_1583_status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          compliance_score?: number | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          id_verification_status?: string
          last_reviewed_at?: string | null
          next_review_due?: string | null
          notes?: string | null
          ps_form_1583_status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          compliance_score?: number | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          id_verification_status?: string
          last_reviewed_at?: string | null
          next_review_due?: string | null
          notes?: string | null
          ps_form_1583_status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_compliance_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          act_60_decree_number: string | null
          act_60_expiration_date: string | null
          act_60_status: boolean | null
          address_line1: string
          address_line2: string | null
          business_name: string | null
          city: string
          country: string
          created_at: string
          created_by: string | null
          customer_type: string
          dedicated_support_contact: string | null
          email: string
          express_handling: boolean | null
          first_name: string
          id: string
          last_name: string
          location_id: string | null
          mailbox_number: string
          notes: string | null
          phone: string | null
          priority_notification: boolean | null
          special_pricing_tier: string | null
          state: string
          status: string
          updated_at: string
          updated_by: string | null
          user_id: string | null
          vip_handling_preferences: Json | null
          zip_code: string
        }
        Insert: {
          act_60_decree_number?: string | null
          act_60_expiration_date?: string | null
          act_60_status?: boolean | null
          address_line1: string
          address_line2?: string | null
          business_name?: string | null
          city: string
          country?: string
          created_at?: string
          created_by?: string | null
          customer_type?: string
          dedicated_support_contact?: string | null
          email: string
          express_handling?: boolean | null
          first_name: string
          id?: string
          last_name: string
          location_id?: string | null
          mailbox_number: string
          notes?: string | null
          phone?: string | null
          priority_notification?: boolean | null
          special_pricing_tier?: string | null
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          vip_handling_preferences?: Json | null
          zip_code: string
        }
        Update: {
          act_60_decree_number?: string | null
          act_60_expiration_date?: string | null
          act_60_status?: boolean | null
          address_line1?: string
          address_line2?: string | null
          business_name?: string | null
          city?: string
          country?: string
          created_at?: string
          created_by?: string | null
          customer_type?: string
          dedicated_support_contact?: string | null
          email?: string
          express_handling?: boolean | null
          first_name?: string
          id?: string
          last_name?: string
          location_id?: string | null
          mailbox_number?: string
          notes?: string | null
          phone?: string | null
          priority_notification?: boolean | null
          special_pricing_tier?: string | null
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          vip_handling_preferences?: Json | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          actual_delivery_time: string | null
          address_line1: string
          address_line2: string | null
          attempt_count: number | null
          city: string
          coordinates: unknown | null
          created_at: string
          created_by: string | null
          customer_id: string
          delivery_notes: string | null
          delivery_proof: Json | null
          delivery_window_end: string | null
          delivery_window_start: string | null
          estimated_delivery_time: string | null
          id: string
          package_id: string
          priority: number | null
          route_id: string | null
          special_instructions: string | null
          state: string
          status: string
          updated_at: string
          updated_by: string | null
          zip_code: string
          zone: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          address_line1: string
          address_line2?: string | null
          attempt_count?: number | null
          city: string
          coordinates?: unknown | null
          created_at?: string
          created_by?: string | null
          customer_id: string
          delivery_notes?: string | null
          delivery_proof?: Json | null
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          estimated_delivery_time?: string | null
          id?: string
          package_id: string
          priority?: number | null
          route_id?: string | null
          special_instructions?: string | null
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          zip_code: string
          zone?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          address_line1?: string
          address_line2?: string | null
          attempt_count?: number | null
          city?: string
          coordinates?: unknown | null
          created_at?: string
          created_by?: string | null
          customer_id?: string
          delivery_notes?: string | null
          delivery_proof?: Json | null
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          estimated_delivery_time?: string | null
          id?: string
          package_id?: string
          priority?: number | null
          route_id?: string | null
          special_instructions?: string | null
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          zip_code?: string
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "delivery_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_attempts: {
        Row: {
          attempt_number: number
          attempted_at: string
          created_at: string
          delivery_id: string
          driver_id: string | null
          failure_reason: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          attempt_number: number
          attempted_at?: string
          created_at?: string
          delivery_id: string
          driver_id?: string | null
          failure_reason?: string | null
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          attempt_number?: number
          attempted_at?: string
          created_at?: string
          delivery_id?: string
          driver_id?: string | null
          failure_reason?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_attempts_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_routes: {
        Row: {
          actual_duration: number | null
          completed_stops: number | null
          created_at: string
          created_by: string | null
          date: string
          driver_id: string | null
          estimated_duration: number | null
          id: string
          location_id: string | null
          name: string
          route_order: Json | null
          status: string
          total_stops: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          actual_duration?: number | null
          completed_stops?: number | null
          created_at?: string
          created_by?: string | null
          date: string
          driver_id?: string | null
          estimated_duration?: number | null
          id?: string
          location_id?: string | null
          name: string
          route_order?: Json | null
          status?: string
          total_stops?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          actual_duration?: number | null
          completed_stops?: number | null
          created_at?: string
          created_by?: string | null
          date?: string
          driver_id?: string | null
          estimated_duration?: number | null
          id?: string
          location_id?: string | null
          name?: string
          route_order?: Json | null
          status?: string
          total_stops?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_routes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_assignments: {
        Row: {
          created_at: string
          id: string
          license_number: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_type: string | null
          zone_assignments: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          license_number?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_type?: string | null
          zone_assignments?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          license_number?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string | null
          zone_assignments?: string[] | null
        }
        Relationships: []
      }
      location_staff: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_primary: boolean | null
          location_id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_primary?: boolean | null
          location_id: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_primary?: boolean | null
          location_id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_staff_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          code: string
          coordinates: unknown | null
          country: string
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          notes: string | null
          operating_hours: Json | null
          phone: string | null
          pricing_tier: string | null
          services_offered: string[] | null
          state: string
          status: string
          timezone: string | null
          updated_at: string
          updated_by: string | null
          zip_code: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          code: string
          coordinates?: unknown | null
          country?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          notes?: string | null
          operating_hours?: Json | null
          phone?: string | null
          pricing_tier?: string | null
          services_offered?: string[] | null
          state?: string
          status?: string
          timezone?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          code?: string
          coordinates?: unknown | null
          country?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          notes?: string | null
          operating_hours?: Json | null
          phone?: string | null
          pricing_tier?: string | null
          services_offered?: string[] | null
          state?: string
          status?: string
          timezone?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      mailbox_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          mailbox_id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          period_end: string
          period_start: string
          reference_number: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          mailbox_id: string
          notes?: string | null
          payment_date: string
          payment_method?: string | null
          period_end: string
          period_start: string
          reference_number?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          mailbox_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          period_end?: string
          period_start?: string
          reference_number?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mailbox_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mailbox_payments_mailbox_id_fkey"
            columns: ["mailbox_id"]
            isOneToOne: false
            referencedRelation: "mailboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      mailbox_rental_history: {
        Row: {
          annual_rate: number
          created_at: string
          created_by: string | null
          customer_id: string
          end_date: string | null
          id: string
          mailbox_id: string
          monthly_rate: number
          notes: string | null
          payment_frequency: string
          start_date: string
          termination_reason: string | null
        }
        Insert: {
          annual_rate: number
          created_at?: string
          created_by?: string | null
          customer_id: string
          end_date?: string | null
          id?: string
          mailbox_id: string
          monthly_rate: number
          notes?: string | null
          payment_frequency: string
          start_date: string
          termination_reason?: string | null
        }
        Update: {
          annual_rate?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string
          end_date?: string | null
          id?: string
          mailbox_id?: string
          monthly_rate?: number
          notes?: string | null
          payment_frequency?: string
          start_date?: string
          termination_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mailbox_rental_history_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mailbox_rental_history_mailbox_id_fkey"
            columns: ["mailbox_id"]
            isOneToOne: false
            referencedRelation: "mailboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      mailboxes: {
        Row: {
          annual_rate: number
          created_at: string
          created_by: string | null
          current_customer_id: string | null
          id: string
          location_id: string | null
          monthly_rate: number
          next_payment_due: string | null
          notes: string | null
          number: string
          payment_status: string | null
          rental_end_date: string | null
          rental_start_date: string | null
          size: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          annual_rate: number
          created_at?: string
          created_by?: string | null
          current_customer_id?: string | null
          id?: string
          location_id?: string | null
          monthly_rate: number
          next_payment_due?: string | null
          notes?: string | null
          number: string
          payment_status?: string | null
          rental_end_date?: string | null
          rental_start_date?: string | null
          size: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          annual_rate?: number
          created_at?: string
          created_by?: string | null
          current_customer_id?: string | null
          id?: string
          location_id?: string | null
          monthly_rate?: number
          next_payment_due?: string | null
          notes?: string | null
          number?: string
          payment_status?: string | null
          rental_end_date?: string | null
          rental_start_date?: string | null
          size?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mailboxes_current_customer_id_fkey"
            columns: ["current_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mailboxes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channels: Json
          created_at: string
          created_by: string | null
          customer_id: string
          delivered_at: string | null
          id: string
          message: string
          package_id: string | null
          read_at: string | null
          sent_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          channels?: Json
          created_at?: string
          created_by?: string | null
          customer_id: string
          delivered_at?: string | null
          id?: string
          message: string
          package_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          channels?: Json
          created_at?: string
          created_by?: string | null
          customer_id?: string
          delivered_at?: string | null
          id?: string
          message?: string
          package_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_transfers: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          from_location_id: string
          id: string
          initiated_at: string | null
          initiated_by: string | null
          notes: string | null
          package_id: string
          status: string
          to_location_id: string
          tracking_number: string | null
          transfer_reason: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          from_location_id: string
          id?: string
          initiated_at?: string | null
          initiated_by?: string | null
          notes?: string | null
          package_id: string
          status?: string
          to_location_id: string
          tracking_number?: string | null
          transfer_reason: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          from_location_id?: string
          id?: string
          initiated_at?: string | null
          initiated_by?: string | null
          notes?: string | null
          package_id?: string
          status?: string
          to_location_id?: string
          tracking_number?: string | null
          transfer_reason?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_transfers_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_transfers_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_transfers_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          carrier: string
          created_at: string
          customer_id: string
          customer_name: string
          delivered_at: string | null
          delivered_by: string | null
          dimensions: string | null
          id: string
          location_id: string | null
          notes: string | null
          received_at: string
          received_by: string | null
          requires_signature: boolean
          size: string
          special_handling: boolean
          status: string
          tracking_number: string
          updated_at: string
          weight: string | null
        }
        Insert: {
          carrier: string
          created_at?: string
          customer_id: string
          customer_name: string
          delivered_at?: string | null
          delivered_by?: string | null
          dimensions?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          received_at?: string
          received_by?: string | null
          requires_signature?: boolean
          size: string
          special_handling?: boolean
          status?: string
          tracking_number: string
          updated_at?: string
          weight?: string | null
        }
        Update: {
          carrier?: string
          created_at?: string
          customer_id?: string
          customer_name?: string
          delivered_at?: string | null
          delivered_by?: string | null
          dimensions?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          received_at?: string
          received_by?: string | null
          requires_signature?: boolean
          size?: string
          special_handling?: boolean
          status?: string
          tracking_number?: string
          updated_at?: string
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          preferred_language: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          created_at: string
          created_by: string | null
          department: string | null
          employee_id: string | null
          hire_date: string | null
          id: string
          permissions: Json | null
          position: string | null
          profile_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          permissions?: Json | null
          position?: string | null
          profile_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          permissions?: Json | null
          position?: string | null
          profile_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      virtual_mailbox: {
        Row: {
          action_date: string | null
          action_taken: string | null
          created_at: string | null
          customer_id: string
          forwarding_address: string | null
          id: string
          mail_item_id: string
          mail_type: string
          notes: string | null
          received_date: string | null
          scan_requested: boolean | null
          scan_url: string | null
          sender_address: string | null
          sender_name: string | null
          updated_at: string | null
        }
        Insert: {
          action_date?: string | null
          action_taken?: string | null
          created_at?: string | null
          customer_id: string
          forwarding_address?: string | null
          id?: string
          mail_item_id: string
          mail_type: string
          notes?: string | null
          received_date?: string | null
          scan_requested?: boolean | null
          scan_url?: string | null
          sender_address?: string | null
          sender_name?: string | null
          updated_at?: string | null
        }
        Update: {
          action_date?: string | null
          action_taken?: string | null
          created_at?: string | null
          customer_id?: string
          forwarding_address?: string | null
          id?: string
          mail_item_id?: string
          mail_type?: string
          notes?: string | null
          received_date?: string | null
          scan_requested?: boolean | null
          scan_url?: string | null
          sender_address?: string | null
          sender_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "virtual_mailbox_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_customers_pending_compliance: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          first_name: string
          last_name: string
          email: string
          ps_form_1583_status: string
          id_verification_status: string
          compliance_score: number
        }[]
      }
      get_user_profile: {
        Args: { _user_id?: string }
        Returns: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          full_name: string
          role: string
          preferred_language: string
          phone: string
          avatar_url: string
          email: string
        }[]
      }
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
