import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "subject";
  colorTheme?: "indigo" | "emerald" | "amber" | "rose" | "sky" | "purple";
}

export function Badge({
  className,
  variant = "default",
  colorTheme,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors";

  const variantStyles = {
    default:
      "bg-[#F0F3EF] text-[#20251F] border border-[#E3E7E1]",
    success:
      "bg-[#EEF5EE] text-[#426144] border border-[#CFDFCF]",
    warning:
      "bg-[#FDF6ED] text-[#805B23] border border-[#F3E2CB]",
    danger:
      "bg-[#FDF2F2] text-[#933D3D] border border-[#F5D2D2]",
    subject:
      "bg-[#F0F4F0] text-[#3E5540] border border-[#D8DFD7]",
  };

  const themeStyles: Record<string, string> = {
    indigo: "bg-[#F0F2F7] text-[#3D4F6E] border-[#D8DEE9]",
    emerald: "bg-[#EEF5F0] text-[#386144] border-[#CFDFD3]",
    amber: "bg-[#FBF6ED] text-[#785422] border-[#EDE1CF]",
    rose: "bg-[#FDF3F3] text-[#7A3E47] border-[#EED7D9]",
    sky: "bg-[#F0F5F8] text-[#34596F] border-[#D4E2EB]",
    purple: "bg-[#F4F1F7] text-[#55416D] border-[#DFD8E9]",
  };

  const chosenStyle =
    colorTheme && themeStyles[colorTheme]
      ? `border ${themeStyles[colorTheme]}`
      : variantStyles[variant];

  return (
    <span className={cn(baseStyles, chosenStyle, className)} {...props}>
      {children}
    </span>
  );
}
