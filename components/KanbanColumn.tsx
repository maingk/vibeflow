"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { KanbanCard } from "./KanbanCard";
import { KanbanCard as KanbanCardType, Column } from "@/types";

interface Props {
  column: Column;
  cards: KanbanCardType[];
  onDeleteCard: (id: string) => void;
  onAddCard: () => void;
  isOver: boolean;
}

export function KanbanColumn({ column, cards, onDeleteCard, onAddCard, isOver }: Props) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className={`flex flex-col flex-1 min-w-[240px] max-w-[320px] rounded-lg bg-surface/30 p-3 transition-colors ${
        isOver
          ? "border-2 border-accent bg-accent/10"
          : "border border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
          {column.title}
        </h2>
        <span className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded">
          {cards.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 min-h-[200px] rounded-lg p-2"
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {cards.map((card) => (
              <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
            ))}
          </div>
        </SortableContext>
        <button
          onClick={onAddCard}
          className="w-full mt-2 p-2 flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add card</span>
        </button>
      </div>
    </div>
  );
}
