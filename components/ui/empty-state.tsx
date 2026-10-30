import React from "react";
import { LucideIcon, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[#D1D8CE] bg-white/60 p-8 sm:p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto",
        className
      )}
    >
      <div className="h-11 w-11 rounded-xl bg-[#F0F4F0] text-[#5A735C] flex items-center justify-center mb-3.5 border border-[#D8DFD7]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="text-sm font-semibold text-[#20251F] mb-1">
        {title}
      </h3>

      <p className="text-xs text-[#737B72] leading-relaxed mb-5 max-w-xs">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

