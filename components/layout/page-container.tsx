import React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidthClassName?: string;
}

export function PageContainer({
  children,
  className,
  maxWidthClassName = "max-w-6xl",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6",
        maxWidthClassName,
        className
      )}
    >
      {children}
    </div>
  );
}

