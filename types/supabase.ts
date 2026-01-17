/**
 * 自动生成的Supabase数据库类型定义
 * 从Supabase项目的API设置中导出
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          updated_at?: string
        }
      }
      generated_images: {
        Row: {
          id: string
          user_id: string
          prompt: string
          model: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          model: string
          image_url: string
          created_at?: string
        }
        Update: {}
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'refund'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'refund'
          description?: string | null
          created_at?: string
        }
        Update: {}
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'cancelled' | 'expired'
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'cancelled' | 'expired'
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'active' | 'cancelled' | 'expired'
          end_date?: string | null
          updated_at?: string
        }
      }
      vip_member: {
        Row: {
          id: number
          created_at: string
          expired_date: string | null
          status: string
          email: string
        }
        Insert: {
          id?: number
          created_at?: string
          expired_date?: string | null
          status?: string
          email: string
        }
        Update: {
          expired_date?: string | null
          status?: string
          email?: string
        }
      }
    }
    Views: {}
    Functions: {
      update_user_credits: {
        Args: {
          p_user_id: string
          p_amount: number
        }
        Returns: boolean
      }
    }
    Enums: {}
  }
}