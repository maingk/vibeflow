"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";

export function NotesPanel() {
  const { notes, isLoaded, updateNotes, updateNotesImmediate } = useNotes();
  const [localNotes, setLocalNotes] = useState("");

  useEffect(() => {
    if (isLoaded) {
      setLocalNotes(notes);
    }
  }, [isLoaded, notes]);

  const handleChange = (value: string) => {
    setLocalNotes(value);
    updateNotes(value);
  };

  const handleBlur = () => {
    updateNotesImmediate(localNotes);
  };

  if (!isLoaded) {
    return (
      <div className="p-4">
        <div className="text-text-secondary text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Notes
      </h2>
      <textarea
        value={localNotes}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Jot down ideas, reminders, or anything else..."
        className="flex-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors resize-none"
      />
    </div>
  );
}
