"use client";

import { X, Keyboard } from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "@/hooks/useKeyboardShortcuts";

interface Props {
  onClose: () => void;
}

export function KeyboardShortcutsModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {Object.entries(KEYBOARD_SHORTCUTS).map(([key, description]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-text-secondary">{description}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-surface border border-border rounded text-text-primary">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-text-secondary text-center">
            Press <kbd className="px-1 py-0.5 text-xs font-mono bg-surface border border-border rounded">Escape</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
