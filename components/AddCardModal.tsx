"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { ColumnId } from "@/types";

interface Props {
  column: ColumnId;
  onAdd: (title: string, description: string, column: ColumnId) => void;
  onClose: () => void;
}

export function AddCardModal({ column, onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim(), column);
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
        className="bg-surface border border-border rounded-xl p-5 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-text-primary">New Card</h2>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
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
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="What needs to be done?"
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
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Add more details..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
