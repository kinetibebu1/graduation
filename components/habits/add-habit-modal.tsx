"use client";

import React from "react";
import { StudyHabit } from "@/types/habit";
import { HabitFormModal } from "@/components/habits/habit-form-modal";

export interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<StudyHabit, "id" | "createdAt" | "updatedAt">) => boolean;
}

/**
 * AddHabitModal reuses the unified HabitFormModal to ensure consistent validation,
 * styling, and behavior without duplicating form logic.
 */
export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  return (
    <HabitFormModal
      isOpen={isOpen}
      onClose={onClose}
      onAdd={onAdd}
    />
  );
}
