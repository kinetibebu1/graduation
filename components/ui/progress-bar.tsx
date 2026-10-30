import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  sublabel?: string;
  colorClassName?: string;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  label,
  sublabel,
  colorClassName = "bg-[#6D896F]",
  className,
  showPercentage = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-[#20251F]">
          <span>{label}</span>
          <span className="text-[#737B72] tabular-nums font-medium">
            {sublabel ?? `${clampedValue}%`}
          </span>
        </div>
      )}
      <div
        className="w-full h-2 bg-[#EBF0EB] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out rounded-full",
            colorClassName
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
