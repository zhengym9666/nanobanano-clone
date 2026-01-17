"use client"

import { createClient } from './client'
import { Database } from '../../types/supabase'

// 类型定义 - 确保与Supabase数据库表结构一致
export type UserProfile = Database['public']['Tables']['profiles']['Row']
export type GeneratedImage = Database['public']['Tables']['generated_images']['Row']
export type CreditTransaction = Database['public']['Tables']['credit_transactions']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type VipMember = Database['public']['Tables']['vip_member']['Row']

export class SupabaseClientDB {
  private supabase = createClient()

  /**
   * 获取当前用户资料
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user }, error: userError } = await this.supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting current user:', userError)
        return null
      }

      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception fetching user profile:', error)
      return null
    }
  }

  /**
   * 更新当前用户资料
   * @param profile 资料数据
   */
  async updateCurrentUserProfile(
    profile: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await this.supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting current user:', userError)
        return false
      }

      const { error } = await this.supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating user profile:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception updating user profile:', error)
      return false
    }
  }

  /**
   * 获取当前用户生成的图片列表
   * @param limit 限制数量
   * @param offset 偏移量
   */
  async getCurrentUserGeneratedImages(
    limit: number = 20,
    offset: number = 0
  ): Promise<GeneratedImage[]> {
    try {
      const { data: { user }, error: userError } = await this.supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting current user:', userError)
        return []
      }

      const { data, error } = await this.supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
        .offset(offset)

      if (error) {
        console.error('Error fetching user generated images:', error)
        return []
      }

      return data
    } catch (error) {
      console.error('Exception fetching user generated images:', error)
      return []
    }
  }

  /**
   * 获取当前用户积分余额
   */
  async getCurrentUserCreditBalance(): Promise<number> {
    try {
      const profile = await this.getCurrentUserProfile()
      return profile?.credits || 0
    } catch (error) {
      console.error('Exception fetching user credit balance:', error)
      return 0
    }
  }

  /**
   * 监听当前用户资料变化
   * @param callback 回调函数
   */
  onProfileChange(callback: (profile: UserProfile | null) => void) {
    const { data: { user }, error: userError } = this.supabase.auth.getUser()
    
    if (userError || !user) {
      return
    }

    return this.supabase
      .from('profiles')
      .on('UPDATE', (payload) => {
        if (payload.new.id === user.id) {
          callback(payload.new)
        }
      })
      .subscribe()
  }

  /**
   * 监听当前用户生成的图片变化
   * @param callback 回调函数
   */
  onGeneratedImagesChange(callback: (images: GeneratedImage[]) => void) {
    const { data: { user }, error: userError } = this.supabase.auth.getUser()
    
    if (userError || !user) {
      return
    }

    return this.supabase
      .from('generated_images')
      .on('INSERT', (payload) => {
        if (payload.new.user_id === user.id) {
          this.getCurrentUserGeneratedImages()
            .then(images => callback(images))
        }
      })
      .on('DELETE', (payload) => {
        if (payload.old.user_id === user.id) {
          this.getCurrentUserGeneratedImages()
            .then(images => callback(images))
        }
      })
      .subscribe()
  }

  /**
   * 获取所有VIP会员记录（仅用于管理端，需确保安全）
   * @param limit 限制数量
   * @param offset 偏移量
   */
  async getAllVipMembers(
    limit: number = 100,
    offset: number = 0
  ): Promise<VipMember[]> {
    try {
      console.log('Fetching all VIP members...')
      console.log('Table name: vip_member')
      
      // 简化查询，移除可能导致问题的order、limit、offset
      const { data, error } = await this.supabase
        .from('vip_member')
        .select('*')
      
      console.log('Query result data:', data)
      console.log('Query result error:', error)

      if (error) {
        console.error('Error fetching all VIP members:', error)
        // 打印详细错误信息
        if (error.code) console.error('Error code:', error.code)
        if (error.message) console.error('Error message:', error.message)
        if (error.hint) console.error('Error hint:', error.hint)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Exception fetching all VIP members:', error)
      return []
    }
  }

  /**
   * 根据邮箱获取VIP会员记录
   * @param email 会员邮箱
   */
  async getVipMemberByEmail(email: string): Promise<VipMember | null> {
    try {
      const { data, error } = await this.supabase
        .from('vip_member')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error fetching VIP member by email:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception fetching VIP member by email:', error)
      return null
    }
  }

  /**
   * 获取有效状态的VIP会员记录
   * @param limit 限制数量
   * @param offset 偏移量
   */
  async getValidVipMembers(
    limit: number = 100,
    offset: number = 0
  ): Promise<VipMember[]> {
    try {
      const { data, error } = await this.supabase
        .from('vip_member')
        .select('*')
        .eq('status', 'VALID')
        .order('created_at', { ascending: false })
        .limit(limit)
        .offset(offset)

      if (error) {
        console.error('Error fetching valid VIP members:', error)
        return []
      }

      return data
    } catch (error) {
      console.error('Exception fetching valid VIP members:', error)
      return []
    }
  }

  /**
   * 测试VIP会员表连接
   * @returns 测试结果
   */
  async testVipMembersConnection(): Promise<{ 
    success: boolean; 
    count: number; 
    sample: VipMember[]; 
    message: string 
  }> {
    try {
      const [allCount, validCount, sample] = await Promise.all([
        this.supabase.from('vip_member').select('id', { count: 'exact' }).then(res => res.count || 0),
        this.supabase.from('vip_member').select('id', { count: 'exact' }).eq('status', 'VALID').then(res => res.count || 0),
        this.getAllVipMembers(5)
      ])

      return {
        success: true,
        count: allCount,
        sample: sample,
        message: `成功连接到vip_member表。共有${allCount}条记录，其中有效记录${validCount}条。`
      }
    } catch (error) {
      console.error('Error testing VIP members connection:', error)
      return {
        success: false,
        count: 0,
        sample: [],
        message: `连接vip_member表失败: ${error instanceof Error ? error.message : '未知错误'}`
      }
    }
  }
}

// 导出单例实例
export const clientDb = new SupabaseClientDB()