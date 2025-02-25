"use client"

import { useEffect, useState } from "react"
import { ActivitySquare, Link as LinkIcon, Users } from "lucide-react"
import { AnalyticCard } from "./AnalyticCard"

interface UrlData {
  id: string
  shortCode: string
  longUrl: string
  shortUrl: string
  createdAt: string
  visits: number
}

export function Analytics() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeUsers: 0,
    linkChange: "0%",
    clickChange: "0%",
    userChange: "0%"
  })

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        
        // Fetch all URLs with their visit counts
        const response = await fetch('/api/url')
        const urls: UrlData[] = await response.json()
        
        // Calculate current month and previous month boundaries
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        
        // Get user statistics (need to create a new endpoint for this)
        const userStatsResponse = await fetch('/api/analytics/users')
        const userStats = await userStatsResponse.json()
        
        // Calculate total links
        const totalLinks = urls.length
        
        // Calculate total clicks
        const totalClicks = urls.reduce((sum, url) => sum + url.visits, 0)
        
        // Get links created this month vs. last month
        const currentMonthLinks = urls.filter(url => 
          new Date(url.createdAt) >= currentMonthStart
        ).length
        
        const previousMonthLinks = urls.filter(url => 
          new Date(url.createdAt) >= previousMonthStart && 
          new Date(url.createdAt) < currentMonthStart
        ).length
        
        // Calculate percentage changes
        const linkChange = previousMonthLinks === 0 
          ? "100%" 
          : `${((currentMonthLinks - previousMonthLinks) / previousMonthLinks * 100).toFixed(1)}%`
        
        const clickChange = userStats.previousMonthClicks === 0 
          ? "100%" 
          : `${((userStats.currentMonthClicks - userStats.previousMonthClicks) / userStats.previousMonthClicks * 100).toFixed(1)}%`
        
        const userChange = userStats.previousMonthUsers === 0 
          ? "100%" 
          : `${((userStats.currentMonthUsers - userStats.previousMonthUsers) / userStats.previousMonthUsers * 100).toFixed(1)}%`
        
        setAnalytics({
          totalLinks,
          totalClicks,
          activeUsers: userStats.currentMonthUsers,
          linkChange: linkChange.startsWith('-') ? linkChange : `+${linkChange}`,
          clickChange: clickChange.startsWith('-') ? clickChange : `+${clickChange}`,
          userChange: userChange.startsWith('-') ? userChange : `+${userChange}`
        })
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <AnalyticCard
        title="Total Links"
        value={analytics.totalLinks}
        change={`${analytics.linkChange} from last month`}
        Icon={LinkIcon}
        loading={loading}
      />
      <AnalyticCard
        title="Total Clicks"
        value={analytics.totalClicks}
        change={`${analytics.clickChange} from last month`}
        Icon={ActivitySquare}
        loading={loading}
      />
      <AnalyticCard
        title="Active Users"
        value={analytics.activeUsers}
        change={`${analytics.userChange} from last month`}
        Icon={Users}
        loading={loading}
      />
    </div>
  )
}