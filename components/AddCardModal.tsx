"use client";

import { useState, useRef, useEffect } from "react";
import { X, Flag, Calendar } from "lucide-react";
import { ColumnId, Priority } from "@/types";

interface Props {
  column: ColumnId;
  onAdd: (title: string, description: string, column: ColumnId, priority?: Priority, dueDate?: number) => void;
  onClose: () => void;
}

export function AddCardModal({ column, onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabTrap);
    return () => document.removeEventListener("keydown", handleTabTrap);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const dueDateTimestamp = dueDate ? new Date(dueDate).getTime() : undefined;
      onAdd(title.trim(), description.trim(), column, priority, dueDateTimestamp);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-surface border border-border rounded-xl p-5 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-medium text-text-primary">New Card</h2>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded"
            aria-label="Close modal"
            tabIndex={0}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Title
              </label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors"
                placeholder="What needs to be done?"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Description
                <span className="text-text-secondary/50 ml-1">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors resize-none"
                placeholder="Add more details..."
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Priority
                <span className="text-text-secondary/50 ml-1">(optional)</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPriority(priority === "low" ? undefined : "low")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface ${
                    priority === "low"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                      : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border"
                  }`}
                >
                  <Flag size={12} className="inline mr-1" />
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(priority === "medium" ? undefined : "medium")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface ${
                    priority === "medium"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                      : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border"
                  }`}
                >
                  <Flag size={12} className="inline mr-1" />
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(priority === "high" ? undefined : "high")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface ${
                    priority === "high"
                      ? "bg-red-500/20 text-red-400 border border-red-500/50"
                      : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border"
                  }`}
                >
                  <Flag size={12} className="inline mr-1" />
                  High
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                <Calendar size={12} className="inline mr-1" />
                Due Date
                <span className="text-text-secondary/50 ml-1">(optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            >
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
