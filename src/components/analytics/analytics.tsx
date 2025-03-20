"use client";

import { useEffect, useState } from "react";
import { ActivitySquare, Link as LinkIcon, Users, Trash2 } from "lucide-react";
import { AnalyticCard } from "./AnalyticCard";

interface UrlData {
  id: string;
  shortCode: string;
  longUrl: string;
  shortUrl?: string;
  createdAt: string;
  visits: number;
}

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

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);

        // Fetch all URLs
        const response = await fetch("/api/url");
        if (!response.ok) throw new Error("Failed to fetch URLs");

        const fetchedUrls: UrlData[] = await response.json();
        if (!Array.isArray(fetchedUrls)) throw new Error("Invalid URL response");

        setUrls(fetchedUrls);

        // Fetch user stats
        const userStatsResponse = await fetch("/api/analytics/users");
        if (!userStatsResponse.ok) throw new Error("Failed to fetch user stats");

        const userStats = await userStatsResponse.json();
        if (!userStats || typeof userStats !== "object")
          throw new Error("Invalid user stats response");

        // Compute analytics
        const totalLinks = fetchedUrls.length;
        const totalClicks = fetchedUrls.reduce((sum, url) => sum + (url.visits || 0), 0);

        // Month-based calculations
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentMonthLinks = fetchedUrls.filter(
          (url) => new Date(url.createdAt) >= currentMonthStart
        ).length;
        const previousMonthLinks = fetchedUrls.filter(
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
            : "100%";
        const clickChange =
          prevClicks > 0 ? (((currClicks - prevClicks) / prevClicks) * 100).toFixed(1) : "100%";
        const userChange =
          prevUsers > 0 ? (((currUsers - prevUsers) / prevUsers) * 100).toFixed(1) : "100%";

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
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  // Delete URL function
  async function deleteUrl(id: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const response = await fetch(`/api/url/manage/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete URL");

      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
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

      {/* Links Table */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-white">Recent Links</h2>
        <table className="w-full mt-4 text-sm text-gray-300">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="py-2 text-left">Short URL</th>
              <th className="py-2 text-left">Original URL</th>
              <th className="py-2 text-left">Created</th>
              <th className="py-2 text-center">Visits</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.length > 0 ? (
              urls.map((url) => (
                <tr key={url.id} className="border-b border-gray-800">
                  <td className="py-2">
                    <a
                      href={url.shortUrl || `/${url.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400"
                    >
                      {url.shortUrl || `/${url.shortCode}`}
                    </a>
                  </td>
                  <td className="py-2 truncate max-w-[200px]">
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400"
                    >
                      {url.longUrl}
                    </a>
                  </td>
                  <td className="py-2">{new Date(url.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 text-center">{url.visits}</td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => deleteUrl(url.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No links found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
