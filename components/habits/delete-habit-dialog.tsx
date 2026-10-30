"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { DeleteHabitOptions, StudyHabit } from "@/types/habit";
import { Button } from "@/components/ui/button";

export interface DeleteHabitDialogProps {
  isOpen: boolean;
  habit: StudyHabit | null;
  onClose: () => void;
  onConfirm: (habitId: string, options?: DeleteHabitOptions) => void;
}

interface DeleteHabitDialogContentProps {
  habit: StudyHabit;
  onClose: () => void;
  onConfirm: (habitId: string, options?: DeleteHabitOptions) => void;
}

function DeleteHabitDialogContent({
  habit,
  onClose,
  onConfirm,
}: DeleteHabitDialogContentProps) {
  const [purgeLogs, setPurgeLogs] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-focus cancel button for safe keyboard navigation
  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isDeleting]);

  const handleDelete = () => {
    if (isDeleting) return;
    setIsDeleting(true);
    onConfirm(habit.id, { purgeHistoricalLogs: purgeLogs });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-habit-title"
      aria-describedby="delete-habit-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#20251F]/40 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isDeleting) onClose();
        }}
        aria-hidden="true"
      />

      {/* Dialog Body */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E3E7E1] shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 space-y-4">
          {/* Header Icon + Title */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FDF2F2] border border-[#F5C2C2] text-[#9E3B3B] flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3
                  id="delete-habit-title"
                  className="font-semibold text-[#20251F] text-base leading-tight"
                >
                  Delete Study Habit
                </h3>
                <p className="text-xs text-[#737B72] mt-0.5">
                  Confirm permanent removal of routine.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              className="p-1 rounded-md text-[#737B72] hover:text-[#20251F] hover:bg-[#F0F4F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]"
              aria-label="Close delete dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Confirmation Message */}
          <p id="delete-habit-desc" className="text-sm text-[#20251F] leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-[#20251F] break-words">
              &ldquo;{habit.title}&rdquo;
            </span>
            ? This action cannot be undone.
          </p>

          {/* Explicit Historical Retention Policy Callout */}
          <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E3E7E1] space-y-2 text-xs text-[#737B72]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-[#B5853B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-semibold text-[#20251F] block">
                  Historical Records Policy
                </span>
                <p className="mt-0.5 leading-relaxed text-[#737B72]">
                  By default, past study completion records are preserved as historical data so your lifetime study stats and past consistency records remain honest and accurate.
                </p>
              </div>
            </div>

            {/* Optional Purge Checkbox */}
            <label className="flex items-start gap-2.5 pt-2 border-t border-[#EAEFE8] cursor-pointer group">
              <input
                type="checkbox"
                checked={purgeLogs}
                onChange={(e) => setPurgeLogs(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#CFD6CD] text-[#9E3B3B] focus:ring-[#9E3B3B] cursor-pointer"
              />
              <span className="text-xs text-[#20251F] leading-tight select-none">
                Also purge historical completion records for this habit{" "}
                <span className="text-[#9E3B3B] font-medium block text-[11px] mt-0.5">
                  (Past check-ins for this habit will be removed permanently)
                </span>
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3E7E1]">
            <Button
              ref={cancelButtonRef}
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              disabled={isDeleting}
              onClick={handleDelete}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeleteHabitDialog({
  isOpen,
  habit,
  onClose,
  onConfirm,
}: DeleteHabitDialogProps) {
  if (!isOpen || !habit) return null;

  return (
    <DeleteHabitDialogContent
      key={habit.id}
      habit={habit}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
