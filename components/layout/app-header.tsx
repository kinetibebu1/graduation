"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Calendar,
  HardDrive,
  Menu,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { formatDisplayDate, getTodayDateString } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AppHeaderProps {
  title?: string;
  todayDateStr?: string;
  onOpenMobileMenu?: () => void;
  onOpenAddModal?: () => void;
  onResetDefaults?: () => void;
}

export function AppHeader({
  title,
  todayDateStr = getTodayDateString(),
  onOpenMobileMenu,
  onOpenAddModal,
  onResetDefaults,
}: AppHeaderProps) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Derive title from pathname if not explicitly passed
  const displayTitle =
    title ??
    (pathname === "/habits"
      ? "My Habits"
      : pathname === "/progress"
      ? "Progress"
      : "Overview");

  // Close settings popover on click outside or escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
      }
    }

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isSettingsOpen]);

  return (
    <header className="h-16 border-b border-[#E3E7E1] bg-white/90 backdrop-blur-sm sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#737B72] hover:text-[#20251F] hover:bg-[#F0F4F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        <div>
          <h1 className="text-lg font-bold text-[#20251F] tracking-tight leading-tight">
            {displayTitle}
          </h1>
          <p className="text-[11px] text-[#737B72] hidden sm:block leading-none mt-0.5">
            StudyHabit Student Workspace
          </p>
        </div>
      </div>

      {/* Right: Date, Add Habit CTA, and Profile/Settings */}
      <div className="flex items-center gap-2.5">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F9F6] border border-[#E3E7E1] text-xs font-medium text-[#737B72]">
          <Calendar className="h-3.5 w-3.5 text-[#5A735C]" aria-hidden="true" />
          <span className="text-[#20251F]">{formatDisplayDate(todayDateStr)}</span>
        </div>

        {/* Quick Add Habit Trigger in Header */}
        {onOpenAddModal && (
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenAddModal}
            className="h-8 px-2.5 sm:px-3 text-xs"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Add Habit</span>
          </Button>
        )}

        {/* Local Profile / Workspace Area (No Auth Implied) */}
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-expanded={isSettingsOpen}
            aria-haspopup="true"
            aria-label="Workspace settings and session details"
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg bg-[#F8F9F6] hover:bg-[#F0F4F0] border border-[#E3E7E1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]"
          >
            <div className="h-6 w-6 rounded-full bg-[#6D896F] text-white flex items-center justify-center text-xs font-semibold shrink-0">
              ST
            </div>
            <span className="text-xs font-medium text-[#20251F] hidden md:inline">
              Student
            </span>
            <SlidersHorizontal className="h-3 w-3 text-[#737B72]" aria-hidden="true" />
          </button>

          {/* Profile / Local Preferences Popover */}
          {isSettingsOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#E3E7E1] shadow-md p-4 text-xs z-30 animate-in fade-in zoom-in-95 duration-100"
              role="dialog"
              aria-label="Local session preferences"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E7E1]">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#F0F4F0] text-[#5A735C] flex items-center justify-center font-bold">
                    ST
                  </div>
                  <div>
                    <p className="font-semibold text-[#20251F]">Student Workspace</p>
                    <p className="text-[11px] text-[#737B72]">Local Browser Session</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-md text-[#737B72] hover:text-[#20251F] hover:bg-[#F0F4F0]"
                  aria-label="Close preferences"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="py-3 space-y-2 border-b border-[#E3E7E1]">
                <div className="flex items-start gap-2 text-[#737B72]">
                  <HardDrive className="h-3.5 w-3.5 text-[#5A735C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#20251F]">Client-Side Only</span>
                    <p className="text-[11px] text-[#737B72] leading-relaxed mt-0.5">
                      Your habits and logs stay strictly inside this browser. No external cloud sync or accounts.
                    </p>
                  </div>
                </div>
              </div>

              {onResetDefaults && (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      onResetDefaults();
                      setIsSettingsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#737B72] hover:text-[#20251F] hover:bg-[#F4F6F2] border border-[#E3E7E1] transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#8F978E]" />
                    <span>Restore Starter Habits</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
