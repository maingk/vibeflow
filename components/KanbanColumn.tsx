"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus, Inbox, Zap, CheckCircle2, Flag } from "lucide-react";
import { KanbanCard } from "./KanbanCard";
import { EmptyState } from "./EmptyState";
import { KanbanCard as KanbanCardType, Column, ColumnId } from "@/types";

const columnIcons: Record<ColumnId, typeof Inbox> = {
  todo: Inbox,
  inProgress: Zap,
  complete: CheckCircle2,
};

const columnEmptyMessages: Record<ColumnId, { title: string; description: string }> = {
  todo: {
    title: "No tasks yet",
    description: "Add your first card to get started on your project",
  },
  inProgress: {
    title: "Nothing in progress",
    description: "Drag cards here when you start working on them",
  },
  complete: {
    title: "No completed tasks",
    description: "Completed cards will appear here",
  },
};

interface Props {
  column: Column;
  cards: KanbanCardType[];
  onDeleteCard: (id: string) => void;
  onDuplicateCard: (id: string) => void;
  onAddCard: () => void;
  isOver: boolean;
}

export function KanbanColumn({ column, cards, onDeleteCard, onDuplicateCard, onAddCard, isOver }: Props) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const highPriorityCount = cards.filter((c) => c.priority === "high").length;
  const mediumPriorityCount = cards.filter((c) => c.priority === "medium").length;
  const lowPriorityCount = cards.filter((c) => c.priority === "low").length;
  const hasPriorities = highPriorityCount + mediumPriorityCount + lowPriorityCount > 0;

  return (
    <div
      className={`flex flex-col flex-1 min-w-[240px] max-w-[320px] rounded-lg bg-surface/30 p-3 transition-colors ${
        isOver
          ? "border-2 border-accent bg-accent/10"
          : "border border-border"
      }`}
    >
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
            {column.title}
          </h2>
          <span className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded">
            {cards.length}
          </span>
        </div>

        {/* Priority indicators */}
        {hasPriorities && cards.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {highPriorityCount > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-red-400">
                <Flag size={10} />
                <span>{highPriorityCount}</span>
              </div>
            )}
            {mediumPriorityCount > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-amber-400">
                <Flag size={10} />
                <span>{mediumPriorityCount}</span>
              </div>
            )}
            {lowPriorityCount > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-blue-400">
                <Flag size={10} />
                <span>{lowPriorityCount}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 min-h-[200px] rounded-lg p-2"
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.length === 0 ? (
            <EmptyState
              icon={columnIcons[column.id]}
              title={columnEmptyMessages[column.id].title}
              description={columnEmptyMessages[column.id].description}
              action={
                column.id === "todo"
                  ? {
                      label: "Add your first card →",
                      onClick: onAddCard,
                    }
                  : undefined
              }
            />
          ) : (
            <div className="flex flex-col gap-2">
              {cards.map((card) => (
                <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} onDuplicate={onDuplicateCard} />
              ))}
            </div>
          )}
        </SortableContext>
        <button
          onClick={onAddCard}
          className="w-full mt-2 p-2 flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
        >
          <Plus size={16} />
          <span>Add card</span>
        </button>
      </div>
    </div>
  );
}
