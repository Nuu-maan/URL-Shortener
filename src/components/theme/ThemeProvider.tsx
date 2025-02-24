"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"

interface ProviderProps extends ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
