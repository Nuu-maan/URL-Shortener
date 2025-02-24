// src/components/shared/NavBar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NavBar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Only render theme toggle after mounting to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="w-full border-b border-border">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex w-full justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">URL Shortener</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/analytics" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Analytics
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {mounted ? (
                <>
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </>
              ) : (
                <div className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}