"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, Flag, Clock, Calendar, AlertCircle, Copy } from "lucide-react";
import { KanbanCard as KanbanCardType, ColumnId, Priority } from "@/types";

const columnStyles: Record<ColumnId, string> = {
  todo: "border-l-blue-500 bg-blue-500/5",
  inProgress: "border-l-amber-500 bg-amber-500/5",
  complete: "border-l-green-500 bg-green-500/5",
};

const priorityStyles: Record<Priority, { color: string; bg: string }> = {
  low: { color: "text-blue-400", bg: "bg-blue-500/10" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10" },
  high: { color: "text-red-400", bg: "bg-red-500/10" },
};

interface Props {
  card: KanbanCardType;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `Due in ${diffDays}d`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function isOverdue(timestamp: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
}

function isDueSoon(timestamp: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(timestamp);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
}

export function KanbanCard({ card, onDelete, onDuplicate }: Props) {
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

  const cardIsOverdue = card.dueDate && isOverdue(card.dueDate);
  const cardIsDueSoon = card.dueDate && !cardIsOverdue && isDueSoon(card.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border border-border border-l-4 rounded-lg p-3 cursor-default transition-colors ${
        columnStyles[card.column]
      } ${isDragging ? "opacity-50 shadow-lg shadow-black/20" : ""} ${
        cardIsOverdue ? "ring-2 ring-red-500/30 bg-red-500/5" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 -ml-1 text-text-secondary opacity-50 group-hover:opacity-100 hover:text-text-primary cursor-grab active:cursor-grabbing transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
          aria-label="Drag card"
          title="Drag to move card"
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

          {/* Footer with metadata */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {card.priority && (
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${priorityStyles[card.priority].bg} ${priorityStyles[card.priority].color}`}
              >
                <Flag size={10} />
                <span className="capitalize">{card.priority}</span>
              </div>
            )}
            {card.dueDate && (
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                  cardIsOverdue
                    ? "bg-red-500/20 text-red-400"
                    : cardIsDueSoon
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-surface text-text-secondary"
                }`}
              >
                {cardIsOverdue ? (
                  <AlertCircle size={10} />
                ) : (
                  <Calendar size={10} />
                )}
                <span>{formatDueDate(card.dueDate)}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <Clock size={10} />
              <span>{formatRelativeTime(card.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(card.id)}
            className="p-1 text-text-secondary opacity-30 group-hover:opacity-100 hover:text-accent transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
            aria-label={`Duplicate card: ${card.title}`}
            title="Duplicate card"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1 -mr-1 text-text-secondary opacity-30 group-hover:opacity-100 hover:text-red-400 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-background rounded"
            aria-label={`Delete card: ${card.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
