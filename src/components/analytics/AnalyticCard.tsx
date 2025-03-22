"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticCardProps {
  title: string;
  value: number;
  change: string;
  Icon: LucideIcon;
  loading?: boolean;
}

export function AnalyticCard({ title, value, change, Icon, loading }: AnalyticCardProps) {
  return (
    <motion.div
      className="p-6 rounded-xl border bg-card hover:bg-card/80 transition-colors duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {loading ? (
          <div className="animate-pulse h-4 w-20 bg-muted rounded" />
        ) : (
          <span className="text-sm text-muted-foreground">{change}</span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {loading ? (
          <div className="animate-pulse h-6 w-16 bg-muted rounded" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </motion.div>
  );
}
