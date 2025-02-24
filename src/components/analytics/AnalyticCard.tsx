import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface AnalyticCardProps {
  title: string
  value: number
  change: string
  Icon: LucideIcon
}

export function AnalyticCard({ title, value, change, Icon }: AnalyticCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span className="text-green-500 mr-1">↑</span>
          {change}
        </div>
      </CardContent>
    </Card>
  )
}
