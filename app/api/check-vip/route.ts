import { NextRequest, NextResponse } from 'next/server'
import { getVipMemberByEmail } from '@/lib/supabase/db-tools'

export async function POST(request: NextRequest) {
  try {
    console.log('VIP Check API called')
    const { email } = await request.json()
    console.log('Request email:', email)

    if (!email) {
      console.log('Email is missing, returning error')
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 查询用户的VIP会员记录
    const vipMember = await getVipMemberByEmail(email)
    console.log('VIP Member result:', vipMember)

    if (!vipMember) {
      console.log('No VIP member found, returning isVip: false')
      return NextResponse.json({ isVip: false, message: 'User is not a VIP member' })
    }

    // 检查VIP会员是否过期
    const now = new Date()
    const expiredDate = vipMember.expired_date ? new Date(vipMember.expired_date) : null

    if (!expiredDate || expiredDate < now) {
      return NextResponse.json({ isVip: false, message: 'VIP membership has expired' })
    }

    // VIP会员有效
    return NextResponse.json({ isVip: true, message: 'VIP membership is valid' })

  } catch (error) {
    console.error('Error checking VIP status:', error)
    return NextResponse.json({ error: '检查VIP状态失败' }, { status: 500 })
  }
}