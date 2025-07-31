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
      access_control_lists: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          is_active: boolean
          permissions: Json
          resource_id: string
          resource_type: string
          role_name: string | null
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          is_active?: boolean
          permissions?: Json
          resource_id: string
          resource_type: string
          role_name?: string | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
          permissions?: Json
          resource_id?: string
          resource_type?: string
          role_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      account_balances: {
        Row: {
          auto_billing_enabled: boolean | null
          credit_limit: number | null
          current_balance: number
          customer_id: string
          id: string
          last_payment_amount: number | null
          last_payment_date: string | null
          location_id: string
          payment_method_id: string | null
          updated_at: string
        }
        Insert: {
          auto_billing_enabled?: boolean | null
          credit_limit?: number | null
          current_balance?: number
          customer_id: string
          id?: string
          last_payment_amount?: number | null
          last_payment_date?: string | null
          location_id: string
          payment_method_id?: string | null
          updated_at?: string
        }
        Update: {
          auto_billing_enabled?: boolean | null
          credit_limit?: number | null
          current_balance?: number
          customer_id?: string
          id?: string
          last_payment_amount?: number | null
          last_payment_date?: string | null
          location_id?: string
          payment_method_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_balances_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_balances_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      api_keys: {
        Row: {
          api_key: string
          api_secret: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          key_name: string
          last_used_at: string | null
          location_id: string | null
          permissions: Json
          rate_limit_per_minute: number | null
        }
        Insert: {
          api_key: string
          api_secret?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name: string
          last_used_at?: string | null
          location_id?: string | null
          permissions?: Json
          rate_limit_per_minute?: number | null
        }
        Update: {
          api_key?: string
          api_secret?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name?: string
          last_used_at?: string | null
          location_id?: string | null
          permissions?: Json
          rate_limit_per_minute?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      automated_test_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          execution_time_ms: number | null
          failed_tests: number
          id: string
          location_id: string | null
          passed_tests: number
          skipped_tests: number
          started_at: string
          status: string
          test_results: Json | null
          test_suite_name: string
          test_type: string
          total_tests: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          execution_time_ms?: number | null
          failed_tests?: number
          id?: string
          location_id?: string | null
          passed_tests?: number
          skipped_tests?: number
          started_at?: string
          status?: string
          test_results?: Json | null
          test_suite_name: string
          test_type: string
          total_tests?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          execution_time_ms?: number | null
          failed_tests?: number
          id?: string
          location_id?: string | null
          passed_tests?: number
          skipped_tests?: number
          started_at?: string
          status?: string
          test_results?: Json | null
          test_suite_name?: string
          test_type?: string
          total_tests?: number
        }
        Relationships: [
          {
            foreignKeyName: "automated_test_runs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_audit_logs: {
        Row: {
          action: string
          action_type: string
          backup_job_id: string | null
          compliance_metadata: Json | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          restore_point_id: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          action_type: string
          backup_job_id?: string | null
          compliance_metadata?: Json | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          restore_point_id?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          backup_job_id?: string | null
          compliance_metadata?: Json | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          restore_point_id?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_configurations: {
        Row: {
          backup_schedule: Json
          backup_type: string
          configuration: Json
          created_at: string
          created_by: string | null
          cross_region_enabled: boolean
          encryption_enabled: boolean
          frequency: string
          id: string
          is_enabled: boolean
          location_id: string | null
          retention_days: number
          target_region: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          backup_schedule?: Json
          backup_type: string
          configuration?: Json
          created_at?: string
          created_by?: string | null
          cross_region_enabled?: boolean
          encryption_enabled?: boolean
          frequency: string
          id?: string
          is_enabled?: boolean
          location_id?: string | null
          retention_days?: number
          target_region?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          backup_schedule?: Json
          backup_type?: string
          configuration?: Json
          created_at?: string
          created_by?: string | null
          cross_region_enabled?: boolean
          encryption_enabled?: boolean
          frequency?: string
          id?: string
          is_enabled?: boolean
          location_id?: string | null
          retention_days?: number
          target_region?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      backup_jobs: {
        Row: {
          backup_hash: string | null
          backup_location: string | null
          backup_size_bytes: number | null
          completed_at: string | null
          configuration_id: string
          created_at: string
          created_by: string | null
          encryption_key_id: string | null
          error_message: string | null
          estimated_completion: string | null
          id: string
          job_type: string
          metadata: Json | null
          progress_percentage: number | null
          started_at: string | null
          status: string
        }
        Insert: {
          backup_hash?: string | null
          backup_location?: string | null
          backup_size_bytes?: number | null
          completed_at?: string | null
          configuration_id: string
          created_at?: string
          created_by?: string | null
          encryption_key_id?: string | null
          error_message?: string | null
          estimated_completion?: string | null
          id?: string
          job_type: string
          metadata?: Json | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
        }
        Update: {
          backup_hash?: string | null
          backup_location?: string | null
          backup_size_bytes?: number | null
          completed_at?: string | null
          configuration_id?: string
          created_at?: string
          created_by?: string | null
          encryption_key_id?: string | null
          error_message?: string | null
          estimated_completion?: string | null
          id?: string
          job_type?: string
          metadata?: Json | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      billing_runs: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          id: string
          location_id: string
          notes: string | null
          run_date: string
          status: string
          total_amount: number | null
          total_customers: number | null
          total_invoices: number | null
          updated_at: string
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          location_id: string
          notes?: string | null
          run_date?: string
          status?: string
          total_amount?: number | null
          total_customers?: number | null
          total_invoices?: number | null
          updated_at?: string
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          location_id?: string
          notes?: string | null
          run_date?: string
          status?: string
          total_amount?: number | null
          total_customers?: number | null
          total_invoices?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_runs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      check_deposits: {
        Row: {
          amount: number
          back_image_url: string
          bank_name: string | null
          check_date: string | null
          check_number: string | null
          created_at: string
          customer_id: string
          deposit_method: string
          front_image_url: string
          id: string
          processed_at: string | null
          processed_by: string | null
          processing_notes: string | null
          status: string
          updated_at: string
          virtual_mailbox_id: string | null
        }
        Insert: {
          amount: number
          back_image_url: string
          bank_name?: string | null
          check_date?: string | null
          check_number?: string | null
          created_at?: string
          customer_id: string
          deposit_method?: string
          front_image_url: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          status?: string
          updated_at?: string
          virtual_mailbox_id?: string | null
        }
        Update: {
          amount?: number
          back_image_url?: string
          bank_name?: string | null
          check_date?: string | null
          check_number?: string | null
          created_at?: string
          customer_id?: string
          deposit_method?: string
          front_image_url?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          processing_notes?: string | null
          status?: string
          updated_at?: string
          virtual_mailbox_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_check_deposits_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_check_deposits_mailbox"
            columns: ["virtual_mailbox_id"]
            isOneToOne: false
            referencedRelation: "virtual_mailboxes"
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
      compliance_policies: {
        Row: {
          audit_requirements: Json | null
          compliance_framework: string | null
          created_at: string
          created_by: string | null
          effective_date: string
          encryption_requirements: Json | null
          expiry_date: string | null
          geographic_restrictions: Json | null
          id: string
          is_mandatory: boolean
          location_id: string | null
          policy_name: string
          policy_rules: Json
          policy_type: string
          retention_period_days: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          audit_requirements?: Json | null
          compliance_framework?: string | null
          created_at?: string
          created_by?: string | null
          effective_date?: string
          encryption_requirements?: Json | null
          expiry_date?: string | null
          geographic_restrictions?: Json | null
          id?: string
          is_mandatory?: boolean
          location_id?: string | null
          policy_name: string
          policy_rules?: Json
          policy_type: string
          retention_period_days?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          audit_requirements?: Json | null
          compliance_framework?: string | null
          created_at?: string
          created_by?: string | null
          effective_date?: string
          encryption_requirements?: Json | null
          expiry_date?: string | null
          geographic_restrictions?: Json | null
          id?: string
          is_mandatory?: boolean
          location_id?: string | null
          policy_name?: string
          policy_rules?: Json
          policy_type?: string
          retention_period_days?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      customer_appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
      customer_documents: {
        Row: {
          created_at: string
          customer_id: string
          description: string | null
          document_type: string
          file_size_bytes: number | null
          file_url: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          description?: string | null
          document_type: string
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          description?: string | null
          document_type?: string
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notification_preferences: {
        Row: {
          account_updates: boolean
          created_at: string
          customer_id: string
          email_enabled: boolean
          id: string
          mail_hold_expiry: boolean
          package_arrival: boolean
          package_delivered: boolean
          package_ready: boolean
          preferred_time: string | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_enabled: boolean
          updated_at: string
          whatsapp_enabled: boolean
        }
        Insert: {
          account_updates?: boolean
          created_at?: string
          customer_id: string
          email_enabled?: boolean
          id?: string
          mail_hold_expiry?: boolean
          package_arrival?: boolean
          package_delivered?: boolean
          package_ready?: boolean
          preferred_time?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          updated_at?: string
          whatsapp_enabled?: boolean
        }
        Update: {
          account_updates?: boolean
          created_at?: string
          customer_id?: string
          email_enabled?: boolean
          id?: string
          mail_hold_expiry?: boolean
          package_arrival?: boolean
          package_delivered?: boolean
          package_ready?: boolean
          preferred_time?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          updated_at?: string
          whatsapp_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "customer_notification_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
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
      daily_health_reports: {
        Row: {
          anomalies_detected: Json | null
          created_at: string
          critical_issues_count: number | null
          error_count: number | null
          generated_at: string
          id: string
          location_id: string | null
          overall_health_score: number
          performance_score: number | null
          recommendations: Json | null
          report_data: Json | null
          report_date: string
          system_uptime_percentage: number | null
          tests_passed_percentage: number | null
          user_satisfaction_score: number | null
          warnings_count: number | null
        }
        Insert: {
          anomalies_detected?: Json | null
          created_at?: string
          critical_issues_count?: number | null
          error_count?: number | null
          generated_at?: string
          id?: string
          location_id?: string | null
          overall_health_score?: number
          performance_score?: number | null
          recommendations?: Json | null
          report_data?: Json | null
          report_date?: string
          system_uptime_percentage?: number | null
          tests_passed_percentage?: number | null
          user_satisfaction_score?: number | null
          warnings_count?: number | null
        }
        Update: {
          anomalies_detected?: Json | null
          created_at?: string
          critical_issues_count?: number | null
          error_count?: number | null
          generated_at?: string
          id?: string
          location_id?: string | null
          overall_health_score?: number
          performance_score?: number | null
          recommendations?: Json | null
          report_data?: Json | null
          report_date?: string
          system_uptime_percentage?: number | null
          tests_passed_percentage?: number | null
          user_satisfaction_score?: number | null
          warnings_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_health_reports_location_id_fkey"
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
      disaster_recovery_plans: {
        Row: {
          automated_execution: boolean | null
          created_at: string
          created_by: string | null
          emergency_contacts: Json | null
          id: string
          is_active: boolean
          last_tested_at: string | null
          location_id: string | null
          plan_name: string
          plan_steps: Json
          plan_type: string
          priority_level: string
          recovery_point_objective: number | null
          recovery_time_objective: number | null
          status_page_integration: Json | null
          test_results: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          automated_execution?: boolean | null
          created_at?: string
          created_by?: string | null
          emergency_contacts?: Json | null
          id?: string
          is_active?: boolean
          last_tested_at?: string | null
          location_id?: string | null
          plan_name: string
          plan_steps?: Json
          plan_type: string
          priority_level?: string
          recovery_point_objective?: number | null
          recovery_time_objective?: number | null
          status_page_integration?: Json | null
          test_results?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          automated_execution?: boolean | null
          created_at?: string
          created_by?: string | null
          emergency_contacts?: Json | null
          id?: string
          is_active?: boolean
          last_tested_at?: string | null
          location_id?: string | null
          plan_name?: string
          plan_steps?: Json
          plan_type?: string
          priority_level?: string
          recovery_point_objective?: number | null
          recovery_time_objective?: number | null
          status_page_integration?: Json | null
          test_results?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      document_access_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          document_id: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          document_id: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          document_id?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_approvals: {
        Row: {
          approval_date: string | null
          approver_id: string | null
          approver_role: string | null
          comments: string | null
          created_at: string
          deadline_date: string | null
          document_id: string
          id: string
          rejection_reason: string | null
          status: string
          step_name: string
          step_number: number
          version_id: string | null
          workflow_name: string
        }
        Insert: {
          approval_date?: string | null
          approver_id?: string | null
          approver_role?: string | null
          comments?: string | null
          created_at?: string
          deadline_date?: string | null
          document_id: string
          id?: string
          rejection_reason?: string | null
          status?: string
          step_name: string
          step_number: number
          version_id?: string | null
          workflow_name: string
        }
        Update: {
          approval_date?: string | null
          approver_id?: string | null
          approver_role?: string | null
          comments?: string | null
          created_at?: string
          deadline_date?: string | null
          document_id?: string
          id?: string
          rejection_reason?: string | null
          status?: string
          step_name?: string
          step_number?: number
          version_id?: string | null
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_approvals_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_approvals_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      document_folders: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          folder_path: string
          folder_type: string
          id: string
          is_system_folder: boolean
          location_id: string | null
          name: string
          parent_folder_id: string | null
          permissions: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          folder_path: string
          folder_type?: string
          id?: string
          is_system_folder?: boolean
          location_id?: string | null
          name: string
          parent_folder_id?: string | null
          permissions?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          folder_path?: string
          folder_type?: string
          id?: string
          is_system_folder?: boolean
          location_id?: string | null
          name?: string
          parent_folder_id?: string | null
          permissions?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_folders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      document_shares: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string
          download_count: number
          download_limit: number | null
          expires_at: string | null
          id: string
          is_active: boolean
          password_hash: string | null
          recipient_email: string | null
          share_token: string
          share_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id: string
          download_count?: number
          download_limit?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          password_hash?: string | null
          recipient_email?: string | null
          share_token: string
          share_type?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          download_count?: number
          download_limit?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          password_hash?: string | null
          recipient_email?: string | null
          share_token?: string
          share_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          document_id: string
          id: string
          ip_address: unknown | null
          is_valid: boolean
          signature_data: Json | null
          signature_type: string
          signed_at: string
          signer_email: string
          signer_id: string | null
          signer_name: string
          user_agent: string | null
          verification_code: string | null
          version_id: string | null
        }
        Insert: {
          document_id: string
          id?: string
          ip_address?: unknown | null
          is_valid?: boolean
          signature_data?: Json | null
          signature_type?: string
          signed_at?: string
          signer_email: string
          signer_id?: string | null
          signer_name: string
          user_agent?: string | null
          verification_code?: string | null
          version_id?: string | null
        }
        Update: {
          document_id?: string
          id?: string
          ip_address?: unknown | null
          is_valid?: boolean
          signature_data?: Json | null
          signature_type?: string
          signed_at?: string
          signer_email?: string
          signer_id?: string | null
          signer_name?: string
          user_agent?: string | null
          verification_code?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_signatures_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string | null
          document_id: string
          file_hash: string
          file_path: string
          file_size_bytes: number
          id: string
          is_current_version: boolean
          version_label: string | null
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          document_id: string
          file_hash: string
          file_path: string
          file_size_bytes: number
          id?: string
          is_current_version?: boolean
          version_label?: string | null
          version_number: number
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string
          file_hash?: string
          file_path?: string
          file_size_bytes?: number
          id?: string
          is_current_version?: boolean
          version_label?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approval_status: string | null
          category: string
          compliance_flags: Json | null
          confidentiality_level: string
          content_type: string
          created_at: string
          created_by: string | null
          customer_id: string | null
          document_date: string | null
          expiration_date: string | null
          extracted_text: string | null
          file_hash: string | null
          file_name: string
          file_path: string
          file_size_bytes: number
          folder_id: string | null
          id: string
          is_sensitive: boolean
          is_template: boolean
          language: string | null
          last_accessed_at: string | null
          location_id: string | null
          package_id: string | null
          related_documents: string[] | null
          requires_signature: boolean
          retention_end_date: string | null
          retention_years: number | null
          search_vector: unknown | null
          status: string
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          approval_status?: string | null
          category?: string
          compliance_flags?: Json | null
          confidentiality_level?: string
          content_type: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          document_date?: string | null
          expiration_date?: string | null
          extracted_text?: string | null
          file_hash?: string | null
          file_name: string
          file_path: string
          file_size_bytes: number
          folder_id?: string | null
          id?: string
          is_sensitive?: boolean
          is_template?: boolean
          language?: string | null
          last_accessed_at?: string | null
          location_id?: string | null
          package_id?: string | null
          related_documents?: string[] | null
          requires_signature?: boolean
          retention_end_date?: string | null
          retention_years?: number | null
          search_vector?: unknown | null
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          approval_status?: string | null
          category?: string
          compliance_flags?: Json | null
          confidentiality_level?: string
          content_type?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          document_date?: string | null
          expiration_date?: string | null
          extracted_text?: string | null
          file_hash?: string | null
          file_name?: string
          file_path?: string
          file_size_bytes?: number
          folder_id?: string | null
          id?: string
          is_sensitive?: boolean
          is_template?: boolean
          language?: string | null
          last_accessed_at?: string | null
          location_id?: string | null
          package_id?: string | null
          related_documents?: string[] | null
          requires_signature?: boolean
          retention_end_date?: string | null
          retention_years?: number | null
          search_vector?: unknown | null
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
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
      failed_processes: {
        Row: {
          created_at: string
          error_details: Json | null
          error_message: string | null
          failed_at: string
          id: string
          location_id: string | null
          process_name: string
          process_type: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_details?: Json | null
          error_message?: string | null
          failed_at?: string
          id?: string
          location_id?: string | null
          process_name: string
          process_type: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_details?: Json | null
          error_message?: string | null
          failed_at?: string
          id?: string
          location_id?: string | null
          process_name?: string
          process_type?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "failed_processes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          endpoint: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          integration_id: string
          method: string | null
          request_data: Json | null
          request_type: string
          response_data: Json | null
          status_code: number | null
        }
        Insert: {
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          integration_id: string
          method?: string | null
          request_data?: Json | null
          request_type: string
          response_data?: Json | null
          status_code?: number | null
        }
        Update: {
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          integration_id?: string
          method?: string | null
          request_data?: Json | null
          request_type?: string
          response_data?: Json | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_sync_schedules: {
        Row: {
          created_at: string
          id: string
          integration_id: string
          is_active: boolean
          last_run_at: string | null
          next_run_at: string | null
          schedule_config: Json
          schedule_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          schedule_config?: Json
          schedule_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          is_active?: boolean
          last_run_at?: string | null
          next_run_at?: string | null
          schedule_config?: Json
          schedule_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_sync_schedules_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          configuration: Json
          created_at: string
          created_by: string | null
          credentials: Json
          display_name: string
          id: string
          is_active: boolean
          is_connected: boolean
          last_error: string | null
          last_sync_at: string | null
          location_id: string | null
          rate_limit_per_minute: number | null
          service_name: string
          service_type: string
          updated_at: string
          updated_by: string | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          credentials?: Json
          display_name: string
          id?: string
          is_active?: boolean
          is_connected?: boolean
          last_error?: string | null
          last_sync_at?: string | null
          location_id?: string | null
          rate_limit_per_minute?: number | null
          service_name: string
          service_type: string
          updated_at?: string
          updated_by?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          credentials?: Json
          display_name?: string
          id?: string
          is_active?: boolean
          is_connected?: boolean
          last_error?: string | null
          last_sync_at?: string | null
          location_id?: string | null
          rate_limit_per_minute?: number | null
          service_name?: string
          service_type?: string
          updated_at?: string
          updated_by?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_adjustment_items: {
        Row: {
          adjustment_id: string
          adjustment_quantity: number | null
          counted_quantity: number
          created_at: string
          id: string
          item_id: string
          notes: string | null
          reason_code: string | null
          system_quantity: number
          unit_cost: number | null
        }
        Insert: {
          adjustment_id: string
          adjustment_quantity?: number | null
          counted_quantity: number
          created_at?: string
          id?: string
          item_id: string
          notes?: string | null
          reason_code?: string | null
          system_quantity: number
          unit_cost?: number | null
        }
        Update: {
          adjustment_id?: string
          adjustment_quantity?: number | null
          counted_quantity?: number
          created_at?: string
          id?: string
          item_id?: string
          notes?: string | null
          reason_code?: string | null
          system_quantity?: number
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_adjustment_items_adjustment"
            columns: ["adjustment_id"]
            isOneToOne: false
            referencedRelation: "inventory_adjustments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_inventory_adjustment_items_item"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_adjustments: {
        Row: {
          adjustment_date: string
          adjustment_number: string
          adjustment_type: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          id: string
          location_id: string
          notes: string | null
          status: string
          total_adjustments: number | null
          total_items: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          adjustment_date?: string
          adjustment_number: string
          adjustment_type: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          location_id: string
          notes?: string | null
          status?: string
          total_adjustments?: number | null
          total_items?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          adjustment_date?: string
          adjustment_number?: string
          adjustment_type?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          location_id?: string
          notes?: string | null
          status?: string
          total_adjustments?: number | null
          total_items?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_adjustments_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          barcode: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_consumable: boolean
          max_stock_level: number | null
          min_stock_level: number | null
          name: string
          preferred_vendor_id: string | null
          reorder_point: number | null
          sku: string
          standard_cost: number | null
          unit_of_measure: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          barcode?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_consumable?: boolean
          max_stock_level?: number | null
          min_stock_level?: number | null
          name: string
          preferred_vendor_id?: string | null
          reorder_point?: number | null
          sku: string
          standard_cost?: number | null
          unit_of_measure?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          barcode?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_consumable?: boolean
          max_stock_level?: number | null
          min_stock_level?: number | null
          name?: string
          preferred_vendor_id?: string | null
          reorder_point?: number | null
          sku?: string
          standard_cost?: number | null
          unit_of_measure?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_items_vendor"
            columns: ["preferred_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          location_id: string
          movement_type: string
          notes: string | null
          quantity_change: number
          reason_code: string | null
          reference_id: string | null
          reference_type: string | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          location_id: string
          movement_type: string
          notes?: string | null
          quantity_change: number
          reason_code?: string | null
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          location_id?: string
          movement_type?: string
          notes?: string | null
          quantity_change?: number
          reason_code?: string | null
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_movements_item"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_inventory_movements_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_stock: {
        Row: {
          created_at: string
          id: string
          item_id: string
          last_counted_at: string | null
          last_counted_by: string | null
          location_id: string
          quantity_available: number | null
          quantity_on_hand: number
          quantity_reserved: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          last_counted_at?: string | null
          last_counted_by?: string | null
          location_id: string
          quantity_available?: number | null
          quantity_on_hand?: number
          quantity_reserved?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          last_counted_at?: string | null
          last_counted_by?: string | null
          location_id?: string
          quantity_available?: number | null
          quantity_on_hand?: number
          quantity_reserved?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_stock_item"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_inventory_stock_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string
          description: string
          id: string
          invoice_id: string
          item_type: string
          line_total: number
          mailbox_id: string | null
          package_id: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          item_type: string
          line_total: number
          mailbox_id?: string | null
          package_id?: string | null
          quantity?: number
          unit_price: number
        }
        Update: {
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          item_type?: string
          line_total?: number
          mailbox_id?: string | null
          package_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_mailbox_id_fkey"
            columns: ["mailbox_id"]
            isOneToOne: false
            referencedRelation: "mailboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          amount_paid: number
          billing_period_end: string
          billing_period_start: string
          created_at: string
          created_by: string | null
          customer_id: string
          discount_amount: number
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          late_fee_applied: number | null
          location_id: string
          notes: string | null
          payment_terms: number | null
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_due?: number
          amount_paid?: number
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          created_by?: string | null
          customer_id: string
          discount_amount?: number
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          late_fee_applied?: number | null
          location_id: string
          notes?: string | null
          payment_terms?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string
          discount_amount?: number
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          late_fee_applied?: number | null
          location_id?: string
          notes?: string | null
          payment_terms?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      late_fee_configurations: {
        Row: {
          applies_after_days: number
          created_at: string
          fee_amount: number
          fee_name: string
          fee_type: string
          grace_period_days: number | null
          id: string
          is_active: boolean | null
          location_id: string
          max_fee_amount: number | null
          updated_at: string
        }
        Insert: {
          applies_after_days?: number
          created_at?: string
          fee_amount: number
          fee_name: string
          fee_type: string
          grace_period_days?: number | null
          id?: string
          is_active?: boolean | null
          location_id: string
          max_fee_amount?: number | null
          updated_at?: string
        }
        Update: {
          applies_after_days?: number
          created_at?: string
          fee_amount?: number
          fee_name?: string
          fee_type?: string
          grace_period_days?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string
          max_fee_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "late_fee_configurations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
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
      mail_actions: {
        Row: {
          action_cost: number | null
          action_type: string
          completed_at: string | null
          cost_amount: number | null
          created_at: string
          forwarding_address: Json | null
          id: string
          mail_piece_id: string
          notes: string | null
          processed_by: string | null
          requested_at: string
          scan_document_urls: Json | null
          scanning_instructions: Json | null
          status: string
          tracking_number: string | null
          virtual_mailbox_id: string
        }
        Insert: {
          action_cost?: number | null
          action_type: string
          completed_at?: string | null
          cost_amount?: number | null
          created_at?: string
          forwarding_address?: Json | null
          id?: string
          mail_piece_id: string
          notes?: string | null
          processed_by?: string | null
          requested_at?: string
          scan_document_urls?: Json | null
          scanning_instructions?: Json | null
          status?: string
          tracking_number?: string | null
          virtual_mailbox_id: string
        }
        Update: {
          action_cost?: number | null
          action_type?: string
          completed_at?: string | null
          cost_amount?: number | null
          created_at?: string
          forwarding_address?: Json | null
          id?: string
          mail_piece_id?: string
          notes?: string | null
          processed_by?: string | null
          requested_at?: string
          scan_document_urls?: Json | null
          scanning_instructions?: Json | null
          status?: string
          tracking_number?: string | null
          virtual_mailbox_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_mail_actions_mail_piece"
            columns: ["mail_piece_id"]
            isOneToOne: false
            referencedRelation: "mail_pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_mail_actions_mailbox"
            columns: ["virtual_mailbox_id"]
            isOneToOne: false
            referencedRelation: "virtual_mailboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_hold_requests: {
        Row: {
          created_at: string
          customer_id: string
          end_date: string
          forward_address: string | null
          id: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_date: string
          forward_address?: string | null
          id?: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_date?: string
          forward_address?: string | null
          id?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_hold_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_pieces: {
        Row: {
          created_at: string
          customer_action_deadline: string | null
          customer_notified_at: string | null
          id: string
          mail_type: string
          notes: string | null
          photo_exterior_url: string | null
          photo_thumbnail_url: string | null
          piece_number: string
          priority_level: number
          processed_by: string | null
          received_date: string
          sender_address: string | null
          sender_name: string | null
          size_category: string
          special_handling_flags: Json | null
          status: string
          updated_at: string
          virtual_mailbox_id: string
          weight_grams: number | null
        }
        Insert: {
          created_at?: string
          customer_action_deadline?: string | null
          customer_notified_at?: string | null
          id?: string
          mail_type?: string
          notes?: string | null
          photo_exterior_url?: string | null
          photo_thumbnail_url?: string | null
          piece_number: string
          priority_level?: number
          processed_by?: string | null
          received_date?: string
          sender_address?: string | null
          sender_name?: string | null
          size_category?: string
          special_handling_flags?: Json | null
          status?: string
          updated_at?: string
          virtual_mailbox_id: string
          weight_grams?: number | null
        }
        Update: {
          created_at?: string
          customer_action_deadline?: string | null
          customer_notified_at?: string | null
          id?: string
          mail_type?: string
          notes?: string | null
          photo_exterior_url?: string | null
          photo_thumbnail_url?: string | null
          piece_number?: string
          priority_level?: number
          processed_by?: string | null
          received_date?: string
          sender_address?: string | null
          sender_name?: string | null
          size_category?: string
          special_handling_flags?: Json | null
          status?: string
          updated_at?: string
          virtual_mailbox_id?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_mail_pieces_mailbox"
            columns: ["virtual_mailbox_id"]
            isOneToOne: false
            referencedRelation: "virtual_mailboxes"
            referencedColumns: ["id"]
          },
        ]
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
      notification_analytics: {
        Row: {
          avg_response_time_minutes: number | null
          channel: string
          click_rate: number | null
          cost_per_message_cents: number | null
          created_at: string
          date: string
          delivery_rate: number | null
          id: string
          location_id: string | null
          open_rate: number | null
          rule_id: string | null
          template_id: string | null
          total_clicked: number | null
          total_cost_cents: number | null
          total_delivered: number | null
          total_failed: number | null
          total_opened: number | null
          total_sent: number | null
          updated_at: string
        }
        Insert: {
          avg_response_time_minutes?: number | null
          channel: string
          click_rate?: number | null
          cost_per_message_cents?: number | null
          created_at?: string
          date?: string
          delivery_rate?: number | null
          id?: string
          location_id?: string | null
          open_rate?: number | null
          rule_id?: string | null
          template_id?: string | null
          total_clicked?: number | null
          total_cost_cents?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string
        }
        Update: {
          avg_response_time_minutes?: number | null
          channel?: string
          click_rate?: number | null
          cost_per_message_cents?: number | null
          created_at?: string
          date?: string
          delivery_rate?: number | null
          id?: string
          location_id?: string | null
          open_rate?: number | null
          rule_id?: string | null
          template_id?: string | null
          total_clicked?: number | null
          total_cost_cents?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_analytics_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_analytics_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "notification_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_analytics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_opt_outs: {
        Row: {
          channel: string
          consent_method: string | null
          created_at: string
          customer_id: string
          expires_at: string | null
          id: string
          ip_address: string | null
          opted_out_at: string
          reason: string | null
          user_agent: string | null
        }
        Insert: {
          channel: string
          consent_method?: string | null
          created_at?: string
          customer_id: string
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          opted_out_at?: string
          reason?: string | null
          user_agent?: string | null
        }
        Update: {
          channel?: string
          consent_method?: string | null
          created_at?: string
          customer_id?: string
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          opted_out_at?: string
          reason?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_opt_outs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          channel: string
          clicked_at: string | null
          content: string
          cost_cents: number | null
          created_at: string
          customer_id: string
          delivery_status: string | null
          error_message: string | null
          external_id: string | null
          id: string
          opened_at: string | null
          provider: string | null
          recipient: string
          rule_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string | null
          template_id: string | null
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          channel: string
          clicked_at?: string | null
          content: string
          cost_cents?: number | null
          created_at?: string
          customer_id: string
          delivery_status?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          opened_at?: string | null
          provider?: string | null
          recipient: string
          rule_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          channel?: string
          clicked_at?: string | null
          content?: string
          cost_cents?: number | null
          created_at?: string
          customer_id?: string
          delivery_status?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          opened_at?: string | null
          provider?: string | null
          recipient?: string
          rule_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_id?: string | null
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "notification_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "notification_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          channels: Json
          conditions: Json
          created_at: string
          created_by: string | null
          delay_minutes: number | null
          description: string | null
          id: string
          is_active: boolean
          location_id: string | null
          name: string
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          schedule_config: Json | null
          template_id: string | null
          trigger_type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          channels?: Json
          conditions?: Json
          created_at?: string
          created_by?: string | null
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          location_id?: string | null
          name: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          schedule_config?: Json | null
          template_id?: string | null
          trigger_type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          channels?: Json
          conditions?: Json
          created_at?: string
          created_by?: string | null
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          location_id?: string | null
          name?: string
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          schedule_config?: Json | null
          template_id?: string | null
          trigger_type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean | null
          language: string
          name: string
          parent_template_id: string | null
          subject: string | null
          test_percentage: number | null
          type: string
          updated_at: string
          updated_by: string | null
          variables: Json | null
          variant_name: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          language?: string
          name: string
          parent_template_id?: string | null
          subject?: string | null
          test_percentage?: number | null
          type: string
          updated_at?: string
          updated_by?: string | null
          variables?: Json | null
          variant_name?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          language?: string
          name?: string
          parent_template_id?: string | null
          subject?: string | null
          test_percentage?: number | null
          type?: string
          updated_at?: string
          updated_by?: string | null
          variables?: Json | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_workflows: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          location_id: string | null
          name: string
          steps: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          location_id?: string | null
          name: string
          steps: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          location_id?: string | null
          name?: string
          steps?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_workflows_location_id_fkey"
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
      payment_plans: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          end_date: string
          id: string
          location_id: string
          monthly_payment: number
          next_payment_date: string
          notes: string | null
          original_amount: number
          remaining_amount: number
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          end_date: string
          id?: string
          location_id: string
          monthly_payment: number
          next_payment_date: string
          notes?: string | null
          original_amount: number
          remaining_amount: number
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          end_date?: string
          id?: string
          location_id?: string
          monthly_payment?: number
          next_payment_date?: string
          notes?: string | null
          original_amount?: number
          remaining_amount?: number
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          ath_movil_transaction_id: string | null
          created_at: string
          customer_id: string
          id: string
          invoice_id: string | null
          location_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          processed_by: string | null
          reference_number: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          ath_movil_transaction_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          invoice_id?: string | null
          location_id: string
          notes?: string | null
          payment_date?: string
          payment_method: string
          payment_number: string
          processed_by?: string | null
          reference_number?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          ath_movil_transaction_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          invoice_id?: string | null
          location_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          processed_by?: string | null
          reference_number?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          created_at: string
          endpoint_or_page: string | null
          error_rate: number | null
          id: string
          location_id: string | null
          memory_usage_mb: number | null
          metric_type: string
          recorded_at: string
          response_time_ms: number | null
          throughput_per_second: number | null
        }
        Insert: {
          created_at?: string
          endpoint_or_page?: string | null
          error_rate?: number | null
          id?: string
          location_id?: string | null
          memory_usage_mb?: number | null
          metric_type: string
          recorded_at?: string
          response_time_ms?: number | null
          throughput_per_second?: number | null
        }
        Update: {
          created_at?: string
          endpoint_or_page?: string | null
          error_rate?: number | null
          id?: string
          location_id?: string | null
          memory_usage_mb?: number | null
          metric_type?: string
          recorded_at?: string
          response_time_ms?: number | null
          throughput_per_second?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_location_id_fkey"
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
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          line_total: number | null
          notes: string | null
          purchase_order_id: string
          quantity_ordered: number
          quantity_received: number
          unit_cost: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          line_total?: number | null
          notes?: string | null
          purchase_order_id: string
          quantity_ordered: number
          quantity_received?: number
          unit_cost: number
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          line_total?: number | null
          notes?: string | null
          purchase_order_id?: string
          quantity_ordered?: number
          quantity_received?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchase_order_items_item"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_purchase_order_items_po"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery_date: string | null
          created_at: string
          created_by: string | null
          expected_delivery_date: string | null
          id: string
          location_id: string
          notes: string | null
          order_date: string
          payment_terms: number | null
          po_number: string
          shipping_cost: number
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
          updated_by: string | null
          vendor_id: string
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          location_id: string
          notes?: string | null
          order_date?: string
          payment_terms?: number | null
          po_number: string
          shipping_cost?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          updated_by?: string | null
          vendor_id: string
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery_date?: string | null
          id?: string
          location_id?: string
          notes?: string | null
          order_date?: string
          payment_terms?: number | null
          po_number?: string
          shipping_cost?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
          updated_by?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchase_orders_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_purchase_orders_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_checklist_executions: {
        Row: {
          checklist_id: string
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          executed_by: string | null
          execution_notes: string | null
          id: string
          started_at: string
          status: string
        }
        Insert: {
          checklist_id: string
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          executed_by?: string | null
          execution_notes?: string | null
          id?: string
          started_at?: string
          status?: string
        }
        Update: {
          checklist_id?: string
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          executed_by?: string | null
          execution_notes?: string | null
          id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_checklist_executions_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "qa_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_checklists: {
        Row: {
          checklist_items: Json
          checklist_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_template: boolean
          location_id: string | null
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          checklist_items?: Json
          checklist_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean
          location_id?: string | null
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          checklist_items?: Json
          checklist_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean
          location_id?: string | null
          name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qa_checklists_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_executions: {
        Row: {
          actual_rto: number | null
          approved_by: string | null
          completed_at: string | null
          created_at: string
          executed_by: string | null
          execution_log: Json | null
          execution_type: string
          id: string
          issues_encountered: Json | null
          lessons_learned: string | null
          plan_id: string
          restore_point_id: string | null
          started_at: string
          status: string
          success_percentage: number | null
        }
        Insert: {
          actual_rto?: number | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string
          executed_by?: string | null
          execution_log?: Json | null
          execution_type: string
          id?: string
          issues_encountered?: Json | null
          lessons_learned?: string | null
          plan_id: string
          restore_point_id?: string | null
          started_at?: string
          status?: string
          success_percentage?: number | null
        }
        Update: {
          actual_rto?: number | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string
          executed_by?: string | null
          execution_log?: Json | null
          execution_type?: string
          id?: string
          issues_encountered?: Json | null
          lessons_learned?: string | null
          plan_id?: string
          restore_point_id?: string | null
          started_at?: string
          status?: string
          success_percentage?: number | null
        }
        Relationships: []
      }
      report_executions: {
        Row: {
          completed_at: string | null
          error_message: string | null
          executed_at: string
          executed_by: string | null
          execution_time_ms: number | null
          file_url: string | null
          id: string
          parameters: Json
          report_id: string
          result_data: Json | null
          row_count: number | null
          schedule_id: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          executed_at?: string
          executed_by?: string | null
          execution_time_ms?: number | null
          file_url?: string | null
          id?: string
          parameters?: Json
          report_id: string
          result_data?: Json | null
          row_count?: number | null
          schedule_id?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          executed_at?: string
          executed_by?: string | null
          execution_time_ms?: number | null
          file_url?: string | null
          id?: string
          parameters?: Json
          report_id?: string
          result_data?: Json | null
          row_count?: number | null
          schedule_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_executions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_executions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "report_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      report_schedules: {
        Row: {
          created_at: string
          created_by: string | null
          format: string
          id: string
          is_active: boolean
          last_run_at: string | null
          location_id: string | null
          name: string
          next_run_at: string | null
          recipients: Json
          report_id: string
          schedule_config: Json
          schedule_type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          format?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          location_id?: string | null
          name: string
          next_run_at?: string | null
          recipients?: Json
          report_id: string
          schedule_config?: Json
          schedule_type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          format?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          location_id?: string | null
          name?: string
          next_run_at?: string | null
          recipients?: Json
          report_id?: string
          schedule_config?: Json
          schedule_type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_schedules_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          category: string
          created_at: string
          default_parameters: Json
          description: string | null
          id: string
          is_active: boolean
          name: string
          required_roles: Json
          template_config: Json
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          default_parameters?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          required_roles?: Json
          template_config?: Json
          type: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          default_parameters?: Json
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          required_roles?: Json
          template_config?: Json
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          filters: Json
          id: string
          is_public: boolean
          is_system: boolean
          location_id: string | null
          name: string
          parameters: Json
          query_config: Json
          type: string
          updated_at: string
          updated_by: string | null
          visualization_config: Json
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          filters?: Json
          id?: string
          is_public?: boolean
          is_system?: boolean
          location_id?: string | null
          name: string
          parameters?: Json
          query_config?: Json
          type: string
          updated_at?: string
          updated_by?: string | null
          visualization_config?: Json
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          filters?: Json
          id?: string
          is_public?: boolean
          is_system?: boolean
          location_id?: string | null
          name?: string
          parameters?: Json
          query_config?: Json
          type?: string
          updated_at?: string
          updated_by?: string | null
          visualization_config?: Json
        }
        Relationships: []
      }
      restore_points: {
        Row: {
          backup_job_id: string
          backup_type: string
          created_at: string
          data_integrity_verified: boolean | null
          id: string
          is_available: boolean
          location_path: string | null
          metadata: Json | null
          restore_point_name: string
          size_bytes: number | null
          timestamp: string
          verification_date: string | null
        }
        Insert: {
          backup_job_id: string
          backup_type: string
          created_at?: string
          data_integrity_verified?: boolean | null
          id?: string
          is_available?: boolean
          location_path?: string | null
          metadata?: Json | null
          restore_point_name: string
          size_bytes?: number | null
          timestamp: string
          verification_date?: string | null
        }
        Update: {
          backup_job_id?: string
          backup_type?: string
          created_at?: string
          data_integrity_verified?: boolean | null
          id?: string
          is_available?: boolean
          location_path?: string | null
          metadata?: Json | null
          restore_point_name?: string
          size_bytes?: number | null
          timestamp?: string
          verification_date?: string | null
        }
        Relationships: []
      }
      scanning_queue: {
        Row: {
          assigned_to: string | null
          color_mode: string
          completed_at: string | null
          created_at: string
          estimated_completion: string | null
          id: string
          mail_action_id: string
          mail_piece_id: string
          priority_level: number
          queue_position: number
          resolution_dpi: number
          scan_quality: string
          scan_type: string
          special_instructions: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          color_mode?: string
          completed_at?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          mail_action_id: string
          mail_piece_id: string
          priority_level?: number
          queue_position?: number
          resolution_dpi?: number
          scan_quality?: string
          scan_type?: string
          special_instructions?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          color_mode?: string
          completed_at?: string | null
          created_at?: string
          estimated_completion?: string | null
          id?: string
          mail_action_id?: string
          mail_piece_id?: string
          priority_level?: number
          queue_position?: number
          resolution_dpi?: number
          scan_quality?: string
          scan_type?: string
          special_instructions?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_scanning_queue_action"
            columns: ["mail_action_id"]
            isOneToOne: false
            referencedRelation: "mail_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_scanning_queue_mail_piece"
            columns: ["mail_piece_id"]
            isOneToOne: false
            referencedRelation: "mail_pieces"
            referencedColumns: ["id"]
          },
        ]
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
      system_health_metrics: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          metric_type: string
          metric_value: number
          recorded_at: string
          status: string
          threshold_critical: number | null
          threshold_warning: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          metric_type: string
          metric_value: number
          recorded_at?: string
          status?: string
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          status?: string
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "system_health_metrics_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_configurations: {
        Row: {
          applies_to: string[] | null
          created_at: string
          effective_date: string
          id: string
          is_active: boolean | null
          location_id: string
          tax_name: string
          tax_rate: number
          tax_type: string
          updated_at: string
        }
        Insert: {
          applies_to?: string[] | null
          created_at?: string
          effective_date?: string
          id?: string
          is_active?: boolean | null
          location_id: string
          tax_name: string
          tax_rate: number
          tax_type: string
          updated_at?: string
        }
        Update: {
          applies_to?: string[] | null
          created_at?: string
          effective_date?: string
          id?: string
          is_active?: boolean | null
          location_id?: string
          tax_name?: string
          tax_rate?: number
          tax_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_configurations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      test_cases: {
        Row: {
          automation_script: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          expected_results: string | null
          id: string
          location_id: string | null
          preconditions: string | null
          priority: string
          status: string
          tags: string[] | null
          test_steps: Json | null
          test_type: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          automation_script?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expected_results?: string | null
          id?: string
          location_id?: string | null
          preconditions?: string | null
          priority?: string
          status?: string
          tags?: string[] | null
          test_steps?: Json | null
          test_type: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          automation_script?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expected_results?: string | null
          id?: string
          location_id?: string | null
          preconditions?: string | null
          priority?: string
          status?: string
          tags?: string[] | null
          test_steps?: Json | null
          test_type?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_cases_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      test_executions: {
        Row: {
          actual_results: string | null
          created_at: string
          executed_at: string
          executed_by: string | null
          execution_time_ms: number | null
          execution_type: string
          failure_reason: string | null
          id: string
          screenshots: string[] | null
          status: string
          test_case_id: string
          test_run_id: string | null
        }
        Insert: {
          actual_results?: string | null
          created_at?: string
          executed_at?: string
          executed_by?: string | null
          execution_time_ms?: number | null
          execution_type: string
          failure_reason?: string | null
          id?: string
          screenshots?: string[] | null
          status: string
          test_case_id: string
          test_run_id?: string | null
        }
        Update: {
          actual_results?: string | null
          created_at?: string
          executed_at?: string
          executed_by?: string | null
          execution_time_ms?: number | null
          execution_type?: string
          failure_reason?: string | null
          id?: string
          screenshots?: string[] | null
          status?: string
          test_case_id?: string
          test_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_executions_test_case_id_fkey"
            columns: ["test_case_id"]
            isOneToOne: false
            referencedRelation: "test_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_executions_test_run_id_fkey"
            columns: ["test_run_id"]
            isOneToOne: false
            referencedRelation: "automated_test_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_error_reports: {
        Row: {
          actual_behavior: string | null
          assigned_to: string | null
          browser_info: Json | null
          created_at: string
          description: string
          error_type: string
          expected_behavior: string | null
          id: string
          location_id: string | null
          priority: string
          reported_at: string
          resolution_notes: string | null
          resolved_at: string | null
          screenshot_urls: string[] | null
          status: string
          steps_to_reproduce: string | null
          title: string
          updated_at: string
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          actual_behavior?: string | null
          assigned_to?: string | null
          browser_info?: Json | null
          created_at?: string
          description: string
          error_type: string
          expected_behavior?: string | null
          id?: string
          location_id?: string | null
          priority?: string
          reported_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          screenshot_urls?: string[] | null
          status?: string
          steps_to_reproduce?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          actual_behavior?: string | null
          assigned_to?: string | null
          browser_info?: Json | null
          created_at?: string
          description?: string
          error_type?: string
          expected_behavior?: string | null
          id?: string
          location_id?: string | null
          priority?: string
          reported_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          screenshot_urls?: string[] | null
          status?: string
          steps_to_reproduce?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_error_reports_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          assigned_to: string | null
          browser_info: Json | null
          category: string | null
          created_at: string
          description: string
          feedback_type: string
          id: string
          location_id: string | null
          page_url: string | null
          priority_score: number | null
          responded_at: string | null
          response: string | null
          satisfaction_rating: number | null
          screenshot_urls: string[] | null
          severity: string | null
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          browser_info?: Json | null
          category?: string | null
          created_at?: string
          description: string
          feedback_type: string
          id?: string
          location_id?: string | null
          page_url?: string | null
          priority_score?: number | null
          responded_at?: string | null
          response?: string | null
          satisfaction_rating?: number | null
          screenshot_urls?: string[] | null
          severity?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          browser_info?: Json | null
          category?: string | null
          created_at?: string
          description?: string
          feedback_type?: string
          id?: string
          location_id?: string | null
          page_url?: string | null
          priority_score?: number | null
          responded_at?: string | null
          response?: string | null
          satisfaction_rating?: number | null
          screenshot_urls?: string[] | null
          severity?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
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
      vendors: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          payment_terms: number | null
          phone: string | null
          preferred_payment_method: string | null
          state: string | null
          tax_id: string | null
          updated_at: string
          updated_by: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          preferred_payment_method?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          preferred_payment_method?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string | null
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
      virtual_mailbox_billing: {
        Row: {
          action_fees: number
          billing_month: string
          billing_period_end: string
          billing_period_start: string
          created_at: string
          forwarding_fees: number
          id: string
          invoice_id: string | null
          monthly_service_fee: number
          processed_at: string | null
          scanning_fees: number
          status: string
          storage_fees: number
          total_amount: number
          usage_summary: Json
          virtual_mailbox_id: string
        }
        Insert: {
          action_fees?: number
          billing_month: string
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          forwarding_fees?: number
          id?: string
          invoice_id?: string | null
          monthly_service_fee?: number
          processed_at?: string | null
          scanning_fees?: number
          status?: string
          storage_fees?: number
          total_amount?: number
          usage_summary?: Json
          virtual_mailbox_id: string
        }
        Update: {
          action_fees?: number
          billing_month?: string
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          forwarding_fees?: number
          id?: string
          invoice_id?: string | null
          monthly_service_fee?: number
          processed_at?: string | null
          scanning_fees?: number
          status?: string
          storage_fees?: number
          total_amount?: number
          usage_summary?: Json
          virtual_mailbox_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vm_billing_mailbox"
            columns: ["virtual_mailbox_id"]
            isOneToOne: false
            referencedRelation: "virtual_mailboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_mailbox_billing_config: {
        Row: {
          auto_billing_enabled: boolean
          auto_suspend_days: number
          billing_cycle_days: number
          created_at: string
          grace_period_days: number
          id: string
          late_fee_amount: number
          location_id: string | null
          updated_at: string
        }
        Insert: {
          auto_billing_enabled?: boolean
          auto_suspend_days?: number
          billing_cycle_days?: number
          created_at?: string
          grace_period_days?: number
          id?: string
          late_fee_amount?: number
          location_id?: string | null
          updated_at?: string
        }
        Update: {
          auto_billing_enabled?: boolean
          auto_suspend_days?: number
          billing_cycle_days?: number
          created_at?: string
          grace_period_days?: number
          id?: string
          late_fee_amount?: number
          location_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_mailbox_billing_config_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_mailbox_pricing: {
        Row: {
          check_deposit_fee: number
          created_at: string
          created_by: string | null
          effective_date: string
          forward_fee_base: number
          forward_fee_per_ounce: number
          id: string
          is_active: boolean
          location_id: string | null
          monthly_base_fee: number
          rush_processing_fee: number
          scan_fee_per_page: number
          service_tier: string
          shred_fee: number
          storage_fee_per_month: number
        }
        Insert: {
          check_deposit_fee?: number
          created_at?: string
          created_by?: string | null
          effective_date?: string
          forward_fee_base?: number
          forward_fee_per_ounce?: number
          id?: string
          is_active?: boolean
          location_id?: string | null
          monthly_base_fee?: number
          rush_processing_fee?: number
          scan_fee_per_page?: number
          service_tier: string
          shred_fee?: number
          storage_fee_per_month?: number
        }
        Update: {
          check_deposit_fee?: number
          created_at?: string
          created_by?: string | null
          effective_date?: string
          forward_fee_base?: number
          forward_fee_per_ounce?: number
          id?: string
          is_active?: boolean
          location_id?: string | null
          monthly_base_fee?: number
          rush_processing_fee?: number
          scan_fee_per_page?: number
          service_tier?: string
          shred_fee?: number
          storage_fee_per_month?: number
        }
        Relationships: []
      }
      virtual_mailboxes: {
        Row: {
          activation_date: string
          address_line1: string
          address_line2: string | null
          billing_cycle_day: number
          city: string
          created_at: string
          created_by: string | null
          customer_id: string
          forwarding_address: Json | null
          id: string
          location_id: string
          monthly_fee: number
          preferences: Json
          service_tier: string
          state: string
          status: string
          updated_at: string
          updated_by: string | null
          zip_code: string
        }
        Insert: {
          activation_date?: string
          address_line1: string
          address_line2?: string | null
          billing_cycle_day?: number
          city?: string
          created_at?: string
          created_by?: string | null
          customer_id: string
          forwarding_address?: Json | null
          id?: string
          location_id: string
          monthly_fee?: number
          preferences?: Json
          service_tier?: string
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          zip_code: string
        }
        Update: {
          activation_date?: string
          address_line1?: string
          address_line2?: string | null
          billing_cycle_day?: number
          city?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string
          forwarding_address?: Json | null
          id?: string
          location_id?: string
          monthly_fee?: number
          preferences?: Json
          service_tier?: string
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_virtual_mailboxes_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_endpoints: {
        Row: {
          created_at: string
          created_by: string | null
          delivery_attempts: number | null
          endpoint_name: string
          events: Json
          id: string
          is_active: boolean
          last_delivery_at: string | null
          location_id: string | null
          secret: string
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          delivery_attempts?: number | null
          endpoint_name: string
          events?: Json
          id?: string
          is_active?: boolean
          last_delivery_at?: string | null
          location_id?: string | null
          secret: string
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          delivery_attempts?: number | null
          endpoint_name?: string
          events?: Json
          id?: string
          is_active?: boolean
          last_delivery_at?: string | null
          location_id?: string | null
          secret?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_endpoints_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          body_content: string
          body_variables: Json | null
          buttons: Json | null
          category: string
          created_at: string
          created_by: string | null
          footer_content: string | null
          header_content: string | null
          header_type: string | null
          header_variables: Json | null
          id: string
          language: string
          name: string
          status: string
          updated_at: string
          whatsapp_template_id: string
        }
        Insert: {
          body_content: string
          body_variables?: Json | null
          buttons?: Json | null
          category: string
          created_at?: string
          created_by?: string | null
          footer_content?: string | null
          header_content?: string | null
          header_type?: string | null
          header_variables?: Json | null
          id?: string
          language?: string
          name: string
          status?: string
          updated_at?: string
          whatsapp_template_id: string
        }
        Update: {
          body_content?: string
          body_variables?: Json | null
          buttons?: Json | null
          category?: string
          created_at?: string
          created_by?: string | null
          footer_content?: string | null
          header_content?: string | null
          header_type?: string | null
          header_variables?: Json | null
          id?: string
          language?: string
          name?: string
          status?: string
          updated_at?: string
          whatsapp_template_id?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          id: string
          user_id: string
          balance: number
          total_earned: number
          total_redeemed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          total_earned?: number
          total_redeemed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          total_earned?: number
          total_redeemed?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      loyalty_tiers: {
        Row: {
          id: string
          name: string
          display_name: string
          description: string
          min_points: number
          max_points: number | null
          color: string
          icon: string
          benefits: Json
          upgrade_requirements: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          description: string
          min_points: number
          max_points?: number | null
          color: string
          icon: string
          benefits?: Json
          upgrade_requirements?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          description?: string
          min_points?: number
          max_points?: number | null
          color?: string
          icon?: string
          benefits?: Json
          upgrade_requirements?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          points_cost: number
          original_value: number
          current_value: number
          image_url: string | null
          is_available: boolean
          is_limited: boolean
          max_redemptions: number | null
          current_redemptions: number
          valid_from: string
          valid_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          points_cost: number
          original_value: number
          current_value: number
          image_url?: string | null
          is_available?: boolean
          is_limited?: boolean
          max_redemptions?: number | null
          current_redemptions?: number
          valid_from: string
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          points_cost?: number
          original_value?: number
          current_value?: number
          image_url?: string | null
          is_available?: boolean
          is_limited?: boolean
          max_redemptions?: number | null
          current_redemptions?: number
          valid_from?: string
          valid_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_achievements: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          icon: string
          points_reward: number
          max_progress: number
          rarity: string
          badge_image: string | null
          trigger_type: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          icon: string
          points_reward: number
          max_progress: number
          rarity: string
          badge_image?: string | null
          trigger_type: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          icon?: string
          points_reward?: number
          max_progress?: number
          rarity?: string
          badge_image?: string | null
          trigger_type?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_challenges: {
        Row: {
          id: string
          name: string
          description: string
          challenge_type: string
          goal: number
          points_reward: number
          start_date: string
          end_date: string
          is_active: boolean
          participants: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          challenge_type: string
          goal: number
          points_reward: number
          start_date: string
          end_date: string
          is_active?: boolean
          participants?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          challenge_type?: string
          goal?: number
          points_reward?: number
          start_date?: string
          end_date?: string
          is_active?: boolean
          participants?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_loyalty_points: {
        Row: {
          id: string
          user_id: string
          balance: number
          total_earned: number
          total_redeemed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          total_earned?: number
          total_redeemed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          total_earned?: number
          total_redeemed?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_loyalty_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      points_transactions: {
        Row: {
          id: string
          user_id: string
          transaction_type: string
          amount: number
          balance: number
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          transaction_type: string
          amount: number
          balance: number
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          transaction_type?: string
          amount?: number
          balance?: number
          description?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      reward_redemptions: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          points_cost: number
          activation_code: string
          status: string
          redeemed_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          points_cost: number
          activation_code: string
          status?: string
          redeemed_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          points_cost?: number
          activation_code?: string
          status?: string
          redeemed_at?: string
          expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          }
        ]
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          is_unlocked: boolean
          unlocked_at: string | null
          progress: number
          shares_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          is_unlocked?: boolean
          unlocked_at?: string | null
          progress?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          is_unlocked?: boolean
          unlocked_at?: string | null
          progress?: number
          shares_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "loyalty_achievements"
            referencedColumns: ["id"]
          }
        ]
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          is_active: boolean
          is_completed: boolean
          current_progress: number
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          is_active?: boolean
          is_completed?: boolean
          current_progress?: number
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          is_active?: boolean
          is_completed?: boolean
          current_progress?: number
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "loyalty_challenges"
            referencedColumns: ["id"]
          }
        ]
      }
      user_streaks: {
        Row: {
          id: string
          user_id: string
          streak_type: string
          current_streak: number
          longest_streak: number
          last_activity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          streak_type: string
          current_streak?: number
          longest_streak?: number
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          streak_type?: string
          current_streak?: number
          longest_streak?: number
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string
          points: number
          tier: string
          achievements_count: number
          streak_days: number
          rank: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points: number
          tier: string
          achievements_count?: number
          streak_days?: number
          rank?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          tier?: string
          achievements_count?: number
          streak_days?: number
          rank?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      community_goals: {
        Row: {
          id: string
          name: string
          description: string
          target: number
          current_progress: number
          reward: Json
          start_date: string
          end_date: string
          is_active: boolean
          participants: number
          user_contribution: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          target: number
          current_progress?: number
          reward: Json
          start_date: string
          end_date: string
          is_active?: boolean
          participants?: number
          user_contribution?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          target?: number
          current_progress?: number
          reward?: Json
          start_date?: string
          end_date?: string
          is_active?: boolean
          participants?: number
          user_contribution?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      referral_programs: {
        Row: {
          id: string
          referrer_id: string
          referred_email: string
          referral_code: string
          conversion_value: number | null
          status: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_email: string
          referral_code: string
          conversion_value?: number | null
          status?: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_email?: string
          referral_code?: string
          conversion_value?: number | null
          status?: string
          created_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_programs_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      social_shares: {
        Row: {
          id: string
          user_id: string
          platform: string
          content_url: string | null
          share_type: string
          engagement_metrics: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          content_url?: string | null
          share_type?: string
          engagement_metrics?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          content_url?: string | null
          share_type?: string
          engagement_metrics?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      review_incentives: {
        Row: {
          id: string
          user_id: string
          platform: string
          review_id: string | null
          rating: number
          review_text: string | null
          review_url: string | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          review_id?: string | null
          rating: number
          review_text?: string | null
          review_url?: string | null
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          review_id?: string | null
          rating?: number
          review_text?: string | null
          review_url?: string | null
          verified?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_incentives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      loyalty_settings: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          push_notifications: boolean
          birthday_reminders: boolean
          achievement_alerts: boolean
          challenge_reminders: boolean
          privacy_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          push_notifications?: boolean
          birthday_reminders?: boolean
          achievement_alerts?: boolean
          challenge_reminders?: boolean
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          push_notifications?: boolean
          birthday_reminders?: boolean
          achievement_alerts?: boolean
          challenge_reminders?: boolean
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      webhook_events: {
        Row: {
          id: string
          event_type: string
          user_id: string | null
          platform: string | null
          payload: Json | null
          processed_at: string
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          user_id?: string | null
          platform?: string | null
          payload?: Json | null
          processed_at?: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          user_id?: string | null
          platform?: string | null
          payload?: Json | null
          processed_at?: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      community_goal_contributions: {
        Row: {
          id: string
          user_id: string
          goal_id: string
          contribution: number
          contributed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id: string
          contribution: number
          contributed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string
          contribution?: number
          contributed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_goal_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "community_goals"
            referencedColumns: ["id"]
          }
        ]
      }
      external_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          platform: string
          achievement_data: Json
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          platform: string
          achievement_data: Json
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          platform?: string
          achievement_data?: Json
          unlocked_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      social_engagement: {
        Row: {
          id: string
          platform: string
          engagement_type: string
          content_id: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          platform: string
          engagement_type: string
          content_id?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          platform?: string
          engagement_type?: string
          content_id?: string | null
          timestamp?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_virtual_mailbox_usage: {
        Args: {
          p_customer_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          total_actions: number
          total_cost: number
          scan_actions: number
          forward_actions: number
          shred_actions: number
        }[]
      }
      generate_adjustment_number: {
        Args: { location_code: string }
        Returns: string
      }
      generate_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: { location_code: string }
        Returns: string
      }
      generate_mail_piece_number: {
        Args: { vm_id: string }
        Returns: string
      }
      generate_po_number: {
        Args: { location_code: string }
        Returns: string
      }
      get_backup_status: {
        Args: { p_location_id?: string }
        Returns: {
          total_backups: number
          successful_backups: number
          failed_backups: number
          total_size_gb: number
          oldest_backup: string
          latest_backup: string
        }[]
      }
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
      schedule_backup: {
        Args: { p_configuration_id: string; p_job_type?: string }
        Returns: string
      }
      validate_api_key: {
        Args: { key: string }
        Returns: {
          is_valid: boolean
          location_id: string
          permissions: Json
          rate_limit_per_minute: number
        }[]
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
