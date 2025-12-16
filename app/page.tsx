"use client";

import { KanbanBoard } from "@/components/KanbanBoard";
import { TodoList } from "@/components/TodoList";
import { NotesPanel } from "@/components/NotesPanel";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <header className="flex-shrink-0 border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-text-primary tracking-tight">
          vibeflow
        </h1>
      </header>

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        <div className="flex-1 overflow-hidden border border-border rounded-lg p-4">
          <KanbanBoard />
        </div>

        <aside className="w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="flex-1 overflow-hidden border border-border rounded-lg p-4">
            <TodoList />
          </div>
          <div className="h-64 border border-border rounded-lg p-4">
            <NotesPanel />
          </div>
        </aside>
      </main>
    </div>
  );
}
