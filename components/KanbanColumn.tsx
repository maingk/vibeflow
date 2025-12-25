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
  onEditCard: (id: string) => void;
  onAddCard: () => void;
  isOver: boolean;
}

export function KanbanColumn({ column, cards, onDeleteCard, onDuplicateCard, onEditCard, onAddCard, isOver }: Props) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const highPriorityCount = cards.filter((c) => c.priority === "high").length;
  const mediumPriorityCount = cards.filter((c) => c.priority === "medium").length;
  const lowPriorityCount = cards.filter((c) => c.priority === "low").length;
  const hasPriorities = highPriorityCount + mediumPriorityCount + lowPriorityCount > 0;

  const Icon = columnIcons[column.id];

  return (
    <div
      className={`flex flex-col flex-1 min-w-[280px] max-w-[340px] rounded-2xl glass p-4 transition-all duration-300 ${
        isOver
          ? "border-2 border-[var(--gradient-cyan)] bg-[var(--gradient-cyan)]/5 scale-[1.02] shadow-xl"
          : "border border-border/30 hover:border-border/50"
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              column.id === 'todo' ? 'bg-[var(--gradient-cyan)]/10 text-[var(--gradient-cyan)]' :
              column.id === 'inProgress' ? 'bg-[var(--gradient-magenta)]/10 text-[var(--gradient-magenta)]' :
              'bg-[var(--gradient-orange)]/10 text-[var(--gradient-orange)]'
            }`}>
              <Icon size={16} />
            </div>
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-widest font-mono">
              {column.title}
            </h2>
          </div>
          <span className="text-xs font-bold text-text-secondary bg-surface/50 px-2.5 py-1 rounded-lg font-mono border border-border/30">
            {cards.length}
          </span>
        </div>

        {/* Priority indicators */}
        {hasPriorities && cards.length > 0 && (
          <div className="flex items-center gap-2">
            {highPriorityCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold text-[var(--gradient-orange)] bg-[var(--gradient-orange)]/10 border border-[var(--gradient-orange)]/20 font-mono">
                <Flag size={11} />
                <span>{highPriorityCount}</span>
              </div>
            )}
            {mediumPriorityCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold text-[var(--gradient-magenta)] bg-[var(--gradient-magenta)]/10 border border-[var(--gradient-magenta)]/20 font-mono">
                <Flag size={11} />
                <span>{mediumPriorityCount}</span>
              </div>
            )}
            {lowPriorityCount > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold text-[var(--gradient-cyan)] bg-[var(--gradient-cyan)]/10 border border-[var(--gradient-cyan)]/20 font-mono">
                <Flag size={11} />
                <span>{lowPriorityCount}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 min-h-[200px] rounded-xl p-3"
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
            <div className="flex flex-col gap-3">
              {cards.map((card, index) => (
                <div key={card.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <KanbanCard card={card} onDelete={onDeleteCard} onDuplicate={onDuplicateCard} onEdit={onEditCard} />
                </div>
              ))}
            </div>
          )}
        </SortableContext>
        <button
          onClick={onAddCard}
          className="group w-full mt-3 p-3 flex items-center justify-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary glass border border-border/30 hover:border-[var(--gradient-cyan)]/30 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)] focus:ring-offset-2 focus:ring-offset-surface font-mono uppercase tracking-wide"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Card</span>
        </button>
      </div>
    </div>
  );
}
