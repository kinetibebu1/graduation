"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Compass,
  LayoutDashboard,
  TrendingUp,
  X,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  todayDateStr?: string;
  onOpenAddModal?: () => void;
  onResetDefaults?: () => void;
}

export function AppShell({
  children,
  todayDateStr,
  onOpenAddModal,
  onResetDefaults,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile drawer on route change during render without effect cascade
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const mobileNavItems = [
    {
      label: "Overview",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      label: "My Habits",
      href: "/habits",
      icon: CheckSquare,
      active: pathname === "/habits",
    },
    {
      label: "Progress",
      href: "/progress",
      icon: TrendingUp,
      active: pathname === "/progress",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F9F6] text-[#20251F]">
      {/* Desktop Fixed-width Left Sidebar */}
      <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        <AppSidebar
          onOpenAddModal={onOpenAddModal}
          className="h-full"
        />
      </div>

      {/* Accessible Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#20251F]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 px-4 border-b border-[#E3E7E1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#6D896F] text-white flex items-center justify-center">
                  <Compass className="h-4 w-4" />
                </div>
                <span className="font-bold text-[#20251F]">StudyHabit</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#737B72] hover:text-[#20251F] hover:bg-[#F0F4F0]"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AppSidebar
                onOpenAddModal={onOpenAddModal}
                onNavigate={() => setMobileMenuOpen(false)}
                className="w-full border-r-0 h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          todayDateStr={todayDateStr}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddModal={onOpenAddModal}
          onResetDefaults={onResetDefaults}
        />

        <main className="flex-1 pb-16 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Accessible & Thumb-Friendly) */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-[#E3E7E1] h-14 flex items-center justify-around px-2"
          aria-label="Mobile Bottom Navigation"
        >
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]",
                  item.active
                    ? "text-[#4F6550] font-semibold"
                    : "text-[#737B72] hover:text-[#20251F]"
                )}
                aria-current={item.active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 mb-0.5",
                    item.active ? "text-[#5A735C]" : "text-[#8F978E]"
                  )}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
