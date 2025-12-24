"use client";

import { useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatches = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const metaMatches = shortcut.metaKey ? e.metaKey : true;

        if (keyMatches && ctrlMatches && shiftMatches && metaMatches) {
          // Don't trigger if user is typing in an input or textarea
          if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement
          ) {
            // Allow escape key to blur inputs
            if (e.key === "Escape") {
              (e.target as HTMLElement).blur();
              e.preventDefault();
              shortcut.callback();
            }
            continue;
          }

          e.preventDefault();
          shortcut.callback();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export const KEYBOARD_SHORTCUTS: Record<string, string> = {
  "n": "Add new card to To Do column",
  "/": "Focus search",
  "Escape": "Close modals and clear focus",
  "?": "Show keyboard shortcuts",
};
