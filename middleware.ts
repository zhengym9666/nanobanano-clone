import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: Request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.headers.get('Cookie')?.split(';').find(c => c.trim().startsWith(`${name}=`))?.split('=')[1]
        },
        set(name: string, value: string, options: any) {
          request.headers.set('Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Secure=${options.secure ? 'true' : 'false'}; Max-Age=${options.maxAge || 0}`)
        },
        remove(name: string, options: any) {
          request.headers.set('Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
        },
      },
    }
  )

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}