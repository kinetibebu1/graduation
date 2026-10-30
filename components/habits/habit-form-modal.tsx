"use client";

import React, { useEffect, useState } from "react";
import { Edit3, Sparkles, X } from "lucide-react";
import { HabitColor, PriorityLevel, StudyHabit, UpdateHabitInput } from "@/types/habit";
import { validateHabitInput } from "@/lib/habits/domain";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: StudyHabit | null;
  onAdd?: (habit: Omit<StudyHabit, "id" | "createdAt" | "updatedAt">) => boolean;
  onEdit?: (habitId: string, updates: UpdateHabitInput) => boolean;
}

const SUBJECT_SUGGESTIONS = [
  "Computer Science",
  "Mathematics",
  "Biology",
  "Physics",
  "Literature",
  "History",
  "Exam Prep",
];

const DURATION_PRESETS = [
  { label: "25m (Pomodoro)", minutes: 25 },
  { label: "45m (Deep Focus)", minutes: 45 },
  { label: "60m (Standard)", minutes: 60 },
  { label: "90m (Intensive)", minutes: 90 },
];

const COLOR_OPTIONS: { id: HabitColor; label: string; class: string }[] = [
  { id: "emerald", label: "Sage/Emerald", class: "bg-[#6D896F]" },
  { id: "indigo", label: "Navy/Indigo", class: "bg-[#485C7B]" },
  { id: "amber", label: "Warm Amber", class: "bg-[#B5853B]" },
  { id: "rose", label: "Muted Rose", class: "bg-[#A75454]" },
  { id: "sky", label: "Soft Slate", class: "bg-[#527991]" },
  { id: "purple", label: "Dusty Purple", class: "bg-[#6E5983]" },
];

interface HabitFormInnerProps {
  habitToEdit?: StudyHabit | null;
  onClose: () => void;
  onAdd?: (habit: Omit<StudyHabit, "id" | "createdAt" | "updatedAt">) => boolean;
  onEdit?: (habitId: string, updates: UpdateHabitInput) => boolean;
}

function HabitFormInner({
  habitToEdit,
  onClose,
  onAdd,
  onEdit,
}: HabitFormInnerProps) {
  const isEditMode = Boolean(habitToEdit);

  const [title, setTitle] = useState(habitToEdit?.title ?? "");
  const [subject, setSubject] = useState(habitToEdit?.subject ?? "Computer Science");
  const [description, setDescription] = useState(habitToEdit?.description ?? "");
  const [targetMinutes, setTargetMinutes] = useState(habitToEdit?.targetMinutes ?? 45);
  const [priority, setPriority] = useState<PriorityLevel>(habitToEdit?.priority ?? "medium");
  const [color, setColor] = useState<HabitColor>(habitToEdit?.color ?? "emerald");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isSubmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload: UpdateHabitInput = {
      title: title.trim(),
      subject: subject.trim() || "General Study",
      description: description.trim() || undefined,
      targetMinutes: Number(targetMinutes) || 30,
      priority,
      color,
    };

    const validation = validateHabitInput(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    let success = false;
    if (isEditMode && habitToEdit && onEdit) {
      success = onEdit(habitToEdit.id, payload);
    } else if (onAdd) {
      success = onAdd(payload);
    }

    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E3E7E1] shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-[#E3E7E1] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#F0F4F0] text-[#5A735C] flex items-center justify-center">
            {isEditMode ? (
              <Edit3 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
          </div>
          <div>
            <h3
              id="habit-modal-title"
              className="font-semibold text-[#20251F] text-base leading-tight"
            >
              {isEditMode ? "Edit Study Habit" : "Add Study Habit"}
            </h3>
            <p className="text-xs text-[#737B72] mt-0.5">
              {isEditMode
                ? "Update routine title, duration, and academic category."
                : "Define a deliberate academic routine for your daily checklist."}
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="p-1 rounded-md text-[#737B72] hover:text-[#20251F] hover:bg-[#F0F4F0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errors.general && (
          <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F5C2C2] text-xs text-[#9E3B3B] font-medium">
            {errors.general}
          </div>
        )}

        {/* Title Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="habit-form-title"
              className="block text-xs font-semibold text-[#20251F]"
            >
              Habit Title <span className="text-[#9E3B3B]">*</span>
            </label>
            <span className="text-[11px] text-[#8F978E]">
              {title.length}/100
            </span>
          </div>
          <input
            id="habit-form-title"
            type="text"
            required
            maxLength={100}
            placeholder="e.g., Deep Work Algorithm Problem Sets"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: "" }));
              }
            }}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-lg border bg-white text-[#20251F] placeholder:text-[#8F978E] focus:outline-none focus:ring-2 focus:ring-[#6D896F] focus:border-transparent transition-all",
              errors.title ? "border-[#F5C2C2] bg-[#FDF2F2]/30" : "border-[#E3E7E1]"
            )}
          />
          {errors.title && (
            <p className="text-[11px] text-[#9E3B3B] font-medium">
              {errors.title}
            </p>
          )}
        </div>

        {/* Subject Selection */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="habit-form-subject"
              className="block text-xs font-semibold text-[#20251F]"
            >
              Subject / Course Area <span className="text-[#9E3B3B]">*</span>
            </label>
            <span className="text-[11px] text-[#8F978E]">
              {subject.length}/50
            </span>
          </div>
          <input
            id="habit-form-subject"
            type="text"
            required
            maxLength={50}
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) {
                setErrors((prev) => ({ ...prev, subject: "" }));
              }
            }}
            placeholder="e.g., Mathematics"
            className={cn(
              "w-full px-3 py-2 text-sm rounded-lg border bg-white text-[#20251F] placeholder:text-[#8F978E] focus:outline-none focus:ring-2 focus:ring-[#6D896F] focus:border-transparent transition-all",
              errors.subject ? "border-[#F5C2C2] bg-[#FDF2F2]/30" : "border-[#E3E7E1]"
            )}
          />
          {errors.subject && (
            <p className="text-[11px] text-[#9E3B3B] font-medium">
              {errors.subject}
            </p>
          )}
          {/* Quick Suggestion Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUBJECT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSubject(s);
                  if (errors.subject) {
                    setErrors((prev) => ({ ...prev, subject: "" }));
                  }
                }}
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer",
                  subject === s
                    ? "bg-[#F0F4F0] border-[#6D896F] text-[#3E5540] font-semibold"
                    : "bg-[#F8F9F6] border-[#E3E7E1] text-[#737B72] hover:text-[#20251F]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Target Duration */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="habit-form-duration"
              className="block text-xs font-semibold text-[#20251F]"
            >
              Target Duration (Minutes)
            </label>
            <span className="text-[11px] text-[#737B72]">5 – 480 mins</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="habit-form-duration"
              type="number"
              min={5}
              max={480}
              step={5}
              value={targetMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTargetMinutes(Number.isNaN(val) ? 0 : val);
                if (errors.targetMinutes) {
                  setErrors((prev) => ({ ...prev, targetMinutes: "" }));
                }
              }}
              className={cn(
                "w-24 px-3 py-1.5 text-sm rounded-lg border bg-white text-[#20251F] focus:outline-none focus:ring-2 focus:ring-[#6D896F]",
                errors.targetMinutes ? "border-[#F5C2C2]" : "border-[#E3E7E1]"
              )}
            />
            <div className="flex flex-wrap gap-1.5 flex-1">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.minutes}
                  type="button"
                  onClick={() => {
                    setTargetMinutes(preset.minutes);
                    if (errors.targetMinutes) {
                      setErrors((prev) => ({ ...prev, targetMinutes: "" }));
                    }
                  }}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer",
                    targetMinutes === preset.minutes
                      ? "border-[#6D896F] bg-[#F0F4F0] text-[#3E5540] font-semibold ring-1 ring-[#6D896F]/30"
                      : "border-[#E3E7E1] bg-white text-[#737B72] hover:border-[#D1D8CE] hover:text-[#20251F]"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          {errors.targetMinutes && (
            <p className="text-[11px] text-[#9E3B3B] font-medium">
              {errors.targetMinutes}
            </p>
          )}
        </div>

        {/* Priority Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#20251F]">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as PriorityLevel[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "py-1.5 px-3 text-xs rounded-lg border capitalize text-center font-medium transition-all cursor-pointer",
                  priority === p
                    ? "border-[#6D896F] bg-[#F0F4F0] text-[#3E5540] font-semibold ring-1 ring-[#6D896F]/30"
                    : "border-[#E3E7E1] bg-white text-[#737B72] hover:text-[#20251F]"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Color Badge Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#20251F]">
            Tag Tone
          </label>
          <div className="flex items-center gap-2.5 pt-1">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                title={c.label}
                aria-label={`Select ${c.label} color tone`}
                className={cn(
                  "h-6 w-6 rounded-full transition-transform cursor-pointer",
                  c.class,
                  color === c.id
                    ? "ring-2 ring-offset-2 ring-[#6D896F] scale-110"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                )}
              />
            ))}
          </div>
        </div>

        {/* Description (Optional) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="habit-form-desc"
              className="block text-xs font-semibold text-[#20251F]"
            >
              Notes / Focus Intent (Optional)
            </label>
            <span className="text-[11px] text-[#8F978E]">
              {description.length}/300
            </span>
          </div>
          <textarea
            id="habit-form-desc"
            rows={2}
            maxLength={300}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Work in silence with phone outside the room."
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E3E7E1] bg-white text-[#20251F] placeholder:text-[#8F978E] focus:outline-none focus:ring-2 focus:ring-[#6D896F] focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Dialog Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3E7E1]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditMode ? "Save Changes" : "Save Habit"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function HabitFormModal({
  isOpen,
  onClose,
  habitToEdit,
  onAdd,
  onEdit,
}: HabitFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#20251F]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <HabitFormInner
        key={habitToEdit ? habitToEdit.id : "create-habit"}
        habitToEdit={habitToEdit}
        onClose={onClose}
        onAdd={onAdd}
        onEdit={onEdit}
      />
    </div>
  );
}
