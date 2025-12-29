"use client";

import { useState, useRef } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TodoList } from "@/components/TodoList";
import { ResizableNotesPanel } from "@/components/ResizableNotesPanel";
import { Header } from "@/components/Header";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { Analytics } from "@/components/Analytics";
import { useKanban } from "@/hooks/useKanban";
import { useTodos } from "@/hooks/useTodos";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function Home() {
  const { cards, isLoaded, addCard, updateCard, deleteCard, restoreCard, duplicateCard, moveCard, getCardsByColumn } = useKanban();
  const { todos } = useTodos();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const addCardTriggerRef = useRef<(() => void) | null>(null);
  const searchFocusRef = useRef<(() => void) | null>(null);

  const totalCards = cards.length;
  const completedCards = cards.filter((card) => card.column === "complete").length;
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  useKeyboardShortcuts([
    {
      key: "n",
      description: "Add new card to To Do column",
      callback: () => addCardTriggerRef.current?.(),
    },
    {
      key: "/",
      description: "Focus search",
      callback: () => searchFocusRef.current?.(),
    },
    {
      key: "Escape",
      description: "Close modals",
      callback: () => setShowShortcuts(false),
    },
    {
      key: "?",
      shiftKey: true,
      description: "Show keyboard shortcuts",
      callback: () => setShowShortcuts(true),
    },
  ]);

  return (
    <div className="h-screen flex flex-col">
      <Header
        totalCards={totalCards}
        completedCards={completedCards}
        totalTodos={totalTodos}
        completedTodos={completedTodos}
        cards={cards}
      />

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        <div className="flex-1 overflow-auto">
          <Analytics key={JSON.stringify(cards.map(c => c.id))} cards={cards} />
          <div className="border border-border rounded-lg p-4 mt-4">
            <KanbanBoard
              addCardTriggerRef={addCardTriggerRef}
              searchFocusRef={searchFocusRef}
              cards={cards}
              isLoaded={isLoaded}
              addCard={addCard}
              updateCard={updateCard}
              deleteCard={deleteCard}
              restoreCard={restoreCard}
              duplicateCard={duplicateCard}
              moveCard={moveCard}
              getCardsByColumn={getCardsByColumn}
            />
          </div>
        </div>

        <aside className="w-80 flex-shrink-0 flex flex-col gap-4">
          <div className="flex-1 overflow-hidden border border-border rounded-lg p-4">
            <TodoList />
          </div>
          <ResizableNotesPanel />
        </aside>
      </main>

      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}
