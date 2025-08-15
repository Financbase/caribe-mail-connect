export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          mailbox_id: string | null
          is_vip: boolean
          is_active: boolean
          preferences: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          mailbox_id?: string | null
          is_vip?: boolean
          is_active?: boolean
          preferences?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          mailbox_id?: string | null
          is_vip?: boolean
          is_active?: boolean
          preferences?: Json | null
        }
      }
      packages: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tracking_number: string
          customer_id: string | null
          carrier: string | null
          status: string
          arrival_date: string | null
          notification_sent_at: string | null
          pickup_date: string | null
          notes: string | null
          weight: number | null
          dimensions: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tracking_number: string
          customer_id?: string | null
          carrier?: string | null
          status?: string
          arrival_date?: string | null
          notification_sent_at?: string | null
          pickup_date?: string | null
          notes?: string | null
          weight?: number | null
          dimensions?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tracking_number?: string
          customer_id?: string | null
          carrier?: string | null
          status?: string
          arrival_date?: string | null
          notification_sent_at?: string | null
          pickup_date?: string | null
          notes?: string | null
          weight?: number | null
          dimensions?: Json | null
        }
      }
      mailboxes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          number: string
          customer_id: string | null
          is_available: boolean
          size: string | null
          monthly_fee: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          number: string
          customer_id?: string | null
          is_available?: boolean
          size?: string | null
          monthly_fee?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          number?: string
          customer_id?: string | null
          is_available?: boolean
          size?: string | null
          monthly_fee?: number | null
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          package_id: string | null
          type: string
          channel: string
          status: string
          sent_at: string | null
          content: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          package_id?: string | null
          type: string
          channel: string
          status?: string
          sent_at?: string | null
          content?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          package_id?: string | null
          type?: string
          channel?: string
          status?: string
          sent_at?: string | null
          content?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}