"use client";

import { useState, useRef, useEffect } from "react";
import { X, Flag, Calendar, User, Tag, Plus } from "lucide-react";
import { KanbanCard, Priority } from "@/types";

interface Props {
  card: KanbanCard;
  onUpdate: (id: string, updates: Partial<KanbanCard>) => void;
  onClose: () => void;
}

export function EditCardModal({ card, onUpdate, onClose }: Props) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [priority, setPriority] = useState<Priority | undefined>(card.priority);
  const [dueDate, setDueDate] = useState<string>(
    card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ""
  );
  const [assignee, setAssignee] = useState<string>(card.assignee || "");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>(card.tags || []);
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
      onUpdate(card.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDateTimestamp,
        assignee: assignee.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      onClose();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="glass border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-float-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="text-xl font-bold text-text-primary">Edit Card</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface/50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)]"
            aria-label="Close modal"
            tabIndex={0}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider font-mono">
                Title
              </label>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-background/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-[var(--gradient-cyan)] focus:ring-2 focus:ring-[var(--gradient-cyan)]/30 transition-all"
                placeholder="What needs to be done?"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider font-mono">
                Description
                <span className="text-text-secondary/50 ml-1 normal-case">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-background/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-[var(--gradient-cyan)] focus:ring-2 focus:ring-[var(--gradient-cyan)]/30 transition-all resize-none"
                placeholder="Add more details..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider font-mono">
                Priority
                <span className="text-text-secondary/50 ml-1 normal-case">(optional)</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPriority(priority === "low" ? undefined : "low")}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)] font-mono ${
                    priority === "low"
                      ? "bg-[var(--gradient-cyan)]/20 text-[var(--gradient-cyan)] border-2 border-[var(--gradient-cyan)]/50"
                      : "glass border border-border/30 text-text-secondary hover:text-text-primary hover:border-border/60"
                  }`}
                >
                  <Flag size={12} className="inline mr-1" />
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(priority === "medium" ? undefined : "medium")}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-magenta)] font-mono ${
                    priority === "medium"
                      ? "bg-[var(--gradient-magenta)]/20 text-[var(--gradient-magenta)] border-2 border-[var(--gradient-magenta)]/50"
                      : "glass border border-border/30 text-text-secondary hover:text-text-primary hover:border-border/60"
                  }`}
                >
                  <Flag size={12} className="inline mr-1" />
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setPriority(priority === "high" ? undefined : "high")}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-orange)] font-mono ${
                    priority === "high"
                      ? "bg-[var(--gradient-orange)]/20 text-[var(--gradient-orange)] border-2 border-[var(--gradient-orange)]/50"
                      : "glass border border-border/30 text-text-secondary hover:text-text-primary hover:border-border/60"
                  }`}
                >
                  <Flag size={12} className="inline mr-1" />
                  High
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider font-mono">
                <User size={12} className="inline mr-1" />
                Assignee
                <span className="text-text-secondary/50 ml-1 normal-case">(optional)</span>
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-background/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-[var(--gradient-cyan)] focus:ring-2 focus:ring-[var(--gradient-cyan)]/30 transition-all"
                placeholder="Enter name..."
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider font-mono">
                <Tag size={12} className="inline mr-1" />
                Tags
                <span className="text-text-secondary/50 ml-1 normal-case">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 bg-background/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-[var(--gradient-cyan)] focus:ring-2 focus:ring-[var(--gradient-cyan)]/30 transition-all"
                  placeholder="Add tag and press Enter..."
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 bg-[var(--gradient-cyan)] hover:bg-[var(--gradient-cyan)]/80 text-white rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)] focus:ring-offset-2 focus:ring-offset-background"
                >
                  <Plus size={16} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--gradient-cyan)]/10 text-[var(--gradient-cyan)] text-xs rounded-md border border-[var(--gradient-cyan)]/20"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-[var(--gradient-cyan)]/80 focus:outline-none"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider font-mono">
                <Calendar size={12} className="inline mr-1" />
                Due Date
                <span className="text-text-secondary/50 ml-1 normal-case">(optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-background/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-[var(--gradient-cyan)] focus:ring-2 focus:ring-[var(--gradient-cyan)]/30 transition-all [color-scheme:dark]"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary glass border border-border/30 rounded-xl hover:border-border/60 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)] font-mono uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-[var(--gradient-cyan)] to-[var(--gradient-magenta)] hover:from-[var(--gradient-magenta)] hover:to-[var(--gradient-orange)] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--gradient-cyan)] focus:ring-offset-2 shadow-lg font-mono uppercase tracking-wide"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
