export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
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
      affiliate_programs: {
        Row: {
          commission_structure: Json
          created_at: string | null
          description: string | null
          id: string
          marketing_materials: Json | null
          partner_id: string | null
          performance_metrics: Json | null
          program_name: string
          referral_tracking_code: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          commission_structure?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          marketing_materials?: Json | null
          partner_id?: string | null
          performance_metrics?: Json | null
          program_name: string
          referral_tracking_code?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          commission_structure?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          marketing_materials?: Json | null
          partner_id?: string | null
          performance_metrics?: Json | null
          program_name?: string
          referral_tracking_code?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_programs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "business_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          category: string
          confidence_score: number
          created_at: string | null
          data_points: Json | null
          description: string
          generated_by_model: string | null
          id: string
          impact_score: number
          model_version: string | null
          priority: string
          recommendations: Json | null
          resolved_at: string | null
          status: string
          subscription_id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          category: string
          confidence_score: number
          created_at?: string | null
          data_points?: Json | null
          description: string
          generated_by_model?: string | null
          id?: string
          impact_score: number
          model_version?: string | null
          priority: string
          recommendations?: Json | null
          resolved_at?: string | null
          status?: string
          subscription_id: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          category?: string
          confidence_score?: number
          created_at?: string | null
          data_points?: Json | null
          description?: string
          generated_by_model?: string | null
          id?: string
          impact_score?: number
          model_version?: string | null
          priority?: string
          recommendations?: Json | null
          resolved_at?: string | null
          status?: string
          subscription_id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_generated_by_model_fkey"
            columns: ["generated_by_model"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_alerts: {
        Row: {
          condition_config: Json
          condition_type: string
          cooldown_period_minutes: number | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          last_value: number | null
          metric_name: string
          name: string
          notification_channels: string[] | null
          notification_recipients: string[] | null
          severity: string
          subscription_id: string
          trigger_count: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          condition_config: Json
          condition_type: string
          cooldown_period_minutes?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          last_value?: number | null
          metric_name: string
          name: string
          notification_channels?: string[] | null
          notification_recipients?: string[] | null
          severity: string
          subscription_id: string
          trigger_count?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          condition_config?: Json
          condition_type?: string
          cooldown_period_minutes?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          last_value?: number | null
          metric_name?: string
          name?: string
          notification_channels?: string[] | null
          notification_recipients?: string[] | null
          severity?: string
          subscription_id?: string
          trigger_count?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_alerts_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_dashboards: {
        Row: {
          auto_refresh_interval: number | null
          category: string
          created_at: string | null
          created_by: string
          default_time_range: string | null
          description: string | null
          filters: Json | null
          id: string
          is_public: boolean | null
          last_viewed_at: string | null
          layout: Json
          name: string
          shared_with: string[] | null
          subscription_id: string
          tags: string[] | null
          updated_at: string | null
          updated_by: string | null
          user_preferences: Json | null
          view_count: number | null
        }
        Insert: {
          auto_refresh_interval?: number | null
          category: string
          created_at?: string | null
          created_by: string
          default_time_range?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          is_public?: boolean | null
          last_viewed_at?: string | null
          layout?: Json
          name: string
          shared_with?: string[] | null
          subscription_id: string
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          user_preferences?: Json | null
          view_count?: number | null
        }
        Update: {
          auto_refresh_interval?: number | null
          category?: string
          created_at?: string | null
          created_by?: string
          default_time_range?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          is_public?: boolean | null
          last_viewed_at?: string | null
          layout?: Json
          name?: string
          shared_with?: string[] | null
          subscription_id?: string
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
          user_preferences?: Json | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_dashboards_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_exports: {
        Row: {
          created_at: string | null
          created_by: string
          dashboard_id: string | null
          download_count: number | null
          download_url: string | null
          error_message: string | null
          expires_at: string
          export_type: string
          file_name: string
          file_size: number | null
          format: string
          id: string
          last_downloaded_at: string | null
          progress_percentage: number | null
          query_config: Json | null
          status: string
          subscription_id: string
          updated_at: string | null
          widget_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          dashboard_id?: string | null
          download_count?: number | null
          download_url?: string | null
          error_message?: string | null
          expires_at: string
          export_type: string
          file_name: string
          file_size?: number | null
          format: string
          id?: string
          last_downloaded_at?: string | null
          progress_percentage?: number | null
          query_config?: Json | null
          status?: string
          subscription_id: string
          updated_at?: string | null
          widget_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          dashboard_id?: string | null
          download_count?: number | null
          download_url?: string | null
          error_message?: string | null
          expires_at?: string
          export_type?: string
          file_name?: string
          file_size?: number | null
          format?: string
          id?: string
          last_downloaded_at?: string | null
          progress_percentage?: number | null
          query_config?: Json | null
          status?: string
          subscription_id?: string
          updated_at?: string | null
          widget_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_exports_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "analytics_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_exports_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_exports_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "analytics_widgets"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_query_cache: {
        Row: {
          created_at: string | null
          data_size_bytes: number | null
          execution_time_ms: number | null
          expires_at: string
          hit_count: number | null
          id: string
          last_accessed_at: string | null
          query_config: Json
          query_hash: string
          result_data: Json
          result_metadata: Json | null
          subscription_id: string
        }
        Insert: {
          created_at?: string | null
          data_size_bytes?: number | null
          execution_time_ms?: number | null
          expires_at: string
          hit_count?: number | null
          id?: string
          last_accessed_at?: string | null
          query_config: Json
          query_hash: string
          result_data: Json
          result_metadata?: Json | null
          subscription_id: string
        }
        Update: {
          created_at?: string | null
          data_size_bytes?: number | null
          execution_time_ms?: number | null
          expires_at?: string
          hit_count?: number | null
          id?: string
          last_accessed_at?: string | null
          query_config?: Json
          query_hash?: string
          result_data?: Json
          result_metadata?: Json | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_query_cache_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_user_preferences: {
        Row: {
          alert_notifications_enabled: boolean | null
          animation_enabled: boolean | null
          auto_refresh_enabled: boolean | null
          created_at: string | null
          currency_format: string | null
          custom_preferences: Json | null
          date_format: string | null
          default_dashboard_id: string | null
          default_refresh_interval: number | null
          email_frequency: string | null
          email_reports_enabled: boolean | null
          id: string
          number_format: string | null
          preferred_chart_colors: string[] | null
          preferred_time_range: string | null
          subscription_id: string
          theme_preference: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_notifications_enabled?: boolean | null
          animation_enabled?: boolean | null
          auto_refresh_enabled?: boolean | null
          created_at?: string | null
          currency_format?: string | null
          custom_preferences?: Json | null
          date_format?: string | null
          default_dashboard_id?: string | null
          default_refresh_interval?: number | null
          email_frequency?: string | null
          email_reports_enabled?: boolean | null
          id?: string
          number_format?: string | null
          preferred_chart_colors?: string[] | null
          preferred_time_range?: string | null
          subscription_id: string
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_notifications_enabled?: boolean | null
          animation_enabled?: boolean | null
          auto_refresh_enabled?: boolean | null
          created_at?: string | null
          currency_format?: string | null
          custom_preferences?: Json | null
          date_format?: string | null
          default_dashboard_id?: string | null
          default_refresh_interval?: number | null
          email_frequency?: string | null
          email_reports_enabled?: boolean | null
          id?: string
          number_format?: string | null
          preferred_chart_colors?: string[] | null
          preferred_time_range?: string | null
          subscription_id?: string
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_preferences_default_dashboard_id_fkey"
            columns: ["default_dashboard_id"]
            isOneToOne: false
            referencedRelation: "analytics_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_user_preferences_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_widgets: {
        Row: {
          auto_refresh: boolean | null
          click_actions: Json | null
          conditional_formatting: Json | null
          created_at: string | null
          dashboard_id: string
          data_source: Json
          description: string | null
          dimensions: Json | null
          drill_down_enabled: boolean | null
          filters: Json | null
          id: string
          metrics: Json
          position: Json
          refresh_interval: number | null
          subscription_id: string
          title: string
          type: string
          updated_at: string | null
          visualization_config: Json | null
        }
        Insert: {
          auto_refresh?: boolean | null
          click_actions?: Json | null
          conditional_formatting?: Json | null
          created_at?: string | null
          dashboard_id: string
          data_source?: Json
          description?: string | null
          dimensions?: Json | null
          drill_down_enabled?: boolean | null
          filters?: Json | null
          id?: string
          metrics?: Json
          position?: Json
          refresh_interval?: number | null
          subscription_id: string
          title: string
          type: string
          updated_at?: string | null
          visualization_config?: Json | null
        }
        Update: {
          auto_refresh?: boolean | null
          click_actions?: Json | null
          conditional_formatting?: Json | null
          created_at?: string | null
          dashboard_id?: string
          data_source?: Json
          description?: string | null
          dimensions?: Json | null
          drill_down_enabled?: boolean | null
          filters?: Json | null
          id?: string
          metrics?: Json
          position?: Json
          refresh_interval?: number | null
          subscription_id?: string
          title?: string
          type?: string
          updated_at?: string | null
          visualization_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "analytics_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_widgets_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      business_intelligence_metrics: {
        Row: {
          communication_effectiveness: Json | null
          computed_at: string | null
          customer_intelligence: Json | null
          executive_kpis: Json | null
          financial_performance: Json | null
          id: string
          operational_metrics: Json | null
          package_analytics: Json | null
          period_end: string
          period_start: string
          predictive_insights: Json | null
          subscription_id: string
        }
        Insert: {
          communication_effectiveness?: Json | null
          computed_at?: string | null
          customer_intelligence?: Json | null
          executive_kpis?: Json | null
          financial_performance?: Json | null
          id?: string
          operational_metrics?: Json | null
          package_analytics?: Json | null
          period_end: string
          period_start: string
          predictive_insights?: Json | null
          subscription_id: string
        }
        Update: {
          communication_effectiveness?: Json | null
          computed_at?: string | null
          customer_intelligence?: Json | null
          executive_kpis?: Json | null
          financial_performance?: Json | null
          id?: string
          operational_metrics?: Json | null
          package_analytics?: Json | null
          period_end?: string
          period_start?: string
          predictive_insights?: Json | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_intelligence_metrics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      business_partners: {
        Row: {
          address: Json | null
          commission_rate: number | null
          contact_person: Json
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          performance_score: number | null
          rating: number | null
          revenue_generated: number | null
          status: string
          type: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          commission_rate?: number | null
          contact_person?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          performance_score?: number | null
          rating?: number | null
          revenue_generated?: number | null
          status?: string
          type: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          commission_rate?: number | null
          contact_person?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          performance_score?: number | null
          rating?: number | null
          revenue_generated?: number | null
          status?: string
          type?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      carbon_footprint: {
        Row: {
          carbon_offset: number | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          net_footprint: number | null
          source: string
          unit: string
          updated_at: string | null
          value: number
        }
        Insert: {
          carbon_offset?: number | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          net_footprint?: number | null
          source: string
          unit?: string
          updated_at?: string | null
          value: number
        }
        Update: {
          carbon_offset?: number | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          net_footprint?: number | null
          source?: string
          unit?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      carbon_offset_programs: {
        Row: {
          cost_per_kg: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          offset_amount_kg: number | null
          start_date: string | null
          status: string | null
          total_cost: number | null
          updated_at: string | null
        }
        Insert: {
          cost_per_kg?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          offset_amount_kg?: number | null
          start_date?: string | null
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          cost_per_kg?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          offset_amount_kg?: number | null
          start_date?: string | null
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
      collaboration_chat: {
        Row: {
          created_at: string | null
          id: string
          message_content: string
          session_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_content: string
          session_id: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_content?: string
          session_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_chat_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "collaboration_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_sessions: {
        Row: {
          created_at: string | null
          current_participants: number | null
          ended_at: string | null
          host_user_id: string
          id: string
          max_participants: number | null
          project_id: string
          session_name: string | null
          session_type: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          ended_at?: string | null
          host_user_id: string
          id?: string
          max_participants?: number | null
          project_id: string
          session_name?: string | null
          session_type?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          ended_at?: string | null
          host_user_id?: string
          id?: string
          max_participants?: number | null
          project_id?: string
          session_name?: string | null
          session_type?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_workflows: {
        Row: {
          created_at: string | null
          description: string | null
          documents: Json | null
          end_date: string | null
          id: string
          milestones: Json | null
          name: string
          participants: Json
          progress: number | null
          start_date: string
          status: string
          tasks: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          name: string
          participants?: Json
          progress?: number | null
          start_date: string
          status?: string
          tasks?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          name?: string
          participants?: Json
          progress?: number | null
          start_date?: string
          status?: string
          tasks?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      communication_analytics: {
        Row: {
          average_delivery_time_minutes: number | null
          best_performing_template_id: string | null
          channel_metrics: Json | null
          computed_at: string | null
          cost_per_channel: Json | null
          id: string
          peak_sending_hour: number | null
          period_end: string
          period_start: string
          segment_metrics: Json | null
          subscription_id: string
          total_bounced: number | null
          total_clicked: number | null
          total_cost: number | null
          total_delivered: number | null
          total_failed: number | null
          total_opened: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          type_metrics: Json | null
          worst_performing_template_id: string | null
        }
        Insert: {
          average_delivery_time_minutes?: number | null
          best_performing_template_id?: string | null
          channel_metrics?: Json | null
          computed_at?: string | null
          cost_per_channel?: Json | null
          id?: string
          peak_sending_hour?: number | null
          period_end: string
          period_start: string
          segment_metrics?: Json | null
          subscription_id: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_cost?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          type_metrics?: Json | null
          worst_performing_template_id?: string | null
        }
        Update: {
          average_delivery_time_minutes?: number | null
          best_performing_template_id?: string | null
          channel_metrics?: Json | null
          computed_at?: string | null
          cost_per_channel?: Json | null
          id?: string
          peak_sending_hour?: number | null
          period_end?: string
          period_start?: string
          segment_metrics?: Json | null
          subscription_id?: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_cost?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          type_metrics?: Json | null
          worst_performing_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_analytics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_providers: {
        Row: {
          channel: string
          configuration: Json
          cost_per_message: number | null
          created_at: string | null
          created_by: string
          currency: string | null
          health_status: string | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          last_health_check: string | null
          last_message_sent_at: string | null
          messages_sent_this_month: number | null
          messages_sent_today: number | null
          priority: number | null
          provider_name: string
          rate_limit_per_day: number | null
          rate_limit_per_hour: number | null
          rate_limit_per_minute: number | null
          subscription_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          channel: string
          configuration?: Json
          cost_per_message?: number | null
          created_at?: string | null
          created_by: string
          currency?: string | null
          health_status?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          last_health_check?: string | null
          last_message_sent_at?: string | null
          messages_sent_this_month?: number | null
          messages_sent_today?: number | null
          priority?: number | null
          provider_name: string
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
          subscription_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          channel?: string
          configuration?: Json
          cost_per_message?: number | null
          created_at?: string | null
          created_by?: string
          currency?: string | null
          health_status?: string | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          last_health_check?: string | null
          last_message_sent_at?: string | null
          messages_sent_this_month?: number | null
          messages_sent_today?: number | null
          priority?: number | null
          provider_name?: string
          rate_limit_per_day?: number | null
          rate_limit_per_hour?: number | null
          rate_limit_per_minute?: number | null
          subscription_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_providers_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          category: string
          channel: string
          content: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          language: string
          last_used_at: string | null
          name: string
          send_delay_minutes: number | null
          subject: string | null
          subscription_id: string
          trigger_conditions: Json | null
          type: string
          updated_at: string | null
          updated_by: string | null
          usage_count: number | null
          variables: Json | null
          variants: Json | null
          version: number | null
        }
        Insert: {
          category: string
          channel: string
          content: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          language?: string
          last_used_at?: string | null
          name: string
          send_delay_minutes?: number | null
          subject?: string | null
          subscription_id: string
          trigger_conditions?: Json | null
          type: string
          updated_at?: string | null
          updated_by?: string | null
          usage_count?: number | null
          variables?: Json | null
          variants?: Json | null
          version?: number | null
        }
        Update: {
          category?: string
          channel?: string
          content?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          language?: string
          last_used_at?: string | null
          name?: string
          send_delay_minutes?: number | null
          subject?: string | null
          subscription_id?: string
          trigger_conditions?: Json | null
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          usage_count?: number | null
          variables?: Json | null
          variants?: Json | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_templates_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          customer_id: string | null
          error_message: string | null
          id: string
          max_retries: number | null
          next_step_at: string | null
          retry_count: number | null
          started_at: string | null
          status: string | null
          subscription_id: string | null
          trigger_data: Json | null
          updated_at: string | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          next_step_at?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          subscription_id?: string | null
          trigger_data?: Json | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          next_step_at?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
          subscription_id?: string | null
          trigger_data?: Json | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_workflow_executions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_workflow_executions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "communication_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_workflows: {
        Row: {
          cooldown_period_hours: number | null
          created_at: string | null
          created_by: string
          description: string | null
          execution_count: number | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          max_executions_per_customer: number | null
          name: string
          steps: Json
          subscription_id: string
          success_count: number | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cooldown_period_hours?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          execution_count?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          max_executions_per_customer?: number | null
          name: string
          steps?: Json
          subscription_id: string
          success_count?: number | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cooldown_period_hours?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          execution_count?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          max_executions_per_customer?: number | null
          name?: string
          steps?: Json
          subscription_id?: string
          success_count?: number | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_workflows_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_goals: {
        Row: {
          created_at: string | null
          current_progress: number
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          reward_description: string | null
          reward_type: string
          reward_value: number
          start_date: string
          target: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_progress?: number
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          reward_description?: string | null
          reward_type: string
          reward_value: number
          start_date: string
          target: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_progress?: number
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          reward_description?: string | null
          reward_type?: string
          reward_value?: number
          start_date?: string
          target?: number
          updated_at?: string | null
        }
        Relationships: []
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
      consolidated_shipping: {
        Row: {
          carbon_saved_kg: number | null
          cost_savings: number | null
          created_at: string | null
          delivery_date: string | null
          destination: string | null
          id: string
          origin: string | null
          packages_consolidated: number | null
          shipment_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          delivery_date?: string | null
          destination?: string | null
          id?: string
          origin?: string | null
          packages_consolidated?: number | null
          shipment_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          delivery_date?: string | null
          destination?: string | null
          id?: string
          origin?: string | null
          packages_consolidated?: number | null
          shipment_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_analytics: {
        Row: {
          avg_package_value: number | null
          avg_packages_per_month: number | null
          avg_session_duration: number | null
          churn_probability: number | null
          complaints: number | null
          computed_at: string | null
          customer_id: string
          days_since_last_package: number | null
          emails_clicked: number | null
          emails_opened: number | null
          emails_sent: number | null
          engagement_score: number | null
          id: string
          last_login_at: string | null
          lifetime_value: number | null
          monthly_spend: number | null
          nps_score: number | null
          packages_last_month: number | null
          packages_this_month: number | null
          risk_score: number | null
          satisfaction_score: number | null
          sms_delivered: number | null
          sms_sent: number | null
          subscription_id: string
          support_tickets: number | null
          total_logins: number | null
          total_packages: number | null
          total_spend: number | null
        }
        Insert: {
          avg_package_value?: number | null
          avg_packages_per_month?: number | null
          avg_session_duration?: number | null
          churn_probability?: number | null
          complaints?: number | null
          computed_at?: string | null
          customer_id: string
          days_since_last_package?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          engagement_score?: number | null
          id?: string
          last_login_at?: string | null
          lifetime_value?: number | null
          monthly_spend?: number | null
          nps_score?: number | null
          packages_last_month?: number | null
          packages_this_month?: number | null
          risk_score?: number | null
          satisfaction_score?: number | null
          sms_delivered?: number | null
          sms_sent?: number | null
          subscription_id: string
          support_tickets?: number | null
          total_logins?: number | null
          total_packages?: number | null
          total_spend?: number | null
        }
        Update: {
          avg_package_value?: number | null
          avg_packages_per_month?: number | null
          avg_session_duration?: number | null
          churn_probability?: number | null
          complaints?: number | null
          computed_at?: string | null
          customer_id?: string
          days_since_last_package?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          engagement_score?: number | null
          id?: string
          last_login_at?: string | null
          lifetime_value?: number | null
          monthly_spend?: number | null
          nps_score?: number | null
          packages_last_month?: number | null
          packages_this_month?: number | null
          risk_score?: number | null
          satisfaction_score?: number | null
          sms_delivered?: number | null
          sms_sent?: number | null
          subscription_id?: string
          support_tickets?: number | null
          total_logins?: number | null
          total_packages?: number | null
          total_spend?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_analytics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_analytics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
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
      customer_communications: {
        Row: {
          automation_id: string | null
          channel: string
          content: string
          created_at: string | null
          created_by: string | null
          customer_id: string
          delivered_at: string | null
          event_data: Json | null
          external_id: string | null
          failed_reason: string | null
          id: string
          max_retries: number | null
          metadata: Json | null
          priority: string | null
          provider: string | null
          read_at: string | null
          recipient_email: string | null
          recipient_phone: string | null
          recipient_whatsapp: string | null
          retry_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string | null
          subscription_id: string | null
          template_id: string | null
          tracking_data: Json | null
          triggered_by: string
          type: string
        }
        Insert: {
          automation_id?: string | null
          channel: string
          content: string
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          delivered_at?: string | null
          event_data?: Json | null
          external_id?: string | null
          failed_reason?: string | null
          id?: string
          max_retries?: number | null
          metadata?: Json | null
          priority?: string | null
          provider?: string | null
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          recipient_whatsapp?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          subscription_id?: string | null
          template_id?: string | null
          tracking_data?: Json | null
          triggered_by?: string
          type: string
        }
        Update: {
          automation_id?: string | null
          channel?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          delivered_at?: string | null
          event_data?: Json | null
          external_id?: string | null
          failed_reason?: string | null
          id?: string
          max_retries?: number | null
          metadata?: Json | null
          priority?: string | null
          provider?: string | null
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          recipient_whatsapp?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          subscription_id?: string | null
          template_id?: string | null
          tracking_data?: Json | null
          triggered_by?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      customer_engagement_metrics: {
        Row: {
          churn_risk_score: number | null
          created_at: string | null
          customer_id: string | null
          emails_clicked: number | null
          emails_opened: number | null
          engagement_score: number | null
          feature_usage_count: Json | null
          features_used: string[] | null
          id: string
          last_login_at: string | null
          login_count: number | null
          period_end: string | null
          period_start: string | null
          session_duration_minutes: number | null
          sms_responded: number | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          churn_risk_score?: number | null
          created_at?: string | null
          customer_id?: string | null
          emails_clicked?: number | null
          emails_opened?: number | null
          engagement_score?: number | null
          feature_usage_count?: Json | null
          features_used?: string[] | null
          id?: string
          last_login_at?: string | null
          login_count?: number | null
          period_end?: string | null
          period_start?: string | null
          session_duration_minutes?: number | null
          sms_responded?: number | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          churn_risk_score?: number | null
          created_at?: string | null
          customer_id?: string | null
          emails_clicked?: number | null
          emails_opened?: number | null
          engagement_score?: number | null
          feature_usage_count?: Json | null
          features_used?: string[] | null
          id?: string
          last_login_at?: string | null
          login_count?: number | null
          period_end?: string | null
          period_start?: string | null
          session_duration_minutes?: number | null
          sms_responded?: number | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_engagement_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_engagement_metrics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_feedback: {
        Row: {
          assigned_to: string | null
          category: string | null
          comment: string | null
          created_at: string | null
          customer_id: string
          id: string
          metadata: Json | null
          priority: string
          rating: number | null
          related_package_id: string | null
          related_service: string | null
          resolution_notes: string | null
          resolved_at: string | null
          response: string | null
          source: string
          status: string
          subscription_id: string
          triggered_by: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          metadata?: Json | null
          priority?: string
          rating?: number | null
          related_package_id?: string | null
          related_service?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          response?: string | null
          source: string
          status?: string
          subscription_id: string
          triggered_by?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          metadata?: Json | null
          priority?: string
          rating?: number | null
          related_package_id?: string | null
          related_service?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          response?: string | null
          source?: string
          status?: string
          subscription_id?: string
          triggered_by?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_feedback_related_package_id_fkey"
            columns: ["related_package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_feedback_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_intelligence_profiles: {
        Row: {
          communication_preferences: Json | null
          confidence_score: number | null
          created_at: string | null
          customer_id: string
          customer_segment: string | null
          engagement_level: string | null
          fraud_risk_score: number | null
          id: string
          last_analyzed_at: string | null
          model_version: string | null
          package_frequency: number | null
          payment_risk_score: number | null
          peak_activity_hours: number[] | null
          personalized_offers: string[] | null
          predicted_churn_probability: number | null
          predicted_lifetime_value: number | null
          preferred_carriers: string[] | null
          risk_factors: string[] | null
          satisfaction_score: number | null
          seasonal_patterns: Json | null
          service_recommendations: string[] | null
          subscription_id: string
          tier_recommendation: string | null
          updated_at: string | null
          upsell_opportunities: string[] | null
        }
        Insert: {
          communication_preferences?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          customer_id: string
          customer_segment?: string | null
          engagement_level?: string | null
          fraud_risk_score?: number | null
          id?: string
          last_analyzed_at?: string | null
          model_version?: string | null
          package_frequency?: number | null
          payment_risk_score?: number | null
          peak_activity_hours?: number[] | null
          personalized_offers?: string[] | null
          predicted_churn_probability?: number | null
          predicted_lifetime_value?: number | null
          preferred_carriers?: string[] | null
          risk_factors?: string[] | null
          satisfaction_score?: number | null
          seasonal_patterns?: Json | null
          service_recommendations?: string[] | null
          subscription_id: string
          tier_recommendation?: string | null
          updated_at?: string | null
          upsell_opportunities?: string[] | null
        }
        Update: {
          communication_preferences?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          customer_id?: string
          customer_segment?: string | null
          engagement_level?: string | null
          fraud_risk_score?: number | null
          id?: string
          last_analyzed_at?: string | null
          model_version?: string | null
          package_frequency?: number | null
          payment_risk_score?: number | null
          peak_activity_hours?: number[] | null
          personalized_offers?: string[] | null
          predicted_churn_probability?: number | null
          predicted_lifetime_value?: number | null
          preferred_carriers?: string[] | null
          risk_factors?: string[] | null
          satisfaction_score?: number | null
          seasonal_patterns?: Json | null
          service_recommendations?: string[] | null
          subscription_id?: string
          tier_recommendation?: string | null
          updated_at?: string | null
          upsell_opportunities?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_intelligence_profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_intelligence_profiles_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_lifecycle_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string
          event_type: string
          from_stage: string | null
          id: string
          notes: string | null
          subscription_id: string | null
          to_stage: string
          trigger_data: Json | null
          triggered_by: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          event_type: string
          from_stage?: string | null
          id?: string
          notes?: string | null
          subscription_id?: string | null
          to_stage: string
          trigger_data?: Json | null
          triggered_by?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          event_type?: string
          from_stage?: string | null
          id?: string
          notes?: string | null
          subscription_id?: string | null
          to_stage?: string
          trigger_data?: Json | null
          triggered_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_lifecycle_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_lifecycle_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      customer_onboarding: {
        Row: {
          abandoned_at: string | null
          automated_reminders_enabled: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          current_step: number | null
          customer_id: string
          estimated_completion_date: string | null
          id: string
          last_reminder_sent_at: string | null
          next_step: Json | null
          started_at: string | null
          status: string
          steps_completed: Json | null
          subscription_id: string
          total_steps: number | null
          updated_at: string | null
        }
        Insert: {
          abandoned_at?: string | null
          automated_reminders_enabled?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: number | null
          customer_id: string
          estimated_completion_date?: string | null
          id?: string
          last_reminder_sent_at?: string | null
          next_step?: Json | null
          started_at?: string | null
          status?: string
          steps_completed?: Json | null
          subscription_id: string
          total_steps?: number | null
          updated_at?: string | null
        }
        Update: {
          abandoned_at?: string | null
          automated_reminders_enabled?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_step?: number | null
          customer_id?: string
          estimated_completion_date?: string | null
          id?: string
          last_reminder_sent_at?: string | null
          next_step?: Json | null
          started_at?: string | null
          status?: string
          steps_completed?: Json | null
          subscription_id?: string
          total_steps?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_onboarding_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_onboarding_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_participation: {
        Row: {
          carbon_saved_kg: number | null
          created_at: string | null
          customer_id: string | null
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          initiative_name: string
          participation_date: string | null
          participation_type: string | null
          updated_at: string | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          created_at?: string | null
          customer_id?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          initiative_name: string
          participation_date?: string | null
          participation_type?: string | null
          updated_at?: string | null
        }
        Update: {
          carbon_saved_kg?: number | null
          created_at?: string | null
          customer_id?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          initiative_name?: string
          participation_date?: string | null
          participation_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_segments: {
        Row: {
          automation_enabled: boolean | null
          automation_rules: Json | null
          created_at: string | null
          created_by: string
          criteria: Json
          customer_count: number | null
          description: string | null
          id: string
          is_dynamic: boolean | null
          last_updated_at: string | null
          name: string
          subscription_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          automation_enabled?: boolean | null
          automation_rules?: Json | null
          created_at?: string | null
          created_by: string
          criteria?: Json
          customer_count?: number | null
          description?: string | null
          id?: string
          is_dynamic?: boolean | null
          last_updated_at?: string | null
          name: string
          subscription_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          automation_enabled?: boolean | null
          automation_rules?: Json | null
          created_at?: string | null
          created_by?: string
          criteria?: Json
          customer_count?: number | null
          description?: string | null
          id?: string
          is_dynamic?: boolean | null
          last_updated_at?: string | null
          name?: string
          subscription_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_segments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
          communication_preferences: Json | null
          country: string
          created_at: string
          created_by: string | null
          customer_tier: string | null
          customer_type: string
          dedicated_support_contact: string | null
          email: string
          express_handling: boolean | null
          first_name: string
          id: string
          last_activity_at: string | null
          last_name: string
          lifecycle_stage: string | null
          lifetime_value: number | null
          location_id: string | null
          loyalty_points: number | null
          mailbox_number: string
          notes: string | null
          onboarding_completed: boolean | null
          phone: string | null
          priority_notification: boolean | null
          referral_source: string | null
          risk_score: number | null
          satisfaction_score: number | null
          segmentation_tags: string[] | null
          special_pricing_tier: string | null
          state: string
          status: string
          subscription_id: string | null
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
          communication_preferences?: Json | null
          country?: string
          created_at?: string
          created_by?: string | null
          customer_tier?: string | null
          customer_type?: string
          dedicated_support_contact?: string | null
          email: string
          express_handling?: boolean | null
          first_name: string
          id?: string
          last_activity_at?: string | null
          last_name: string
          lifecycle_stage?: string | null
          lifetime_value?: number | null
          location_id?: string | null
          loyalty_points?: number | null
          mailbox_number: string
          notes?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          priority_notification?: boolean | null
          referral_source?: string | null
          risk_score?: number | null
          satisfaction_score?: number | null
          segmentation_tags?: string[] | null
          special_pricing_tier?: string | null
          state?: string
          status?: string
          subscription_id?: string | null
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
          communication_preferences?: Json | null
          country?: string
          created_at?: string
          created_by?: string | null
          customer_tier?: string | null
          customer_type?: string
          dedicated_support_contact?: string | null
          email?: string
          express_handling?: boolean | null
          first_name?: string
          id?: string
          last_activity_at?: string | null
          last_name?: string
          lifecycle_stage?: string | null
          lifetime_value?: number | null
          location_id?: string | null
          loyalty_points?: number | null
          mailbox_number?: string
          notes?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          priority_notification?: boolean | null
          referral_source?: string | null
          risk_score?: number | null
          satisfaction_score?: number | null
          segmentation_tags?: string[] | null
          special_pricing_tier?: string | null
          state?: string
          status?: string
          subscription_id?: string | null
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
          {
            foreignKeyName: "customers_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
          customer_notified: boolean | null
          delivery_fee: number | null
          delivery_method: string | null
          delivery_notes: string | null
          delivery_proof: Json | null
          delivery_type: string | null
          delivery_window_end: string | null
          delivery_window_start: string | null
          driver_name: string | null
          driver_phone: string | null
          estimated_delivery_time: string | null
          id: string
          max_attempts: number | null
          package_id: string
          photo_proof: string | null
          priority: number | null
          recipient_name: string | null
          recipient_relationship: string | null
          route_id: string | null
          signature_captured: string | null
          signature_required: boolean | null
          special_instructions: string | null
          state: string
          status: string
          subscription_id: string | null
          tip_amount: number | null
          total_cost: number | null
          tracking_url: string | null
          updated_at: string
          updated_by: string | null
          vehicle_info: string | null
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
          customer_notified?: boolean | null
          delivery_fee?: number | null
          delivery_method?: string | null
          delivery_notes?: string | null
          delivery_proof?: Json | null
          delivery_type?: string | null
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          estimated_delivery_time?: string | null
          id?: string
          max_attempts?: number | null
          package_id: string
          photo_proof?: string | null
          priority?: number | null
          recipient_name?: string | null
          recipient_relationship?: string | null
          route_id?: string | null
          signature_captured?: string | null
          signature_required?: boolean | null
          special_instructions?: string | null
          state?: string
          status?: string
          subscription_id?: string | null
          tip_amount?: number | null
          total_cost?: number | null
          tracking_url?: string | null
          updated_at?: string
          updated_by?: string | null
          vehicle_info?: string | null
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
          customer_notified?: boolean | null
          delivery_fee?: number | null
          delivery_method?: string | null
          delivery_notes?: string | null
          delivery_proof?: Json | null
          delivery_type?: string | null
          delivery_window_end?: string | null
          delivery_window_start?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          estimated_delivery_time?: string | null
          id?: string
          max_attempts?: number | null
          package_id?: string
          photo_proof?: string | null
          priority?: number | null
          recipient_name?: string | null
          recipient_relationship?: string | null
          route_id?: string | null
          signature_captured?: string | null
          signature_required?: boolean | null
          special_instructions?: string | null
          state?: string
          status?: string
          subscription_id?: string | null
          tip_amount?: number | null
          total_cost?: number | null
          tracking_url?: string | null
          updated_at?: string
          updated_by?: string | null
          vehicle_info?: string | null
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
          {
            foreignKeyName: "deliveries_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      eco_friendly_packaging: {
        Row: {
          carbon_saved_kg: number | null
          cost_savings: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          material_type: string | null
          name: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          material_type?: string | null
          name: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          material_type?: string | null
          name?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      efficiency_improvements: {
        Row: {
          carbon_saved_kg: number | null
          cost_savings: number | null
          created_at: string | null
          description: string | null
          energy_saved_kwh: number | null
          id: string
          implementation_date: string | null
          improvement_type: string
          is_active: boolean | null
          payback_period_months: number | null
          updated_at: string | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          energy_saved_kwh?: number | null
          id?: string
          implementation_date?: string | null
          improvement_type: string
          is_active?: boolean | null
          payback_period_months?: number | null
          updated_at?: string | null
        }
        Update: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          energy_saved_kwh?: number | null
          id?: string
          implementation_date?: string | null
          improvement_type?: string
          is_active?: boolean | null
          payback_period_months?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      electric_vehicles: {
        Row: {
          battery_capacity_kwh: number | null
          carbon_saved_kg: number | null
          charging_sessions: number | null
          created_at: string | null
          distance_traveled_km: number | null
          id: string
          is_active: boolean | null
          model: string | null
          range_km: number | null
          updated_at: string | null
          vehicle_id: string
          vehicle_type: string | null
        }
        Insert: {
          battery_capacity_kwh?: number | null
          carbon_saved_kg?: number | null
          charging_sessions?: number | null
          created_at?: string | null
          distance_traveled_km?: number | null
          id?: string
          is_active?: boolean | null
          model?: string | null
          range_km?: number | null
          updated_at?: string | null
          vehicle_id: string
          vehicle_type?: string | null
        }
        Update: {
          battery_capacity_kwh?: number | null
          carbon_saved_kg?: number | null
          charging_sessions?: number | null
          created_at?: string | null
          distance_traveled_km?: number | null
          id?: string
          is_active?: boolean | null
          model?: string | null
          range_km?: number | null
          updated_at?: string | null
          vehicle_id?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      energy_consumption: {
        Row: {
          carbon_footprint: number | null
          consumption: number
          cost: number | null
          created_at: string | null
          date: string
          id: string
          location: string | null
          source: string
          unit: string
        }
        Insert: {
          carbon_footprint?: number | null
          consumption: number
          cost?: number | null
          created_at?: string | null
          date: string
          id?: string
          location?: string | null
          source: string
          unit?: string
        }
        Update: {
          carbon_footprint?: number | null
          consumption?: number
          cost?: number | null
          created_at?: string | null
          date?: string
          id?: string
          location?: string | null
          source?: string
          unit?: string
        }
        Relationships: []
      }
      energy_usage_trends: {
        Row: {
          carbon_emissions_kg: number | null
          cost: number | null
          created_at: string | null
          date: string
          id: string
          non_renewable_usage_kwh: number | null
          renewable_usage_kwh: number | null
          total_usage_kwh: number | null
          updated_at: string | null
        }
        Insert: {
          carbon_emissions_kg?: number | null
          cost?: number | null
          created_at?: string | null
          date: string
          id?: string
          non_renewable_usage_kwh?: number | null
          renewable_usage_kwh?: number | null
          total_usage_kwh?: number | null
          updated_at?: string | null
        }
        Update: {
          carbon_emissions_kg?: number | null
          cost?: number | null
          created_at?: string | null
          date?: string
          id?: string
          non_renewable_usage_kwh?: number | null
          renewable_usage_kwh?: number | null
          total_usage_kwh?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      environment_config: {
        Row: {
          config_key: string
          config_value: string
          created_at: string | null
          environment: string
          id: number
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: string
          created_at?: string | null
          environment: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string
          created_at?: string | null
          environment?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      environmental_education: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          impact_score: number | null
          is_active: boolean | null
          materials_created: number | null
          participants_count: number | null
          program_name: string
          sessions_conducted: number | null
          start_date: string | null
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          impact_score?: number | null
          is_active?: boolean | null
          materials_created?: number | null
          participants_count?: number | null
          program_name: string
          sessions_conducted?: number | null
          start_date?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          impact_score?: number | null
          is_active?: boolean | null
          materials_created?: number | null
          participants_count?: number | null
          program_name?: string
          sessions_conducted?: number | null
          start_date?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      environmental_visualizations: {
        Row: {
          config: Json | null
          created_at: string | null
          data: Json
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          visualization_type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          data: Json
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          visualization_type: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          data?: Json
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          visualization_type?: string
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
      green_badges: {
        Row: {
          category: string
          created_at: string | null
          criteria: Json | null
          description: string | null
          earned_date: string
          icon: string | null
          id: string
          impact: number | null
          level: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          earned_date: string
          icon?: string | null
          id?: string
          impact?: number | null
          level: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          earned_date?: string
          icon?: string | null
          id?: string
          impact?: number | null
          level?: string
          name?: string
        }
        Relationships: []
      }
      green_certifications: {
        Row: {
          certification_date: string | null
          certification_level: string | null
          certification_name: string
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          issuing_organization: string | null
          updated_at: string | null
        }
        Insert: {
          certification_date?: string | null
          certification_level?: string | null
          certification_name: string
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          issuing_organization?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_date?: string | null
          certification_level?: string | null
          certification_name?: string
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          issuing_organization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      green_initiatives: {
        Row: {
          budget: number | null
          carbon_reduction: number | null
          category: string
          cost_savings: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          energy_savings: number | null
          id: string
          name: string
          participants: Json | null
          spent: number | null
          start_date: string
          status: string
          updated_at: string | null
          waste_reduction: number | null
        }
        Insert: {
          budget?: number | null
          carbon_reduction?: number | null
          category: string
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          energy_savings?: number | null
          id?: string
          name: string
          participants?: Json | null
          spent?: number | null
          start_date: string
          status?: string
          updated_at?: string | null
          waste_reduction?: number | null
        }
        Update: {
          budget?: number | null
          carbon_reduction?: number | null
          category?: string
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          energy_savings?: number | null
          id?: string
          name?: string
          participants?: Json | null
          spent?: number | null
          start_date?: string
          status?: string
          updated_at?: string | null
          waste_reduction?: number | null
        }
        Relationships: []
      }
      impact_report: {
        Row: {
          challenges: string | null
          created_at: string | null
          highlights: string | null
          id: string
          next_steps: string | null
          report_date: string | null
          report_period: string
          sustainability_score: number | null
          total_carbon_saved_kg: number | null
          total_cost_savings: number | null
          total_people_reached: number | null
          total_trees_planted: number | null
          updated_at: string | null
        }
        Insert: {
          challenges?: string | null
          created_at?: string | null
          highlights?: string | null
          id?: string
          next_steps?: string | null
          report_date?: string | null
          report_period: string
          sustainability_score?: number | null
          total_carbon_saved_kg?: number | null
          total_cost_savings?: number | null
          total_people_reached?: number | null
          total_trees_planted?: number | null
          updated_at?: string | null
        }
        Update: {
          challenges?: string | null
          created_at?: string | null
          highlights?: string | null
          id?: string
          next_steps?: string | null
          report_date?: string | null
          report_period?: string
          sustainability_score?: number | null
          total_carbon_saved_kg?: number | null
          total_cost_savings?: number | null
          total_people_reached?: number | null
          total_trees_planted?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      initiative_milestones: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          initiative_id: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          initiative_id?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          initiative_id?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "initiative_milestones_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "green_initiatives"
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
      integration_partners: {
        Row: {
          api_key: string | null
          api_secret: string | null
          api_status: string
          created_at: string | null
          current_usage: Json | null
          documentation_url: string | null
          id: string
          partner_id: string | null
          sla_terms: Json | null
          support_tickets: Json | null
          updated_at: string | null
          usage_limits: Json | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          api_status?: string
          created_at?: string | null
          current_usage?: Json | null
          documentation_url?: string | null
          id?: string
          partner_id?: string | null
          sla_terms?: Json | null
          support_tickets?: Json | null
          updated_at?: string | null
          usage_limits?: Json | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          api_status?: string
          created_at?: string | null
          current_usage?: Json | null
          documentation_url?: string | null
          id?: string
          partner_id?: string | null
          sla_terms?: Json | null
          support_tickets?: Json | null
          updated_at?: string | null
          usage_limits?: Json | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "business_partners"
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
      intelligent_automation_rules: {
        Row: {
          actions_config: Json
          adaptive_thresholds: boolean | null
          average_execution_time_ms: number | null
          cost_savings_estimate: number | null
          created_at: string | null
          created_by: string
          description: string | null
          execution_count: number | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          learning_enabled: boolean | null
          name: string
          next_execution_at: string | null
          performance_optimization: boolean | null
          priority: number | null
          subscription_id: string
          success_count: number | null
          success_rate: number | null
          trigger_config: Json
          updated_at: string | null
        }
        Insert: {
          actions_config: Json
          adaptive_thresholds?: boolean | null
          average_execution_time_ms?: number | null
          cost_savings_estimate?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          execution_count?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          learning_enabled?: boolean | null
          name: string
          next_execution_at?: string | null
          performance_optimization?: boolean | null
          priority?: number | null
          subscription_id: string
          success_count?: number | null
          success_rate?: number | null
          trigger_config: Json
          updated_at?: string | null
        }
        Update: {
          actions_config?: Json
          adaptive_thresholds?: boolean | null
          average_execution_time_ms?: number | null
          cost_savings_estimate?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          execution_count?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          learning_enabled?: boolean | null
          name?: string
          next_execution_at?: string | null
          performance_optimization?: boolean | null
          priority?: number | null
          subscription_id?: string
          success_count?: number | null
          success_rate?: number | null
          trigger_config?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intelligent_automation_rules_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
          invoice_type: string | null
          issue_date: string
          late_fee_applied: number | null
          line_items: Json | null
          location_id: string
          notes: string | null
          payment_terms: number | null
          status: string
          stripe_invoice_id: string | null
          subscription_billing_id: string | null
          subscription_id: string | null
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
          invoice_type?: string | null
          issue_date?: string
          late_fee_applied?: number | null
          line_items?: Json | null
          location_id: string
          notes?: string | null
          payment_terms?: number | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_billing_id?: string | null
          subscription_id?: string | null
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
          invoice_type?: string | null
          issue_date?: string
          late_fee_applied?: number | null
          line_items?: Json | null
          location_id?: string
          notes?: string | null
          payment_terms?: number | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_billing_id?: string | null
          subscription_id?: string | null
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
          {
            foreignKeyName: "invoices_subscription_billing_id_fkey"
            columns: ["subscription_billing_id"]
            isOneToOne: false
            referencedRelation: "subscription_billing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      local_initiatives: {
        Row: {
          carbon_saved_kg: number | null
          cost_invested: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          participants_count: number | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          cost_invested?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          participants_count?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          carbon_saved_kg?: number | null
          cost_invested?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          participants_count?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
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
          subscription_id: string | null
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
          subscription_id?: string | null
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
          subscription_id?: string | null
          timezone?: string | null
          updated_at?: string
          updated_by?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_achievements: {
        Row: {
          badge_image_url: string | null
          category: string
          created_at: string | null
          description: string | null
          icon: string
          id: string
          is_active: boolean | null
          max_progress: number
          name: string
          points_reward: number
          rarity: string
          updated_at: string | null
        }
        Insert: {
          badge_image_url?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          max_progress?: number
          name: string
          points_reward?: number
          rarity?: string
          updated_at?: string | null
        }
        Update: {
          badge_image_url?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          max_progress?: number
          name?: string
          points_reward?: number
          rarity?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_challenges: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          goal: number
          id: string
          is_active: boolean | null
          max_participants: number | null
          name: string
          points_reward: number
          start_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          goal: number
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          points_reward: number
          start_date: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          goal?: number
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          points_reward?: number
          start_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          balance: number
          created_at: string | null
          expires_at: string | null
          id: string
          last_updated: string | null
          total_earned: number
          total_redeemed: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_updated?: string | null
          total_earned?: number
          total_redeemed?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_updated?: string | null
          total_earned?: number
          total_redeemed?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          category: string
          created_at: string | null
          current_redemptions: number | null
          current_value: number
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_limited: boolean | null
          max_redemptions: number | null
          name: string
          original_value: number
          partner_id: string | null
          partner_name: string | null
          points_cost: number
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          current_redemptions?: number | null
          current_value: number
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_limited?: boolean | null
          max_redemptions?: number | null
          name: string
          original_value: number
          partner_id?: string | null
          partner_name?: string | null
          points_cost: number
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_redemptions?: number | null
          current_value?: number
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_limited?: boolean | null
          max_redemptions?: number | null
          name?: string
          original_value?: number
          partner_id?: string | null
          partner_name?: string | null
          points_cost?: number
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      loyalty_settings: {
        Row: {
          achievement_alerts: boolean | null
          allow_referrals: boolean | null
          birthday_reminders: boolean | null
          challenge_reminders: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          public_profile: boolean | null
          push_notifications: boolean | null
          share_achievements: boolean | null
          show_on_leaderboard: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_alerts?: boolean | null
          allow_referrals?: boolean | null
          birthday_reminders?: boolean | null
          challenge_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          public_profile?: boolean | null
          push_notifications?: boolean | null
          share_achievements?: boolean | null
          show_on_leaderboard?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_alerts?: boolean | null
          allow_referrals?: boolean | null
          birthday_reminders?: boolean | null
          challenge_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          public_profile?: boolean | null
          push_notifications?: boolean | null
          share_achievements?: boolean | null
          show_on_leaderboard?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_streaks: {
        Row: {
          created_at: string | null
          current_streak: number
          id: string
          last_activity: string | null
          longest_streak: number
          milestone_reward: number
          next_milestone: number
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_activity?: string | null
          longest_streak?: number
          milestone_reward?: number
          next_milestone?: number
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_activity?: string | null
          longest_streak?: number
          milestone_reward?: number
          next_milestone?: number
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      loyalty_tiers: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          display_name: string
          icon: string
          id: string
          max_points: number | null
          min_points: number
          name: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          display_name: string
          icon: string
          id?: string
          max_points?: number | null
          min_points: number
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string
          id?: string
          max_points?: number | null
          min_points?: number
          name?: string
          updated_at?: string | null
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
      material_tracking: {
        Row: {
          carbon_saved_kg: number | null
          created_at: string | null
          id: string
          material_type: string
          quantity_kg: number | null
          recycled_amount_kg: number | null
          tracking_date: string | null
          updated_at: string | null
          waste_amount_kg: number | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          created_at?: string | null
          id?: string
          material_type: string
          quantity_kg?: number | null
          recycled_amount_kg?: number | null
          tracking_date?: string | null
          updated_at?: string | null
          waste_amount_kg?: number | null
        }
        Update: {
          carbon_saved_kg?: number | null
          created_at?: string | null
          id?: string
          material_type?: string
          quantity_kg?: number | null
          recycled_amount_kg?: number | null
          tracking_date?: string | null
          updated_at?: string | null
          waste_amount_kg?: number | null
        }
        Relationships: []
      }
      ml_models: {
        Row: {
          accuracy: number | null
          algorithm: string
          average_prediction_time_ms: number | null
          created_at: string | null
          created_by: string
          deployed_at: string | null
          description: string | null
          f1_score: number | null
          features: Json
          hyperparameters: Json | null
          id: string
          last_trained_at: string | null
          mae: number | null
          name: string
          precision_score: number | null
          prediction_count: number | null
          recall_score: number | null
          rmse: number | null
          status: string
          subscription_id: string
          target_variable: string
          training_data_size: number | null
          training_data_source: string
          training_duration_minutes: number | null
          training_end_date: string | null
          training_start_date: string | null
          type: string
          updated_at: string | null
          version: string
        }
        Insert: {
          accuracy?: number | null
          algorithm: string
          average_prediction_time_ms?: number | null
          created_at?: string | null
          created_by: string
          deployed_at?: string | null
          description?: string | null
          f1_score?: number | null
          features?: Json
          hyperparameters?: Json | null
          id?: string
          last_trained_at?: string | null
          mae?: number | null
          name: string
          precision_score?: number | null
          prediction_count?: number | null
          recall_score?: number | null
          rmse?: number | null
          status?: string
          subscription_id: string
          target_variable: string
          training_data_size?: number | null
          training_data_source: string
          training_duration_minutes?: number | null
          training_end_date?: string | null
          training_start_date?: string | null
          type: string
          updated_at?: string | null
          version?: string
        }
        Update: {
          accuracy?: number | null
          algorithm?: string
          average_prediction_time_ms?: number | null
          created_at?: string | null
          created_by?: string
          deployed_at?: string | null
          description?: string | null
          f1_score?: number | null
          features?: Json
          hyperparameters?: Json | null
          id?: string
          last_trained_at?: string | null
          mae?: number | null
          name?: string
          precision_score?: number | null
          prediction_count?: number | null
          recall_score?: number | null
          rmse?: number | null
          status?: string
          subscription_id?: string
          target_variable?: string
          training_data_size?: number | null
          training_data_source?: string
          training_duration_minutes?: number | null
          training_end_date?: string | null
          training_start_date?: string | null
          type?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "ml_models_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      model_deployments: {
        Row: {
          auto_scaling_enabled: boolean | null
          average_latency_ms: number | null
          created_at: string | null
          created_by: string
          current_throughput_rps: number | null
          deployed_at: string | null
          endpoint_url: string | null
          environment: string
          error_rate: number | null
          health_status: string
          id: string
          last_health_check: string | null
          max_latency_ms: number | null
          max_throughput_rps: number | null
          model_id: string
          subscription_id: string
          version: string
        }
        Insert: {
          auto_scaling_enabled?: boolean | null
          average_latency_ms?: number | null
          created_at?: string | null
          created_by: string
          current_throughput_rps?: number | null
          deployed_at?: string | null
          endpoint_url?: string | null
          environment: string
          error_rate?: number | null
          health_status?: string
          id?: string
          last_health_check?: string | null
          max_latency_ms?: number | null
          max_throughput_rps?: number | null
          model_id: string
          subscription_id: string
          version: string
        }
        Update: {
          auto_scaling_enabled?: boolean | null
          average_latency_ms?: number | null
          created_at?: string | null
          created_by?: string
          current_throughput_rps?: number | null
          deployed_at?: string | null
          endpoint_url?: string | null
          environment?: string
          error_rate?: number | null
          health_status?: string
          id?: string
          last_health_check?: string | null
          max_latency_ms?: number | null
          max_throughput_rps?: number | null
          model_id?: string
          subscription_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_deployments_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_deployments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      model_predictions: {
        Row: {
          actual_outcome: Json | null
          confidence_level: string
          confidence_score: number
          created_at: string | null
          created_by: string | null
          explanation: Json | null
          feature_importance: Json | null
          feedback_score: number | null
          id: string
          input_data: Json
          model_id: string
          prediction_time_ms: number
          prediction_value: Json
          probability_distribution: Json | null
          subscription_id: string
        }
        Insert: {
          actual_outcome?: Json | null
          confidence_level: string
          confidence_score: number
          created_at?: string | null
          created_by?: string | null
          explanation?: Json | null
          feature_importance?: Json | null
          feedback_score?: number | null
          id?: string
          input_data: Json
          model_id: string
          prediction_time_ms: number
          prediction_value: Json
          probability_distribution?: Json | null
          subscription_id: string
        }
        Update: {
          actual_outcome?: Json | null
          confidence_level?: string
          confidence_score?: number
          created_at?: string | null
          created_by?: string | null
          explanation?: Json | null
          feature_importance?: Json | null
          feedback_score?: number | null
          id?: string
          input_data?: Json
          model_id?: string
          prediction_time_ms?: number
          prediction_value?: Json
          probability_distribution?: Json | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_predictions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      package_analytics: {
        Row: {
          average_processing_time_hours: number | null
          average_storage_days: number | null
          busiest_day_of_week: string | null
          computed_at: string | null
          customer_satisfaction_average: number | null
          delivery_fees: number | null
          delivery_success_rate: number | null
          handling_fees: number | null
          id: string
          packages_by_carrier: Json | null
          packages_by_size: Json | null
          packages_by_status: Json | null
          packages_by_type: Json | null
          peak_delivery_hour: number | null
          peak_receiving_hour: number | null
          period_end: string
          period_start: string
          pickup_rate: number | null
          repeat_customers: number | null
          storage_fees: number | null
          subscription_id: string
          total_packages: number | null
          total_revenue: number | null
          unique_customers: number | null
        }
        Insert: {
          average_processing_time_hours?: number | null
          average_storage_days?: number | null
          busiest_day_of_week?: string | null
          computed_at?: string | null
          customer_satisfaction_average?: number | null
          delivery_fees?: number | null
          delivery_success_rate?: number | null
          handling_fees?: number | null
          id?: string
          packages_by_carrier?: Json | null
          packages_by_size?: Json | null
          packages_by_status?: Json | null
          packages_by_type?: Json | null
          peak_delivery_hour?: number | null
          peak_receiving_hour?: number | null
          period_end: string
          period_start: string
          pickup_rate?: number | null
          repeat_customers?: number | null
          storage_fees?: number | null
          subscription_id: string
          total_packages?: number | null
          total_revenue?: number | null
          unique_customers?: number | null
        }
        Update: {
          average_processing_time_hours?: number | null
          average_storage_days?: number | null
          busiest_day_of_week?: string | null
          computed_at?: string | null
          customer_satisfaction_average?: number | null
          delivery_fees?: number | null
          delivery_success_rate?: number | null
          handling_fees?: number | null
          id?: string
          packages_by_carrier?: Json | null
          packages_by_size?: Json | null
          packages_by_status?: Json | null
          packages_by_type?: Json | null
          peak_delivery_hour?: number | null
          peak_receiving_hour?: number | null
          period_end?: string
          period_start?: string
          pickup_rate?: number | null
          repeat_customers?: number | null
          storage_fees?: number | null
          subscription_id?: string
          total_packages?: number | null
          total_revenue?: number | null
          unique_customers?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "package_analytics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      package_automation_rules: {
        Row: {
          actions: Json
          created_at: string | null
          created_by: string
          description: string | null
          execution_count: number | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          max_executions_per_package: number | null
          name: string
          priority: number | null
          subscription_id: string
          success_count: number | null
          trigger_conditions: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          actions?: Json
          created_at?: string | null
          created_by: string
          description?: string | null
          execution_count?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          max_executions_per_package?: number | null
          name: string
          priority?: number | null
          subscription_id: string
          success_count?: number | null
          trigger_conditions?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          actions?: Json
          created_at?: string | null
          created_by?: string
          description?: string | null
          execution_count?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          max_executions_per_package?: number | null
          name?: string
          priority?: number | null
          subscription_id?: string
          success_count?: number | null
          trigger_conditions?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_automation_rules_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      package_documents: {
        Row: {
          created_at: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          package_id: string
          subscription_id: string
          type: string
          updated_at: string | null
          uploaded_at: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          package_id: string
          subscription_id: string
          type: string
          updated_at?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          package_id?: string
          subscription_id?: string
          type?: string
          updated_at?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_documents_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_documents_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      package_photos: {
        Row: {
          created_at: string | null
          description: string | null
          file_size: number | null
          height: number | null
          id: string
          location_coordinates: unknown | null
          metadata: Json | null
          mime_type: string | null
          package_id: string
          subscription_id: string
          taken_at: string
          taken_by: string | null
          thumbnail_url: string | null
          type: string
          updated_at: string | null
          url: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          location_coordinates?: unknown | null
          metadata?: Json | null
          mime_type?: string | null
          package_id: string
          subscription_id: string
          taken_at?: string
          taken_by?: string | null
          thumbnail_url?: string | null
          type: string
          updated_at?: string | null
          url: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          location_coordinates?: unknown | null
          metadata?: Json | null
          mime_type?: string | null
          package_id?: string
          subscription_id?: string
          taken_at?: string
          taken_by?: string | null
          thumbnail_url?: string | null
          type?: string
          updated_at?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "package_photos_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_photos_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      package_reuse_program: {
        Row: {
          carbon_saved_kg: number | null
          cost_savings: number | null
          created_at: string | null
          id: string
          original_use_date: string | null
          package_id: string
          reuse_count: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          id?: string
          original_use_date?: string | null
          package_id: string
          reuse_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          id?: string
          original_use_date?: string | null
          package_id?: string
          reuse_count?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      package_tracking_events: {
        Row: {
          coordinates: unknown | null
          created_at: string | null
          created_by: string | null
          description: string
          event_type: string
          id: string
          location: string | null
          metadata: Json | null
          package_id: string
          status: string
          subscription_id: string
          timestamp: string
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          description: string
          event_type: string
          id?: string
          location?: string | null
          metadata?: Json | null
          package_id: string
          status: string
          subscription_id: string
          timestamp?: string
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          event_type?: string
          id?: string
          location?: string | null
          metadata?: Json | null
          package_id?: string
          status?: string
          subscription_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_tracking_events_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_tracking_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
          automation_rules_applied: string[] | null
          bin_number: string | null
          carrier: string
          carrier_service: string | null
          created_at: string
          customer_id: string
          customer_name: string
          customer_notes: string | null
          customer_notified: boolean | null
          customer_satisfaction_rating: number | null
          customer_viewed: boolean | null
          customer_viewed_at: string | null
          declared_value: number | null
          delivered_at: string | null
          delivered_by: string | null
          delivery_instructions: string | null
          dimensions: string | null
          fragile: boolean | null
          hazardous: boolean | null
          high_value: boolean | null
          id: string
          internal_notes: string | null
          last_notification_at: string | null
          location_id: string | null
          notes: string | null
          notification_count: number | null
          package_type: string | null
          perishable: boolean | null
          priority: string | null
          processing_time_minutes: number | null
          received_at: string
          received_by: string | null
          requires_id_verification: boolean | null
          requires_signature: boolean
          sender_address: Json | null
          sender_name: string | null
          shelf_location: string | null
          size: string
          special_handling: boolean
          status: string
          storage_days: number | null
          storage_location: string | null
          subscription_id: string | null
          tracking_number: string
          updated_at: string
          weight: string | null
          workflow_status: string | null
        }
        Insert: {
          automation_rules_applied?: string[] | null
          bin_number?: string | null
          carrier: string
          carrier_service?: string | null
          created_at?: string
          customer_id: string
          customer_name: string
          customer_notes?: string | null
          customer_notified?: boolean | null
          customer_satisfaction_rating?: number | null
          customer_viewed?: boolean | null
          customer_viewed_at?: string | null
          declared_value?: number | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_instructions?: string | null
          dimensions?: string | null
          fragile?: boolean | null
          hazardous?: boolean | null
          high_value?: boolean | null
          id?: string
          internal_notes?: string | null
          last_notification_at?: string | null
          location_id?: string | null
          notes?: string | null
          notification_count?: number | null
          package_type?: string | null
          perishable?: boolean | null
          priority?: string | null
          processing_time_minutes?: number | null
          received_at?: string
          received_by?: string | null
          requires_id_verification?: boolean | null
          requires_signature?: boolean
          sender_address?: Json | null
          sender_name?: string | null
          shelf_location?: string | null
          size: string
          special_handling?: boolean
          status?: string
          storage_days?: number | null
          storage_location?: string | null
          subscription_id?: string | null
          tracking_number: string
          updated_at?: string
          weight?: string | null
          workflow_status?: string | null
        }
        Update: {
          automation_rules_applied?: string[] | null
          bin_number?: string | null
          carrier?: string
          carrier_service?: string | null
          created_at?: string
          customer_id?: string
          customer_name?: string
          customer_notes?: string | null
          customer_notified?: boolean | null
          customer_satisfaction_rating?: number | null
          customer_viewed?: boolean | null
          customer_viewed_at?: string | null
          declared_value?: number | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_instructions?: string | null
          dimensions?: string | null
          fragile?: boolean | null
          hazardous?: boolean | null
          high_value?: boolean | null
          id?: string
          internal_notes?: string | null
          last_notification_at?: string | null
          location_id?: string | null
          notes?: string | null
          notification_count?: number | null
          package_type?: string | null
          perishable?: boolean | null
          priority?: string | null
          processing_time_minutes?: number | null
          received_at?: string
          received_by?: string | null
          requires_id_verification?: boolean | null
          requires_signature?: boolean
          sender_address?: Json | null
          sender_name?: string | null
          shelf_location?: string | null
          size?: string
          special_handling?: boolean
          status?: string
          storage_days?: number | null
          storage_location?: string | null
          subscription_id?: string | null
          tracking_number?: string
          updated_at?: string
          weight?: string | null
          workflow_status?: string | null
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
          {
            foreignKeyName: "packages_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      paperless_initiatives: {
        Row: {
          carbon_saved_kg: number | null
          cost_savings: number | null
          created_at: string | null
          description: string | null
          id: string
          implementation_date: string | null
          is_active: boolean | null
          name: string
          paper_saved_sheets: number | null
          updated_at: string | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          implementation_date?: string | null
          is_active?: boolean | null
          name: string
          paper_saved_sheets?: number | null
          updated_at?: string | null
        }
        Update: {
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          implementation_date?: string | null
          is_active?: boolean | null
          name?: string
          paper_saved_sheets?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_analytics: {
        Row: {
          created_at: string | null
          customer_count: number | null
          growth_rate: number | null
          id: string
          opportunities: Json | null
          orders_count: number | null
          partner_id: string | null
          performance_score: number | null
          period: string
          relationship_score: number | null
          revenue: number | null
          risk_assessment: Json | null
        }
        Insert: {
          created_at?: string | null
          customer_count?: number | null
          growth_rate?: number | null
          id?: string
          opportunities?: Json | null
          orders_count?: number | null
          partner_id?: string | null
          performance_score?: number | null
          period: string
          relationship_score?: number | null
          revenue?: number | null
          risk_assessment?: Json | null
        }
        Update: {
          created_at?: string | null
          customer_count?: number | null
          growth_rate?: number | null
          id?: string
          opportunities?: Json | null
          orders_count?: number | null
          partner_id?: string | null
          performance_score?: number | null
          period?: string
          relationship_score?: number | null
          revenue?: number | null
          risk_assessment?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_analytics_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "business_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_commissions: {
        Row: {
          amount: number
          commission_amount: number | null
          commission_rate: number
          contract_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          partner_id: string | null
          payment_date: string | null
          reference: string | null
          status: string
        }
        Insert: {
          amount: number
          commission_amount?: number | null
          commission_rate: number
          contract_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          payment_date?: string | null
          reference?: string | null
          status?: string
        }
        Update: {
          amount?: number
          commission_amount?: number | null
          commission_rate?: number
          contract_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          payment_date?: string | null
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "partner_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "business_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_contracts: {
        Row: {
          commission_structure: Json | null
          contract_number: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          partner_id: string | null
          payment_terms: string | null
          start_date: string
          status: string
          terms: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          commission_structure?: Json | null
          contract_number: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          partner_id?: string | null
          payment_terms?: string | null
          start_date: string
          status?: string
          terms?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          commission_structure?: Json | null
          contract_number?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          partner_id?: string | null
          payment_terms?: string | null
          start_date?: string
          status?: string
          terms?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_contracts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "business_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_programs: {
        Row: {
          carbon_saved_kg: number | null
          cost_invested: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          partner_name: string
          partnership_type: string | null
          program_name: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          carbon_saved_kg?: number | null
          cost_invested?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          partner_name: string
          partnership_type?: string | null
          program_name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          carbon_saved_kg?: number | null
          cost_invested?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          partner_name?: string
          partnership_type?: string | null
          program_name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_vendors: {
        Row: {
          approval_status: string
          certifications: Json | null
          compliance_score: number | null
          created_at: string | null
          id: string
          insurance_info: Json | null
          partner_id: string | null
          quality_rating: number | null
          updated_at: string | null
          vendor_type: string
        }
        Insert: {
          approval_status?: string
          certifications?: Json | null
          compliance_score?: number | null
          created_at?: string | null
          id?: string
          insurance_info?: Json | null
          partner_id?: string | null
          quality_rating?: number | null
          updated_at?: string | null
          vendor_type: string
        }
        Update: {
          approval_status?: string
          certifications?: Json | null
          compliance_score?: number | null
          created_at?: string | null
          id?: string
          insurance_info?: Json | null
          partner_id?: string | null
          quality_rating?: number | null
          updated_at?: string | null
          vendor_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_vendors_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "business_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_name: string | null
          billing_address: Json | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last_four: string | null
          created_at: string | null
          customer_id: string
          id: string
          is_active: boolean
          is_default: boolean
          is_verified: boolean | null
          metadata: Json | null
          phone_number: string | null
          stripe_customer_id: string | null
          stripe_payment_method_id: string | null
          subscription_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          account_name?: string | null
          billing_address?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          is_verified?: boolean | null
          metadata?: Json | null
          phone_number?: string | null
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          subscription_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          account_name?: string | null
          billing_address?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          is_verified?: boolean | null
          metadata?: Json | null
          phone_number?: string | null
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string | null
          subscription_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      payment_routing_config: {
        Row: {
          config_metadata: Json | null
          created_at: string | null
          id: string
          international_fallback_methods: string[] | null
          international_primary_method: string | null
          minimum_amounts: Json | null
          puerto_rico_fallback_methods: string[] | null
          puerto_rico_primary_method: string | null
          subscription_auto_retry: boolean | null
          subscription_id: string | null
          subscription_retry_schedule: number[] | null
          updated_at: string | null
        }
        Insert: {
          config_metadata?: Json | null
          created_at?: string | null
          id?: string
          international_fallback_methods?: string[] | null
          international_primary_method?: string | null
          minimum_amounts?: Json | null
          puerto_rico_fallback_methods?: string[] | null
          puerto_rico_primary_method?: string | null
          subscription_auto_retry?: boolean | null
          subscription_id?: string | null
          subscription_retry_schedule?: number[] | null
          updated_at?: string | null
        }
        Update: {
          config_metadata?: Json | null
          created_at?: string | null
          id?: string
          international_fallback_methods?: string[] | null
          international_primary_method?: string | null
          minimum_amounts?: Json | null
          puerto_rico_fallback_methods?: string[] | null
          puerto_rico_primary_method?: string | null
          subscription_auto_retry?: boolean | null
          subscription_id?: string | null
          subscription_retry_schedule?: number[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_routing_config_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          ath_movil_transaction_id: string | null
          billing_type: string | null
          created_at: string
          customer_id: string
          id: string
          invoice_id: string | null
          location_id: string
          metadata: Json | null
          notes: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          processed_by: string | null
          reference_number: string | null
          status: string
          stripe_payment_intent_id: string | null
          subscription_billing_id: string | null
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          ath_movil_transaction_id?: string | null
          billing_type?: string | null
          created_at?: string
          customer_id: string
          id?: string
          invoice_id?: string | null
          location_id: string
          metadata?: Json | null
          notes?: string | null
          payment_date?: string
          payment_method: string
          payment_number: string
          processed_by?: string | null
          reference_number?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subscription_billing_id?: string | null
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          ath_movil_transaction_id?: string | null
          billing_type?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          invoice_id?: string | null
          location_id?: string
          metadata?: Json | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          processed_by?: string | null
          reference_number?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subscription_billing_id?: string | null
          subscription_id?: string | null
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
          {
            foreignKeyName: "payments_subscription_billing_id_fkey"
            columns: ["subscription_billing_id"]
            isOneToOne: false
            referencedRelation: "subscription_billing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      points_transactions: {
        Row: {
          amount: number
          balance: number
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          metadata: Json | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          balance: number
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          balance?: number
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
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
      projects: {
        Row: {
          created_at: string | null
          cultural_style: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cultural_style?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cultural_style?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          tags?: string[] | null
          updated_at?: string | null
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
      real_time_analytics: {
        Row: {
          active_alerts: Json | null
          active_users: number | null
          communications_sent_today: number | null
          current_response_time: number | null
          error_rate_last_hour: number | null
          id: string
          metadata: Json | null
          new_customers_today: number | null
          packages_in_transit: number | null
          packages_processed_today: number | null
          pending_deliveries: number | null
          performance_warnings: Json | null
          revenue_today: number | null
          subscription_id: string
          system_health_score: number | null
          throughput_per_minute: number | null
          timestamp: string
        }
        Insert: {
          active_alerts?: Json | null
          active_users?: number | null
          communications_sent_today?: number | null
          current_response_time?: number | null
          error_rate_last_hour?: number | null
          id?: string
          metadata?: Json | null
          new_customers_today?: number | null
          packages_in_transit?: number | null
          packages_processed_today?: number | null
          pending_deliveries?: number | null
          performance_warnings?: Json | null
          revenue_today?: number | null
          subscription_id: string
          system_health_score?: number | null
          throughput_per_minute?: number | null
          timestamp?: string
        }
        Update: {
          active_alerts?: Json | null
          active_users?: number | null
          communications_sent_today?: number | null
          current_response_time?: number | null
          error_rate_last_hour?: number | null
          id?: string
          metadata?: Json | null
          new_customers_today?: number | null
          packages_in_transit?: number | null
          packages_processed_today?: number | null
          pending_deliveries?: number | null
          performance_warnings?: Json | null
          revenue_today?: number | null
          subscription_id?: string
          system_health_score?: number | null
          throughput_per_minute?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "real_time_analytics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      recycling_locations: {
        Row: {
          address: string | null
          contact_info: string | null
          created_at: string | null
          hours_of_operation: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          materials_accepted: string[] | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_info?: string | null
          created_at?: string | null
          hours_of_operation?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          materials_accepted?: string[] | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_info?: string | null
          created_at?: string | null
          hours_of_operation?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          materials_accepted?: string[] | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recycling_metrics: {
        Row: {
          carbon_offset: number | null
          cost_savings: number | null
          created_at: string | null
          date: string
          id: string
          location: string | null
          material_type: string
          quantity: number
          unit: string
        }
        Insert: {
          carbon_offset?: number | null
          cost_savings?: number | null
          created_at?: string | null
          date: string
          id?: string
          location?: string | null
          material_type: string
          quantity: number
          unit?: string
        }
        Update: {
          carbon_offset?: number | null
          cost_savings?: number | null
          created_at?: string | null
          date?: string
          id?: string
          location?: string | null
          material_type?: string
          quantity?: number
          unit?: string
        }
        Relationships: []
      }
      reduction_goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          description: string | null
          goal_type: string
          id: string
          status: string | null
          target_amount: number
          target_date: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          goal_type: string
          id?: string
          status?: string | null
          target_amount: number
          target_date?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          status?: string | null
          target_amount?: number
          target_date?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_program: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          points_earned: number | null
          referral_code: string
          referred_email: string
          referrer_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_earned?: number | null
          referral_code: string
          referred_email: string
          referrer_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_earned?: number | null
          referral_code?: string
          referred_email?: string
          referrer_id?: string | null
          status?: string
          updated_at?: string | null
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
      review_incentives: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          points_earned: number
          rating: number
          review: string | null
          submitted_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          points_earned?: number
          rating: number
          review?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          points_earned?: number
          rating?: number
          review?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          activation_code: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          points_spent: number
          redeemed_at: string | null
          reward_id: string | null
          status: string
          updated_at: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          activation_code?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          points_spent: number
          redeemed_at?: string | null
          reward_id?: string | null
          status?: string
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          activation_code?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          points_spent?: number
          redeemed_at?: string | null
          reward_id?: string | null
          status?: string
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      route_optimization_results: {
        Row: {
          config_id: string
          cost_savings: number
          created_at: string | null
          efficiency_score: number
          id: string
          improvement_percentage: number
          optimization_factors: string[] | null
          recommendations: string[] | null
          routes: Json
          subscription_id: string
          time_savings_minutes: number
          total_cost: number
          total_distance: number
          total_time_minutes: number
        }
        Insert: {
          config_id: string
          cost_savings: number
          created_at?: string | null
          efficiency_score: number
          id?: string
          improvement_percentage: number
          optimization_factors?: string[] | null
          recommendations?: string[] | null
          routes: Json
          subscription_id: string
          time_savings_minutes: number
          total_cost: number
          total_distance: number
          total_time_minutes: number
        }
        Update: {
          config_id?: string
          cost_savings?: number
          created_at?: string | null
          efficiency_score?: number
          id?: string
          improvement_percentage?: number
          optimization_factors?: string[] | null
          recommendations?: string[] | null
          routes?: Json
          subscription_id?: string
          time_savings_minutes?: number
          total_cost?: number
          total_distance?: number
          total_time_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_optimization_results_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "smart_routing_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_optimization_results_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      saas_lifecycle_events: {
        Row: {
          automation_results: Json | null
          created_at: string | null
          customer_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          occurred_at: string | null
          processed_at: string | null
          subscription_id: string | null
          triggered_workflows: string[] | null
        }
        Insert: {
          automation_results?: Json | null
          created_at?: string | null
          customer_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          occurred_at?: string | null
          processed_at?: string | null
          subscription_id?: string | null
          triggered_workflows?: string[] | null
        }
        Update: {
          automation_results?: Json | null
          created_at?: string | null
          customer_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          occurred_at?: string | null
          processed_at?: string | null
          subscription_id?: string | null
          triggered_workflows?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "saas_lifecycle_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saas_lifecycle_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      samples: {
        Row: {
          bpm: number | null
          confidence: number | null
          created_at: string | null
          filename: string
          genre: string | null
          id: string
          mime_type: string | null
          owner_id: string
          path: string
          patterns: string[] | null
          project_id: string | null
          size_bytes: number | null
          updated_at: string | null
        }
        Insert: {
          bpm?: number | null
          confidence?: number | null
          created_at?: string | null
          filename: string
          genre?: string | null
          id?: string
          mime_type?: string | null
          owner_id: string
          path: string
          patterns?: string[] | null
          project_id?: string | null
          size_bytes?: number | null
          updated_at?: string | null
        }
        Update: {
          bpm?: number | null
          confidence?: number | null
          created_at?: string | null
          filename?: string
          genre?: string | null
          id?: string
          mime_type?: string | null
          owner_id?: string
          path?: string
          patterns?: string[] | null
          project_id?: string | null
          size_bytes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "samples_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
      session_participants: {
        Row: {
          id: string
          joined_at: string | null
          left_at: string | null
          permissions: Json | null
          role: string | null
          session_id: string
          status: string | null
          user_avatar_url: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          permissions?: Json | null
          role?: string | null
          session_id: string
          status?: string | null
          user_avatar_url?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          permissions?: Json | null
          role?: string | null
          session_id?: string
          status?: string | null
          user_avatar_url?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "collaboration_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_routing_configs: {
        Row: {
          average_delivery_time: number | null
          constraints: Json | null
          cost_per_delivery: number | null
          created_at: string | null
          created_by: string
          customer_satisfaction_score: number | null
          description: string | null
          id: string
          is_active: boolean | null
          learning_enabled: boolean | null
          ml_model_id: string | null
          name: string
          optimization_goals: string[] | null
          real_time_optimization: boolean | null
          route_efficiency_score: number | null
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          average_delivery_time?: number | null
          constraints?: Json | null
          cost_per_delivery?: number | null
          created_at?: string | null
          created_by: string
          customer_satisfaction_score?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          learning_enabled?: boolean | null
          ml_model_id?: string | null
          name: string
          optimization_goals?: string[] | null
          real_time_optimization?: boolean | null
          route_efficiency_score?: number | null
          subscription_id: string
          updated_at?: string | null
        }
        Update: {
          average_delivery_time?: number | null
          constraints?: Json | null
          cost_per_delivery?: number | null
          created_at?: string | null
          created_by?: string
          customer_satisfaction_score?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          learning_enabled?: boolean | null
          ml_model_id?: string | null
          name?: string
          optimization_goals?: string[] | null
          real_time_optimization?: boolean | null
          route_efficiency_score?: number | null
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_routing_configs_ml_model_id_fkey"
            columns: ["ml_model_id"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smart_routing_configs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      social_shares: {
        Row: {
          content: string | null
          created_at: string | null
          engagement_count: number | null
          id: string
          platform: string
          points_earned: number
          shared_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          engagement_count?: number | null
          id?: string
          platform: string
          points_earned?: number
          shared_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          engagement_count?: number | null
          id?: string
          platform?: string
          points_earned?: number
          shared_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      solar_panels: {
        Row: {
          capacity_kw: number | null
          carbon_saved_kg: number | null
          cost_savings: number | null
          created_at: string | null
          efficiency_percentage: number | null
          energy_generated_kwh: number | null
          id: string
          installation_date: string | null
          is_active: boolean | null
          location: string | null
          panel_id: string
          updated_at: string | null
        }
        Insert: {
          capacity_kw?: number | null
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          efficiency_percentage?: number | null
          energy_generated_kwh?: number | null
          id?: string
          installation_date?: string | null
          is_active?: boolean | null
          location?: string | null
          panel_id: string
          updated_at?: string | null
        }
        Update: {
          capacity_kw?: number | null
          carbon_saved_kg?: number | null
          cost_savings?: number | null
          created_at?: string | null
          efficiency_percentage?: number | null
          energy_generated_kwh?: number | null
          id?: string
          installation_date?: string | null
          is_active?: boolean | null
          location?: string | null
          panel_id?: string
          updated_at?: string | null
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
      subscription_billing: {
        Row: {
          backup_payment_method_id: string | null
          billing_address: Json
          billing_cycle_anchor: string | null
          billing_interval: string
          collection_method: string
          created_at: string | null
          created_by: string | null
          default_payment_method_id: string | null
          id: string
          invoice_settings: Json
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_id: string
          tax_exempt: boolean
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          backup_payment_method_id?: string | null
          billing_address?: Json
          billing_cycle_anchor?: string | null
          billing_interval?: string
          collection_method?: string
          created_at?: string | null
          created_by?: string | null
          default_payment_method_id?: string | null
          id?: string
          invoice_settings?: Json
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_id: string
          tax_exempt?: boolean
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          backup_payment_method_id?: string | null
          billing_address?: Json
          billing_cycle_anchor?: string | null
          billing_interval?: string
          collection_method?: string
          created_at?: string | null
          created_by?: string | null
          default_payment_method_id?: string | null
          id?: string
          invoice_settings?: Json
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_id?: string
          tax_exempt?: boolean
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_billing_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_entitlements: {
        Row: {
          created_at: string | null
          current_usage: number | null
          feature_key: string
          id: string
          is_enabled: boolean
          metadata: Json | null
          subscription_id: string
          updated_at: string | null
          usage_limit: number | null
        }
        Insert: {
          created_at?: string | null
          current_usage?: number | null
          feature_key: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          subscription_id: string
          updated_at?: string | null
          usage_limit?: number | null
        }
        Update: {
          created_at?: string | null
          current_usage?: number | null
          feature_key?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          subscription_id?: string
          updated_at?: string | null
          usage_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_entitlements_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_health_metrics: {
        Row: {
          active_customers: number | null
          automation_success_rate: number | null
          average_engagement_score: number | null
          average_revenue_per_user: number | null
          churned_customers: number | null
          created_at: string | null
          customer_lifetime_value: number | null
          email_click_rate: number | null
          email_open_rate: number | null
          feature_adoption_rate: number | null
          id: string
          monthly_recurring_revenue: number | null
          period_end: string | null
          period_start: string | null
          subscription_id: string | null
          support_ticket_count: number | null
          trial_customers: number | null
          updated_at: string | null
        }
        Insert: {
          active_customers?: number | null
          automation_success_rate?: number | null
          average_engagement_score?: number | null
          average_revenue_per_user?: number | null
          churned_customers?: number | null
          created_at?: string | null
          customer_lifetime_value?: number | null
          email_click_rate?: number | null
          email_open_rate?: number | null
          feature_adoption_rate?: number | null
          id?: string
          monthly_recurring_revenue?: number | null
          period_end?: string | null
          period_start?: string | null
          subscription_id?: string | null
          support_ticket_count?: number | null
          trial_customers?: number | null
          updated_at?: string | null
        }
        Update: {
          active_customers?: number | null
          automation_success_rate?: number | null
          average_engagement_score?: number | null
          average_revenue_per_user?: number | null
          churned_customers?: number | null
          created_at?: string | null
          customer_lifetime_value?: number | null
          email_click_rate?: number | null
          email_open_rate?: number | null
          feature_adoption_rate?: number | null
          id?: string
          monthly_recurring_revenue?: number | null
          period_end?: string | null
          period_start?: string | null
          subscription_id?: string | null
          support_ticket_count?: number | null
          trial_customers?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_health_metrics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_users: {
        Row: {
          created_at: string | null
          id: string
          invited_by: string | null
          joined_at: string | null
          status: string
          subscription_id: string
          subscription_role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          status?: string
          subscription_id: string
          subscription_role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          status?: string
          subscription_id?: string
          subscription_role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_users_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_email: string | null
          created_at: string | null
          created_by: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_name: string
          plan_tier: string
          settings: Json | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string | null
          created_by?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_name: string
          plan_tier: string
          settings?: Json | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string | null
          created_by?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_name?: string
          plan_tier?: string
          settings?: Json | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      sustainability_score: {
        Row: {
          community_score: number | null
          created_at: string | null
          date: string
          energy_score: number | null
          id: string
          notes: string | null
          overall_score: number
          transportation_score: number | null
          waste_score: number | null
        }
        Insert: {
          community_score?: number | null
          created_at?: string | null
          date: string
          energy_score?: number | null
          id?: string
          notes?: string | null
          overall_score: number
          transportation_score?: number | null
          waste_score?: number | null
        }
        Update: {
          community_score?: number | null
          created_at?: string | null
          date?: string
          energy_score?: number | null
          id?: string
          notes?: string | null
          overall_score?: number
          transportation_score?: number | null
          waste_score?: number | null
        }
        Relationships: []
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
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          priority: string | null
          status: string | null
          subscription_id: string | null
          title: string
          updated_at: string | null
          workflow_execution_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          subscription_id?: string | null
          title: string
          updated_at?: string | null
          workflow_execution_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          subscription_id?: string | null
          title?: string
          updated_at?: string | null
          workflow_execution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workflow_execution_id_fkey"
            columns: ["workflow_execution_id"]
            isOneToOne: false
            referencedRelation: "communication_workflow_executions"
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
      test_users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          last_sign_in_at: string | null
          password_hash: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          password_hash: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          password_hash?: string
          role?: string
        }
        Relationships: []
      }
      tier_benefits: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          tier_id: string | null
          type: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tier_id?: string | null
          type: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tier_id?: string | null
          type?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tier_benefits_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "loyalty_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      training_jobs: {
        Row: {
          completed_at: string | null
          compute_time_minutes: number | null
          cost_estimate: number | null
          created_at: string | null
          created_by: string
          data_source_query: string
          error_message: string | null
          feature_importance: Json | null
          id: string
          memory_usage_mb: number | null
          model_id: string
          progress_percentage: number | null
          started_at: string | null
          status: string
          subscription_id: string
          training_config: Json | null
          training_metrics: Json | null
          validation_metrics: Json | null
          validation_split: number | null
        }
        Insert: {
          completed_at?: string | null
          compute_time_minutes?: number | null
          cost_estimate?: number | null
          created_at?: string | null
          created_by: string
          data_source_query: string
          error_message?: string | null
          feature_importance?: Json | null
          id?: string
          memory_usage_mb?: number | null
          model_id: string
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
          subscription_id: string
          training_config?: Json | null
          training_metrics?: Json | null
          validation_metrics?: Json | null
          validation_split?: number | null
        }
        Update: {
          completed_at?: string | null
          compute_time_minutes?: number | null
          cost_estimate?: number | null
          created_at?: string | null
          created_by?: string
          data_source_query?: string
          error_message?: string | null
          feature_importance?: Json | null
          id?: string
          memory_usage_mb?: number | null
          model_id?: string
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
          subscription_id?: string
          training_config?: Json | null
          training_metrics?: Json | null
          validation_metrics?: Json | null
          validation_split?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_jobs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_jobs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      tree_planting_counter: {
        Row: {
          goal: number
          id: string
          progress: number | null
          total_carbon_offset: number | null
          total_planted: number
          updated_at: string | null
        }
        Insert: {
          goal?: number
          id?: string
          progress?: number | null
          total_carbon_offset?: number | null
          total_planted?: number
          updated_at?: string | null
        }
        Update: {
          goal?: number
          id?: string
          progress?: number | null
          total_carbon_offset?: number | null
          total_planted?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tree_plantings: {
        Row: {
          carbon_offset: number | null
          created_at: string | null
          date: string
          id: string
          location: string
          notes: string | null
          quantity: number
          species: string
        }
        Insert: {
          carbon_offset?: number | null
          created_at?: string | null
          date: string
          id?: string
          location: string
          notes?: string | null
          quantity?: number
          species: string
        }
        Update: {
          carbon_offset?: number | null
          created_at?: string | null
          date?: string
          id?: string
          location?: string
          notes?: string | null
          quantity?: number
          species?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          created_at: string | null
          id: string
          is_unlocked: boolean | null
          progress: number
          unlocked_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          created_at?: string | null
          id?: string
          is_unlocked?: boolean | null
          progress?: number
          unlocked_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          created_at?: string | null
          id?: string
          is_unlocked?: boolean | null
          progress?: number
          unlocked_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "loyalty_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          created_at: string | null
          current_progress: number
          id: string
          is_completed: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "loyalty_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_community_contributions: {
        Row: {
          contribution: number
          created_at: string | null
          goal_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contribution?: number
          created_at?: string | null
          goal_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contribution?: number
          created_at?: string | null
          goal_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_community_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "community_goals"
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
      user_profiles: {
        Row: {
          avatar_url: string | null
          collaboration_preferences: Json | null
          created_at: string | null
          email: string
          experience_level: string | null
          full_name: string | null
          id: string
          music_genre: string | null
          preferred_language: string | null
          region: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          collaboration_preferences?: Json | null
          created_at?: string | null
          email: string
          experience_level?: string | null
          full_name?: string | null
          id: string
          music_genre?: string | null
          preferred_language?: string | null
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          collaboration_preferences?: Json | null
          created_at?: string | null
          email?: string
          experience_level?: string | null
          full_name?: string | null
          id?: string
          music_genre?: string | null
          preferred_language?: string | null
          region?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      user_tiers: {
        Row: {
          assigned_at: string | null
          expires_at: string | null
          id: string
          tier_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          expires_at?: string | null
          id?: string
          tier_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          expires_at?: string | null
          id?: string
          tier_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tiers_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "loyalty_tiers"
            referencedColumns: ["id"]
          },
        ]
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
      waste_audit: {
        Row: {
          audit_date: string
          auditor: string | null
          created_at: string | null
          id: string
          non_recyclable_waste_kg: number | null
          recommendations: string | null
          recyclable_waste_kg: number | null
          total_waste_kg: number | null
          updated_at: string | null
          waste_reduction_percentage: number | null
        }
        Insert: {
          audit_date: string
          auditor?: string | null
          created_at?: string | null
          id?: string
          non_recyclable_waste_kg?: number | null
          recommendations?: string | null
          recyclable_waste_kg?: number | null
          total_waste_kg?: number | null
          updated_at?: string | null
          waste_reduction_percentage?: number | null
        }
        Update: {
          audit_date?: string
          auditor?: string | null
          created_at?: string | null
          id?: string
          non_recyclable_waste_kg?: number | null
          recommendations?: string | null
          recyclable_waste_kg?: number | null
          total_waste_kg?: number | null
          updated_at?: string | null
          waste_reduction_percentage?: number | null
        }
        Relationships: []
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
      webhook_event_log: {
        Row: {
          body_hash: string
          error_message: string | null
          external_event_id: string | null
          headers: Json | null
          id: string
          received_at: string
          service: string
          signature: string | null
          status: string
        }
        Insert: {
          body_hash: string
          error_message?: string | null
          external_event_id?: string | null
          headers?: Json | null
          id?: string
          received_at?: string
          service: string
          signature?: string | null
          status?: string
        }
        Update: {
          body_hash?: string
          error_message?: string | null
          external_event_id?: string | null
          headers?: Json | null
          id?: string
          received_at?: string
          service?: string
          signature?: string | null
          status?: string
        }
        Relationships: []
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
      workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          customer_id: string
          error_message: string | null
          execution_metadata: Json | null
          failed_at: string | null
          id: string
          retry_count: number | null
          started_at: string | null
          status: string
          subscription_id: string
          trigger_data: Json | null
          updated_at: string | null
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          customer_id: string
          error_message?: string | null
          execution_metadata?: Json | null
          failed_at?: string | null
          id?: string
          retry_count?: number | null
          started_at?: string | null
          status?: string
          subscription_id: string
          trigger_data?: Json | null
          updated_at?: string | null
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          customer_id?: string
          error_message?: string | null
          execution_metadata?: Json | null
          failed_at?: string | null
          id?: string
          retry_count?: number | null
          started_at?: string | null
          status?: string
          subscription_id?: string
          trigger_data?: Json | null
          updated_at?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_executions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "communication_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      performance_dashboard: {
        Row: {
          details: Json | null
          metric: string | null
          status: string | null
        }
        Relationships: []
      }
      security_dashboard: {
        Row: {
          details: Json | null
          metric: string | null
          status: string | null
        }
        Relationships: []
      }
      system_health: {
        Row: {
          details: Json | null
          metric: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_churn_risk_score: {
        Args: { customer_uuid: string }
        Returns: number
      }
      calculate_virtual_mailbox_usage: {
        Args: {
          p_customer_id: string
          p_end_date: string
          p_start_date: string
        }
        Returns: {
          forward_actions: number
          scan_actions: number
          shred_actions: number
          total_actions: number
          total_cost: number
        }[]
      }
      check_feature_entitlement: {
        Args: { feature_key: string }
        Returns: boolean
      }
      check_security_health: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      decrement_loyalty_points: {
        Args: { points_to_subtract: number; user_id: string }
        Returns: number
      }
      fix_all_auth_policies: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fix_all_direct_auth_policies: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fix_all_has_role_policies: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      fix_final_auth_policies: {
        Args: Record<PropertyKey, never>
        Returns: string
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
          failed_backups: number
          latest_backup: string
          oldest_backup: string
          successful_backups: number
          total_backups: number
          total_size_gb: number
        }[]
      }
      get_current_environment: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_subscription_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_context: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_admin: boolean
          is_authenticated: boolean
          is_dev_env: boolean
          is_staff: boolean
          user_id: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_customers_pending_compliance: {
        Args: Record<PropertyKey, never>
        Returns: {
          compliance_score: number
          email: string
          first_name: string
          id: string
          id_verification_status: string
          last_name: string
          ps_form_1583_status: string
        }[]
      }
      get_system_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_profile: {
        Args: { _user_id?: string }
        Returns: {
          avatar_url: string
          email: string
          first_name: string
          full_name: string
          id: string
          last_name: string
          phone: string
          preferred_language: string
          role: string
          user_id: string
        }[]
      }
      get_user_tier: {
        Args: { user_uuid: string }
        Returns: {
          max_points: number
          min_points: number
          tier_color: string
          tier_description: string
          tier_display_name: string
          tier_icon: string
          tier_name: string
        }[]
      }
      has_role: {
        Args: { _role: string; _user_id: string }
        Returns: boolean
      }
      increment_feature_usage: {
        Args: { feature_key: string; increment_by?: number }
        Returns: boolean
      }
      increment_loyalty_points: {
        Args: { points_to_add: number; user_id: string }
        Returns: number
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_development_env: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_staff_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      schedule_backup: {
        Args: { p_configuration_id: string; p_job_type?: string }
        Returns: string
      }
      test_input_validation: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      trigger_saas_lifecycle_event: {
        Args: {
          p_customer_id: string
          p_event_data?: Json
          p_event_type: string
          p_subscription_id: string
        }
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
      validate_email: {
        Args: { email: string }
        Returns: boolean
      }
      validate_name: {
        Args: { name: string }
        Returns: boolean
      }
      validate_phone: {
        Args: { phone: string }
        Returns: boolean
      }
      validate_user_input: {
        Args: { email: string; name?: string; phone?: string }
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
