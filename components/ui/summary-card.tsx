import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";

export interface SummaryCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  progress?: number;
  className?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  progress,
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E3E7E1] rounded-xl p-4 sm:p-5 shadow-[0_1px_2px_rgba(32,37,31,0.03)] flex flex-col justify-between transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-[#737B72] truncate">
          {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge && <div>{badge}</div>}
          {Icon && (
            <div className="h-7 w-7 rounded-lg bg-[#F0F4F0] text-[#5A735C] flex items-center justify-center">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight text-[#20251F] leading-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-[#737B72] mt-1 line-clamp-1">
            {subtitle}
          </p>
        )}
        {typeof progress === "number" && (
          <div className="mt-3">
            <ProgressBar value={progress} showPercentage={false} />
          </div>
        )}
      </div>
    </div>
  );
}

