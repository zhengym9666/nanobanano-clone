"use server"

import { createClient } from './server'
import { Database } from '../../types/supabase'

// 类型定义 - 确保与Supabase数据库表结构一致
export type VipMember = Database['public']['Tables']['vip_member']['Row']

/**
 * 根据邮箱获取VIP会员记录
 * @param email 会员邮箱
 */
export async function getVipMemberByEmail(email: string): Promise<VipMember | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('vip_member')
      .select('*')
      .eq('email', email)
      .limit(1)

    if (error) {
      console.error('Error fetching VIP member by email:', error)
      return null
    }

    // 检查是否有数据返回
    if (!data || data.length === 0) {
      console.log('No VIP member found for email:', email)
      return null
    }

    return data[0]
  } catch (error) {
    console.error('Exception fetching VIP member by email:', error)
    return null
  }
}

/**
 * 获取所有VIP会员记录
 * @param limit 限制数量
 */
export async function getAllVipMembers(limit: number = 100): Promise<VipMember[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('vip_member')
      .select('*')
      .limit(limit)

    if (error) {
      console.error('Error fetching all VIP members:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception fetching all VIP members:', error)
    return []
  }
}

/**
 * 创建或更新VIP会员记录
 * @param email 会员邮箱
 * @param status 会员状态
 */
export async function upsertVipMember(email: string, status: string = 'active'): Promise<VipMember | null> {
  try {
    const supabase = createClient()
    
    // 计算过期日期：当前日期 + 1个月
    const now = new Date()
    const expiredDate = new Date()
    expiredDate.setMonth(now.getMonth() + 1)
    
    // 创建或更新VIP会员记录
    const { data, error } = await supabase
      .from('vip_member')
      .upsert({
        email,
        status,
        expired_date: expiredDate.toISOString(),
        created_at: new Date().toISOString()
      }, {
        onConflict: ['email'], // 当邮箱冲突时更新
        returning: 'representation' // 返回更新后的记录
      })

    if (error) {
      console.error('Error upserting VIP member:', error)
      return null
    }

    return data?.[0] || null
  } catch (error) {
    console.error('Exception upserting VIP member:', error)
    return null
  }
}

