"use client"

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut } from 'lucide-react'

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, {user.user_metadata?.full_name || user.email}</span>
        <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-2">
          <LogOut size={16} />
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={signInWithGoogle} className="flex items-center gap-2">
      <LogIn size={16} />
      Sign in with Google
    </Button>
  )
}