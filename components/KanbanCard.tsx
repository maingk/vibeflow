"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, Flag, Clock, Calendar, AlertCircle, Copy, Edit2 } from "lucide-react";
import { KanbanCard as KanbanCardType, Priority } from "@/types";

const priorityStyles: Record<Priority, { color: string; bg: string }> = {
  low: { color: "text-[var(--gradient-cyan)]", bg: "bg-[var(--gradient-cyan)]/10" },
  medium: { color: "text-[var(--gradient-magenta)]", bg: "bg-[var(--gradient-magenta)]/10" },
  high: { color: "text-[var(--gradient-orange)]", bg: "bg-[var(--gradient-orange)]/10" },
};

interface Props {
  card: KanbanCardType;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
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

export function KanbanCard({ card, onDelete, onDuplicate, onEdit }: Props) {
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
      className={`group relative rounded-xl overflow-hidden cursor-default transition-all duration-300 glass border ${
        cardIsOverdue
          ? "border-red-500/60 ring-2 ring-red-500/30 bg-red-500/5"
          : "border-border/30 hover:border-border/60"
      } ${isDragging ? "opacity-50 shadow-2xl scale-105" : "hover:shadow-lg"} animate-float-in glow-border`}
    >
      {/* Column accent bar - top */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] ${
          card.column === 'todo' ? 'bg-gradient-to-r from-[var(--gradient-cyan)] to-[var(--gradient-cyan)]/50' :
          card.column === 'inProgress' ? 'bg-gradient-to-r from-[var(--gradient-magenta)] to-[var(--gradient-magenta)]/50' :
          'bg-gradient-to-r from-[var(--gradient-orange)] to-[var(--gradient-orange)]/50'
        }`}
      />

      {/* Drag handle - positioned absolutely */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-2 top-4 p-1 text-text-secondary/30 group-hover:text-[var(--gradient-cyan)] opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)] rounded-lg hover:bg-surface/50 z-10"
        aria-label="Drag card"
        title="Drag to move card"
      >
        <GripVertical size={14} />
      </button>

      {/* Action buttons - positioned absolutely */}
      <div className="absolute right-2 top-4 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button
          onClick={() => onEdit(card.id)}
          className="p-1.5 text-text-secondary/60 hover:text-[var(--gradient-magenta)] hover:bg-surface/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-magenta)] rounded-lg"
          aria-label={`Edit card: ${card.title}`}
          title="Edit card"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => onDuplicate(card.id)}
          className="p-1.5 text-text-secondary/60 hover:text-[var(--gradient-cyan)] hover:bg-surface/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)] rounded-lg"
          aria-label={`Duplicate card: ${card.title}`}
          title="Duplicate card"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={() => onDelete(card.id)}
          className="p-1.5 text-text-secondary/60 hover:text-red-400 hover:bg-red-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg"
          aria-label={`Delete card: ${card.title}`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Card content */}
      <div className="pt-10 pb-3 px-4">
        <h3 className="text-lg text-text-primary font-bold leading-tight tracking-tight mb-2">
          {card.title}
        </h3>

        {card.description && (
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            {card.description}
          </p>
        )}
      </div>

      {/* Unified metadata footer bar */}
      {(card.priority || card.dueDate) && (
        <div className="relative mt-auto">
          {/* Divider line */}
          <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent" />

          <div className="px-4 py-2.5 flex items-center justify-between gap-2 bg-surface/30">
            <div className="flex items-center gap-2 flex-wrap">
              {card.priority && (
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${priorityStyles[card.priority].bg} ${priorityStyles[card.priority].color} font-mono uppercase tracking-wider`}
                >
                  <Flag size={9} />
                  <span>{card.priority}</span>
                </div>
              )}
              {card.dueDate && (
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold font-mono ${
                    cardIsOverdue
                      ? "bg-red-500/20 text-red-400"
                      : cardIsDueSoon
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-surface/50 text-text-secondary"
                  }`}
                >
                  {cardIsOverdue ? (
                    <AlertCircle size={9} />
                  ) : (
                    <Calendar size={9} />
                  )}
                  <span>{formatDueDate(card.dueDate)}</span>
                </div>
              )}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] text-text-secondary/60 font-mono">
              <Clock size={9} />
              <span>{formatRelativeTime(card.createdAt)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Show time only if no other metadata */}
      {!card.priority && !card.dueDate && (
        <div className="px-4 pb-3">
          <div className="inline-flex items-center gap-1 text-[10px] text-text-secondary/60 font-mono">
            <Clock size={9} />
            <span>{formatRelativeTime(card.createdAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
