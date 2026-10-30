"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Compass,
  HardDrive,
  LayoutDashboard,
  Plus,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppSidebarProps {
  onOpenAddModal?: () => void;
  className?: string;
  onNavigate?: () => void; // Used by mobile drawer to close on click
}

export function AppSidebar({
  onOpenAddModal,
  className,
  onNavigate,
}: AppSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/",
      icon: LayoutDashboard,
      description: "Today's routine & progress",
      active: pathname === "/",
    },
    {
      label: "My Habits",
      href: "/habits",
      icon: CheckSquare,
      description: "Manage study checklist",
      active: pathname === "/habits",
    },
    {
      label: "Progress",
      href: "/progress",
      icon: TrendingUp,
      description: "Weekly streak & consistency",
      active: pathname === "/progress",
    },
  ];

  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-[#E3E7E1] flex flex-col justify-between h-full select-none",
        className
      )}
      aria-label="Sidebar Navigation"
    >
      <div className="flex flex-col flex-1">
        {/* Brand Wordmark Header */}
        <div className="h-16 px-5 border-b border-[#E3E7E1] flex items-center justify-between">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] rounded-lg p-1 -ml-1"
          >
            <div className="h-8 w-8 rounded-lg bg-[#6D896F] text-white flex items-center justify-center shadow-xs">
              <Compass className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold text-[#20251F] tracking-tight block leading-tight">
                StudyHabit
              </span>
              <span className="text-[11px] font-medium text-[#737B72] block leading-none mt-0.5">
                Student Routine
              </span>
            </div>
          </Link>
        </div>

        {/* Primary Navigation */}
        <div className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8F978E]">
            Study Routine
          </div>
          <nav className="space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]",
                    item.active
                      ? "bg-[#F0F4F0] text-[#20251F] font-semibold shadow-xs"
                      : "text-[#737B72] hover:bg-[#F4F6F2] hover:text-[#20251F]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      item.active
                        ? "text-[#5A735C]"
                        : "text-[#8F978E] group-hover:text-[#5A735C]"
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex-1 truncate">
                    <div className="truncate">{item.label}</div>
                  </div>
                  {item.active && (
                    <div className="h-1.5 w-1.5 rounded-full bg-[#6D896F] shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Action in Sidebar */}
        {onOpenAddModal && (
          <div className="px-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onOpenAddModal();
                if (onNavigate) onNavigate();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-[#F0F4F0] hover:bg-[#E3EAE3] text-[#3E5540] border border-[#D8DFD7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add Study Habit</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer / Workspace Context */}
      <div className="p-4 border-t border-[#E3E7E1] bg-[#FAFBF9]">
        <div className="flex items-start gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#EBF0EB] text-[#5A735C] flex items-center justify-center shrink-0 mt-0.5">
            <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#20251F] truncate">
              Local Session
            </p>
            <p className="text-[11px] text-[#737B72] leading-tight mt-0.5">
              Saved in browser storage. No account needed.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
