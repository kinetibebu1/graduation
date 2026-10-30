"use client";

import React from "react";
import {
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  Flame,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { StudyHabit } from "@/types/habit";
import { cn, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface HabitCardProps {
  habit: StudyHabit;
  isCompleted: boolean;
  streak: number;
  isFirst?: boolean;
  isLast?: boolean;
  showReorder?: boolean;
  onToggle: (habitId: string) => void;
  onEdit?: (habit: StudyHabit) => void;
  onArchive?: (habitId: string) => void;
  onRestore?: (habitId: string) => void;
  onMove?: (habitId: string, direction: "up" | "down") => void;
  onDelete: (habit: StudyHabit) => void;
}

export function HabitCard({
  habit,
  isCompleted,
  streak,
  isFirst = false,
  isLast = false,
  showReorder = false,
  onToggle,
  onEdit,
  onArchive,
  onRestore,
  onMove,
  onDelete,
}: HabitCardProps) {
  const isArchived = Boolean(habit.archived);

  const priorityBadgeVariant = {
    high: "danger",
    medium: "warning",
    low: "default",
  }[habit.priority] as "danger" | "warning" | "default";

  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 p-4 rounded-xl border transition-all duration-150",
        isArchived
          ? "bg-[#F8F9F6] border-[#E3E7E1] opacity-90"
          : isCompleted
          ? "bg-[#FAFBF9] border-[#E3E7E1] text-[#737B72]"
          : "bg-white border-[#E3E7E1] shadow-[0_1px_2px_rgba(32,37,31,0.02)] hover:border-[#CFD6CD] hover:shadow-[0_2px_4px_rgba(32,37,31,0.04)]"
      )}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Checkbox Button */}
        <button
          type="button"
          disabled={isArchived}
          onClick={(e) => {
            e.stopPropagation();
            if (!isArchived) {
              onToggle(habit.id);
            }
          }}
          aria-label={
            isArchived
              ? `"${habit.title}" is archived`
              : isCompleted
              ? `Mark "${habit.title}" as incomplete`
              : `Mark "${habit.title}" as completed`
          }
          className={cn(
            "mt-0.5 h-5 w-5 rounded-md flex items-center justify-center shrink-0 border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] focus-visible:ring-offset-2",
            isArchived
              ? "border-[#D8DFD7] bg-[#EEF2EC] text-[#8F978E] cursor-not-allowed opacity-60"
              : isCompleted
              ? "bg-[#6D896F] border-[#6D896F] text-white shadow-xs cursor-pointer"
              : "border-[#CFD6CD] bg-white hover:border-[#6D896F] hover:bg-[#F0F4F0] text-transparent cursor-pointer"
          )}
        >
          <Check
            className={cn(
              "h-3.5 w-3.5 stroke-[2.5]",
              isCompleted && !isArchived ? "opacity-100" : "opacity-0"
            )}
          />
        </button>

        {/* Habit Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <Badge colorTheme={habit.color}>{habit.subject}</Badge>

            {habit.priority === "high" && (
              <Badge variant={priorityBadgeVariant}>High Priority</Badge>
            )}

            {isArchived ? (
              <span className="inline-flex items-center text-[11px] font-semibold text-[#737B72] bg-[#EEF2EC] border border-[#D8DFD7] px-2 py-0.5 rounded-md">
                Archived
              </span>
            ) : streak > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#785422] bg-[#FBF6ED] border border-[#EDE1CF] px-2 py-0.5 rounded-md">
                <Flame className="h-3 w-3 fill-[#B5853B] text-[#B5853B]" />
                <span>{streak}d streak</span>
              </span>
            ) : null}
          </div>

          <h4
            className={cn(
              "text-sm font-semibold text-[#20251F] leading-snug transition-colors break-words",
              isCompleted && !isArchived && "line-through text-[#8F978E]",
              isArchived && "text-[#737B72]"
            )}
          >
            {habit.title}
          </h4>

          {habit.description && (
            <p
              className={cn(
                "text-xs mt-1 line-clamp-2 leading-relaxed break-words",
                isCompleted || isArchived ? "text-[#8F978E]" : "text-[#737B72]"
              )}
            >
              {habit.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2.5 text-xs text-[#737B72]">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#8F978E]" />
              <span>Target: {formatDuration(habit.targetMinutes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls Toolbar */}
      <div className="flex items-center gap-1 shrink-0 self-end sm:self-start pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAEFE8] w-full sm:w-auto justify-end">
        {/* Reorder Buttons (Move Up / Move Down) - for active habits */}
        {showReorder && !isArchived && onMove && (
          <div className="flex items-center gap-0.5 mr-1 border-r border-[#E3E7E1] pr-1.5">
            <button
              type="button"
              disabled={isFirst}
              onClick={(e) => {
                e.stopPropagation();
                if (!isFirst) onMove(habit.id, "up");
              }}
              aria-label={`Move "${habit.title}" up`}
              title="Move habit up"
              className="p-1.5 text-[#8F978E] hover:text-[#20251F] hover:bg-[#F0F4F0] rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={(e) => {
                e.stopPropagation();
                if (!isLast) onMove(habit.id, "down");
              }}
              aria-label={`Move "${habit.title}" down`}
              title="Move habit down"
              className="p-1.5 text-[#8F978E] hover:text-[#20251F] hover:bg-[#F0F4F0] rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Edit Button */}
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(habit);
            }}
            aria-label={`Edit "${habit.title}"`}
            title="Edit habit"
            className="p-1.5 text-[#8F978E] hover:text-[#20251F] hover:bg-[#F0F4F0] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Archive Button (for active habits) */}
        {!isArchived && onArchive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(habit.id);
            }}
            aria-label={`Archive "${habit.title}"`}
            title="Archive habit"
            className="p-1.5 text-[#8F978E] hover:text-[#785422] hover:bg-[#FBF6ED] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] cursor-pointer"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Restore Button (for archived habits) */}
        {isArchived && onRestore && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRestore(habit.id);
            }}
            aria-label={`Restore "${habit.title}" to active habits`}
            title="Restore habit"
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#3E5540] bg-[#F0F4F0] hover:bg-[#E3EAE3] border border-[#D8DFD7] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore</span>
          </button>
        )}

        {/* Permanent Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(habit);
          }}
          aria-label={`Delete "${habit.title}" permanently`}
          title="Delete habit"
          className="p-1.5 text-[#8F978E] hover:text-[#9E3B3B] hover:bg-[#FDF2F2] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
