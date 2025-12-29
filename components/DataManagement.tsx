"use client";

import { Download, Upload } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/contexts/ToastContext";
import { useRef } from "react";
import { KanbanCard } from "@/types";

interface Props {
  cards: KanbanCard[];
}

export function DataManagement({ cards }: Props) {
  const { todos } = useTodos();
  const { notes } = useNotes();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      cards,
      todos,
      notes,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vibeflow-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      message: "Data exported successfully",
      type: "success",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Validate the data structure
        if (!data.cards || !data.todos || !data.notes) {
          throw new Error("Invalid data format");
        }

        // Store the imported data
        localStorage.setItem("vibeflow-kanban", JSON.stringify(data.cards));
        localStorage.setItem("vibeflow-todos", JSON.stringify(data.todos));
        localStorage.setItem("vibeflow-notes", JSON.stringify(data.notes));

        addToast({
          message: "Data imported successfully. Refreshing...",
          type: "success",
        });

        // Reload to apply changes
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        addToast({
          message: "Failed to import data. Please check the file format.",
          type: "error",
        });
      }
    };

    reader.readAsText(file);

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface border border-border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Export data"
      >
        <Download size={14} />
        <span>Export</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        id="import-data"
      />
      <label
        htmlFor="import-data"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface border border-border rounded-lg transition-colors cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background"
      >
        <Upload size={14} />
        <span>Import</span>
      </label>
    </div>
  );
}
