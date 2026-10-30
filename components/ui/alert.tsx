import React from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  variant?: "info" | "success" | "error";
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({
  variant = "info",
  title,
  children,
  onDismiss,
  className,
}: AlertProps) {
  const variantStyles = {
    info: "bg-[#F0F4F0] border-[#D8DFD7] text-[#20251F]",
    success: "bg-[#EEF5EE] border-[#CFDFCF] text-[#20251F]",
    error: "bg-[#FDF2F2] border-[#F5C2C2] text-[#20251F]",
  };

  const iconStyles = {
    info: "text-[#5A735C]",
    success: "text-[#426144]",
    error: "text-[#9E3B3B]",
  };

  const Icon = {
    info: Info,
    success: CheckCircle2,
    error: AlertCircle,
  }[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 p-3.5 rounded-xl border text-sm transition-all",
        variantStyles[variant],
        className
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", iconStyles[variant])} />
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className="font-semibold text-xs text-[#20251F] mb-0.5 leading-tight">
            {title}
          </h5>
        )}
        <div className="text-xs text-[#737B72] leading-relaxed">
          {children}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-md text-[#737B72] hover:text-[#20251F] hover:bg-black/5 transition-colors"
          aria-label="Dismiss notice"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
