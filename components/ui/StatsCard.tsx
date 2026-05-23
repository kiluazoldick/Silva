"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card } from "./Card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  link?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  link,
  className,
}: Readonly<StatsCardProps>) {
  const content = (
    <Card hover className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
          {subValue && <p className="mt-1 text-xs text-gray-400">{subValue}</p>}
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1">
          {trend.isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span
            className={cn(
              "text-xs",
              trend.isPositive ? "text-green-600" : "text-red-600",
            )}
          >
            {trend.value}% vs mois dernier
          </span>
        </div>
      )}
    </Card>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}
