'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 获取URL参数中的code
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          console.error('认证错误:', error);
          router.push('/?error=auth_failed');
          return;
        }
        
        if (!code) {
          console.error('未找到认证代码');
          router.push('/?error=missing_code');
          return;
        }

        // 创建客户端实例
        const supabase = createClient()

        // 处理认证回调
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          throw exchangeError;
        }
        
        if (!data?.session) {
          console.error('未获取到有效的会话');
          router.push('/?error=session_invalid');
          return;
        }

        // 重定向到首页
        router.push('/')
      } catch (error) {
        console.error('登录处理错误:', error)
        // 重定向到登录页面并显示错误信息
        router.push('/?error=auth_failed')
      }
    }

    handleCallback()
  }, [router])

  // Show loading state
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Processing Login...</h2>
        <p className="mt-4">Please wait while we complete your sign-in process.</p>
      </div>
    </div>
  )
}