"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { KanbanCard, ColumnId } from "@/types";

const STORAGE_KEY = "vibeflow-kanban";

export function useKanban() {
  const [cards, setCards, isLoaded] = useLocalStorage<KanbanCard[]>(
    STORAGE_KEY,
    []
  );

  const addCard = useCallback(
    (title: string, description: string, column: ColumnId = "todo", priority?: KanbanCard["priority"], dueDate?: number) => {
      const newCard: KanbanCard = {
        id: crypto.randomUUID(),
        title,
        description: description || undefined,
        column,
        order: Date.now(),
        createdAt: Date.now(),
        priority,
        dueDate,
      };
      setCards((prev) => [...prev, newCard]);
    },
    [setCards]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<Omit<KanbanCard, "id" | "createdAt">>) => {
      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
      );
    },
    [setCards]
  );

  const deleteCard = useCallback(
    (id: string) => {
      setCards((prev) => prev.filter((card) => card.id !== id));
    },
    [setCards]
  );

  const moveCard = useCallback(
    (cardId: string, toColumn: ColumnId, newOrder?: number) => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId
            ? { ...card, column: toColumn, order: newOrder ?? card.order }
            : card
        )
      );
    },
    [setCards]
  );

  const restoreCard = useCallback(
    (card: KanbanCard) => {
      setCards((prev) => [...prev, card]);
    },
    [setCards]
  );

  const duplicateCard = useCallback(
    (id: string) => {
      const cardToDuplicate = cards.find((c) => c.id === id);
      if (!cardToDuplicate) return;

      const duplicatedCard: KanbanCard = {
        ...cardToDuplicate,
        id: crypto.randomUUID(),
        title: `${cardToDuplicate.title} (copy)`,
        createdAt: Date.now(),
        order: Date.now(),
      };
      setCards((prev) => [...prev, duplicatedCard]);
    },
    [cards, setCards]
  );

  const getCardsByColumn = useCallback(
    (columnId: ColumnId) => {
      return cards
        .filter((card) => card.column === columnId)
        .sort((a, b) => a.order - b.order);
    },
    [cards]
  );

  return {
    cards,
    isLoaded,
    addCard,
    updateCard,
    deleteCard,
    restoreCard,
    duplicateCard,
    moveCard,
    getCardsByColumn,
  };
}
