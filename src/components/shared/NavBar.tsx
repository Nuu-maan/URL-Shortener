// src/components/shared/NavBar.tsx
"use client"

import Link from "next/link"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function NavBar() {
  const { theme, setTheme } = useTheme()

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
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-2.5 hover:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}