import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.99]";

    const variantStyles = {
      primary:
        "bg-[#6D896F] text-white hover:bg-[#5A735C] active:bg-[#4F6550] shadow-xs shadow-[#6D896F]/20 border border-[#6D896F]/30",
      secondary:
        "bg-[#F0F4F0] text-[#20251F] hover:bg-[#E3EAE3] active:bg-[#D8E1D8] border border-[#D8DFD7]",
      outline:
        "bg-white text-[#20251F] border border-[#E3E7E1] hover:bg-[#F8F9F6] hover:border-[#D1D8CE]",
      ghost:
        "bg-transparent text-[#737B72] hover:text-[#20251F] hover:bg-[#F0F4F0]",
      danger:
        "bg-[#FDF2F2] text-[#9E3B3B] hover:bg-[#FBE8E8] border border-[#F5C2C2]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
      md: "h-9 px-3.5 text-sm gap-2 rounded-lg",
      lg: "h-10 px-4.5 text-sm font-medium gap-2 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
