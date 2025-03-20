"use client";

import { useEffect, useState } from "react";
import { ActivitySquare, Link as LinkIcon, Users, Trash2, ExternalLink, Search } from "lucide-react";
import { AnalyticCard } from "./AnalyticCard";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UrlData {
  id: number;
  shortCode: string;
  longUrl: string;
  createdAt: string;
  visits: {
    id: number;
  }[];
  totalVisits?: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeUsers: 0,
    linkChange: "0%",
    clickChange: "0%",
    userChange: "0%",
  });
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);

        // Fetch all URLs
        const response = await fetch("/api/url");
        if (!response.ok) throw new Error("Failed to fetch URLs");

        const fetchedUrls: UrlData[] = await response.json();
        if (!Array.isArray(fetchedUrls)) throw new Error("Invalid URL response");

        // Process URLs to add totalVisits
        const processedUrls = fetchedUrls.map(url => ({
          ...url,
          totalVisits: url.visits.length
        }));

        setUrls(processedUrls);

        // Fetch user stats
        const userStatsResponse = await fetch("/api/analytics/users");
        if (!userStatsResponse.ok) throw new Error("Failed to fetch user stats");

        const userStats = await userStatsResponse.json();
        if (!userStats || typeof userStats !== "object")
          throw new Error("Invalid user stats response");

        // Compute analytics
        const totalLinks = processedUrls.length;
        const totalClicks = processedUrls.reduce((sum, url) => sum + url.visits.length, 0);

        // Month-based calculations
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentMonthLinks = processedUrls.filter(
          (url) => new Date(url.createdAt) >= currentMonthStart
        ).length;
        const previousMonthLinks = processedUrls.filter(
          (url) =>
            new Date(url.createdAt) >= previousMonthStart &&
            new Date(url.createdAt) < currentMonthStart
        ).length;

        // Previous vs Current month data
        const prevClicks = userStats.previousMonthClicks || 0;
        const prevUsers = userStats.previousMonthUsers || 0;
        const currClicks = userStats.currentMonthClicks || 0;
        const currUsers = userStats.currentMonthUsers || 0;

        // Calculate percentage changes
        const linkChange =
          previousMonthLinks > 0
            ? (((currentMonthLinks - previousMonthLinks) / previousMonthLinks) * 100).toFixed(1)
            : "100";
        const clickChange =
          prevClicks > 0 ? (((currClicks - prevClicks) / prevClicks) * 100).toFixed(1) : "100";
        const userChange =
          prevUsers > 0 ? (((currUsers - prevUsers) / prevUsers) * 100).toFixed(1) : "100";

        setAnalytics({
          totalLinks,
          totalClicks,
          activeUsers: currUsers,
          linkChange: linkChange.startsWith("-") ? linkChange : `+${linkChange}`,
          clickChange: clickChange.startsWith("-") ? clickChange : `+${clickChange}`,
          userChange: userChange.startsWith("-") ? userChange : `+${userChange}`,
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  // Delete URL function
  async function deleteUrl(id: number) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const response = await fetch(`/api/url/manage/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete URL");

      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
      toast.success("Link deleted successfully");
    } catch (error) {
      console.error("Failed to delete link:", error);
      toast.error("Failed to delete link");
    }
  }

  // Filter URLs based on search term
  const filteredUrls = urls.filter(url => 
    url.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Analytics Cards */}
      <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
        <AnalyticCard
          title="Total Links"
          value={analytics.totalLinks}
          change={`${analytics.linkChange}% from last month`}
          Icon={LinkIcon}
          loading={loading}
        />
        <AnalyticCard
          title="Total Clicks"
          value={analytics.totalClicks}
          change={`${analytics.clickChange}% from last month`}
          Icon={ActivitySquare}
          loading={loading}
        />
        <AnalyticCard
          title="Active Users"
          value={analytics.activeUsers}
          change={`${analytics.userChange}% from last month`}
          Icon={Users}
          loading={loading}
        />
      </motion.div>

      {/* Links Table */}
      <motion.div variants={item} className="rounded-xl border bg-card">
        <div className="p-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-b">
          <h2 className="text-lg font-semibold">Recent Links</h2>
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium">Short URL</th>
                <th className="py-3 px-4 text-left font-medium">Original URL</th>
                <th className="py-3 px-4 text-left font-medium">Created</th>
                <th className="py-3 px-4 text-center font-medium">Visits</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {filteredUrls.length > 0 ? (
                  filteredUrls.map((url) => (
                    <motion.tr
                      key={url.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <a
                          href={`/${url.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 font-medium"
                        >
                          /{url.shortCode}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-[300px]">
                          <a
                            href={url.longUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground truncate block transition-colors"
                          >
                            {url.longUrl}
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(url.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {url.totalVisits}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUrl(url.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No matching links found" : "No links found"}
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
