"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface AnalyticCardProps {
  title: string;
  value: string | number;
  change?: number;
  Icon?: LucideIcon;
  loading?: boolean;
}

export function AnalyticCard({
  title,
  value,
  change,
  Icon,
  loading = false,
}: AnalyticCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{value}</p>
              {change !== undefined && (
                <span
                  className={
                    change >= 0
                      ? "text-sm font-medium text-green-600"
                      : "text-sm font-medium text-red-600"
                  }
                >
                  {change >= 0 ? "+" : ""}
                  {change}%
                </span>
              )}
            </div>
          </div>
          {Icon && (
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
