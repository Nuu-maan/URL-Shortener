"use client"

import { LucideIcon } from "lucide-react"

interface AnalyticCardProps {
  title: string
  value: number
  change: string
  Icon: LucideIcon
  loading?: boolean
}

export function AnalyticCard({ title, value, change, Icon, loading = false }: AnalyticCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      {loading ? (
        <div className="mt-2 space-y-2">
          <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
        </div>
      ) : (
        <>
          <div className="mt-2 text-3xl font-bold">{value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{change}</p>
        </>
      )}
    </div>
  )
}