"use client";

import { Activity } from "lucide-react";
import { Card } from "./Card";

interface ActivityChartProps {
  data: { date: string; count: number }[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export function ActivityChart({
  data,
  title = "Activité hebdomadaire",
  subtitle = "Tâches créées cette semaine",
  height = 80,
}: Readonly<ActivityChartProps>) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
        </div>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex items-end justify-between gap-2">
        {data.map((item, index) => {
          const barHeight = (item.count / maxCount) * height;
          const hasValue = item.count > 0;

          return (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "w-full rounded-md transition-all duration-300",
                  hasValue ? "bg-[#2C4A6E] hover:bg-[#1E3A5F]" : "bg-gray-100",
                )}
                style={{
                  height: `${Math.max(barHeight, 4)}px`,
                  maxHeight: `${height}px`,
                  minHeight: "4px",
                }}
              />
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Utility function pour cn (si pas déjà importé)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
