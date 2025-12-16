"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";
import { KanbanCard as KanbanCardType, ColumnId } from "@/types";

const columnStyles: Record<ColumnId, string> = {
  todo: "border-l-blue-500 bg-blue-500/5",
  inProgress: "border-l-amber-500 bg-amber-500/5",
  complete: "border-l-green-500 bg-green-500/5",
};

interface Props {
  card: KanbanCardType;
  onDelete: (id: string) => void;
}

export function KanbanCard({ card, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border border-border border-l-4 rounded-lg p-3 cursor-default transition-colors ${
        columnStyles[card.column]
      } ${isDragging ? "opacity-50 shadow-lg shadow-black/20" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 -ml-1 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-text-primary cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary font-medium leading-snug">
            {card.title}
          </p>
          {card.description && (
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {card.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(card.id)}
          className="p-1 -mr-1 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
