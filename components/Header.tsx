"use client";

import { Kanban, CheckCircle2, ListTodo, Sun, Moon } from "lucide-react";
import { DataManagement } from "./DataManagement";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  totalCards: number;
  completedCards: number;
  totalTodos: number;
  completedTodos: number;
}

export function Header({ totalCards, completedCards, totalTodos, completedTodos }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex-shrink-0 border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Kanban size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold text-text-primary tracking-tight">
              vibeflow
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Kanban Stats */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/50 border border-border">
              <CheckCircle2 size={16} className="text-text-secondary" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium text-text-primary">
                  {completedCards}
                </span>
                <span className="text-xs text-text-secondary">/</span>
                <span className="text-xs text-text-secondary">{totalCards}</span>
                <span className="text-xs text-text-secondary ml-1">cards done</span>
              </div>
            </div>

            {/* Todo Stats */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/50 border border-border">
              <ListTodo size={16} className="text-text-secondary" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium text-text-primary">
                  {completedTodos}
                </span>
                <span className="text-xs text-text-secondary">/</span>
                <span className="text-xs text-text-secondary">{totalTodos}</span>
                <span className="text-xs text-text-secondary ml-1">tasks done</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-border" />

          <DataManagement />

          <div className="h-6 w-px bg-border" />

          <button
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
