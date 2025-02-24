"use client"

import { ActivitySquare, Link, Users } from "lucide-react"
import { AnalyticCard } from "./AnalyticCard"

export default function Analytics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <AnalyticCard
        title="Total Links"
        value={156}
        change="20.1% from last month"
        Icon={Link}
      />
      <AnalyticCard
        title="Total Clicks"
        value={1432}
        change="15% from last month"
        Icon={ActivitySquare}
      />
      <AnalyticCard
        title="Active Users"
        value={89}
        change="12.5% from last month"
        Icon={Users}
      />
    </div>
  )
}