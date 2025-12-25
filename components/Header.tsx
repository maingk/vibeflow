"use client";

import { CheckCircle2, ListTodo, Sun, Moon, Zap } from "lucide-react";
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

  const cardProgress = totalCards > 0 ? (completedCards / totalCards) * 100 : 0;
  const todoProgress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <header className="relative flex-shrink-0 border-b border-border/50 px-6 py-4 backdrop-blur-sm z-10">
      {/* Animated gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gradient-cyan)] to-transparent opacity-30"
           style={{
             background: 'linear-gradient(90deg, transparent 0%, var(--gradient-cyan) 25%, var(--gradient-magenta) 50%, var(--gradient-orange) 75%, transparent 100%)',
             backgroundSize: '200% 100%',
             animation: 'gradient-shift 8s linear infinite'
           }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 animate-float-in">
          <div className="flex items-center gap-3">
            {/* Electric icon with glow */}
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center group cursor-default">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--gradient-cyan)] via-[var(--gradient-magenta)] to-[var(--gradient-orange)] opacity-80 group-hover:opacity-100 transition-opacity"
                   style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
              />
              <div className="relative">
                <Zap size={20} className="text-white" fill="currentColor" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                vibeflow
              </h1>
              <p className="text-[10px] text-text-secondary tracking-widest uppercase font-mono -mt-0.5">
                Project Management
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 animate-float-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            {/* Kanban Stats - Enhanced */}
            <div className="group relative glass rounded-xl px-4 py-2 border border-border/30 hover:border-[var(--gradient-cyan)]/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gradient-cyan)]/20 to-[var(--gradient-magenta)]/20">
                  <CheckCircle2 size={16} className="text-[var(--gradient-cyan)]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-text-primary font-mono tabular-nums">
                      {completedCards}
                    </span>
                    <span className="text-xs text-text-secondary font-mono">/</span>
                    <span className="text-xs text-text-secondary font-mono tabular-nums">{totalCards}</span>
                  </div>
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">cards</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-surface/50 overflow-hidden rounded-b-xl">
                <div
                  className="h-full bg-gradient-to-r from-[var(--gradient-cyan)] to-[var(--gradient-magenta)] transition-all duration-500"
                  style={{ width: `${cardProgress}%` }}
                />
              </div>
            </div>

            {/* Todo Stats - Enhanced */}
            <div className="group relative glass rounded-xl px-4 py-2 border border-border/30 hover:border-[var(--gradient-magenta)]/30 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gradient-magenta)]/20 to-[var(--gradient-orange)]/20">
                  <ListTodo size={16} className="text-[var(--gradient-magenta)]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-text-primary font-mono tabular-nums">
                      {completedTodos}
                    </span>
                    <span className="text-xs text-text-secondary font-mono">/</span>
                    <span className="text-xs text-text-secondary font-mono tabular-nums">{totalTodos}</span>
                  </div>
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">tasks</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-surface/50 overflow-hidden rounded-b-xl">
                <div
                  className="h-full bg-gradient-to-r from-[var(--gradient-magenta)] to-[var(--gradient-orange)] transition-all duration-500"
                  style={{ width: `${todoProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-border to-transparent" />

          <DataManagement />

          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-border to-transparent" />

          <button
            onClick={toggleTheme}
            className="group relative p-2.5 text-text-secondary hover:text-text-primary rounded-xl glass border border-border/30 hover:border-[var(--gradient-orange)]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--gradient-orange)] focus:ring-offset-2 focus:ring-offset-background"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <div className="relative z-10">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
