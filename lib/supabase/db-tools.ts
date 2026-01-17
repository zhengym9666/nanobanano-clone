import { createServerClient } from '@supabase/ssr'
import { Database } from '../../types/supabase'

// 类型定义
export type VipMember = Database['public']['Tables']['vip_member']['Row']

/**
 * 创建一个不依赖cookie的Supabase客户端
 * 用于无需认证的数据库操作
 */
export function createCookieFreeClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('缺少Supabase配置。请检查环境变量')
    // 返回一个不执行任何操作的假客户端
    return {
      from: () => ({
        upsert: () => Promise.resolve({ data: null, error: null }),
        select: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
          eq: () => ({
            select: () => Promise.resolve({ data: null, error: null })
          })
        })
      })
    } as any
  }

  // 创建一个没有cookie支持的客户端
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {}
      }
    }
  )
}

/**
 * 根据邮箱获取VIP会员记录
 * @param email 会员邮箱
 */
export async function getVipMemberByEmail(email: string): Promise<VipMember | null> {
  try {
    const supabase = createCookieFreeClient()
    const { data, error } = await supabase
      .from('vip_member')
      .select('*')
      .eq('email', email)
      .limit(1)

    if (error) {
      console.error('Error fetching VIP member by email:', error)
      return null
    }

    return data?.[0] || null
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
    const supabase = createCookieFreeClient()
    
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
    const supabase = createCookieFreeClient()
    
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