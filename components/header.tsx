import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthButton } from "@/components/auth-button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-3xl">🍌</span>
          <span className="text-foreground">Nano Banana</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#generator"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Try Editor
          </Link>
          <Link
            href="#showcase"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Examples
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
