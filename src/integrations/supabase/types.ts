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
          address_line1: string
          address_line2: string | null
          business_name: string | null
          city: string
          country: string
          created_at: string
          created_by: string | null
          customer_type: string
          email: string
          first_name: string
          id: string
          last_name: string
          mailbox_number: string
          notes: string | null
          phone: string | null
          state: string
          status: string
          updated_at: string
          updated_by: string | null
          user_id: string | null
          zip_code: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          business_name?: string | null
          city: string
          country?: string
          created_at?: string
          created_by?: string | null
          customer_type?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          mailbox_number: string
          notes?: string | null
          phone?: string | null
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          zip_code: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          business_name?: string | null
          city?: string
          country?: string
          created_at?: string
          created_by?: string | null
          customer_type?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          mailbox_number?: string
          notes?: string | null
          phone?: string | null
          state?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
          zip_code?: string
        }
        Relationships: []
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
