import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('缺少Supabase配置。请检查环境变量')
    // 返回一个不执行任何操作的假客户端
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: () => Promise.resolve({ error: { message: '未配置Supabase' } }),
        signOut: () => Promise.resolve({ error: null })
      }
    } as any
  }
  
  // 创建客户端时配置清除缓存和强制重新认证
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'nanobanana-auth'
      }
    }
  )
}