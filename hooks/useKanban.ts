"use client";

import { useCallback, useEffect, useState } from "react";
import { KanbanCard, ColumnId } from "@/types";
import { supabase } from "@/lib/supabase";

export function useKanban() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cards from Supabase on mount
  useEffect(() => {
    async function loadCards() {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("order_num", { ascending: true });

      if (error) {
        console.error("Error loading cards:", error);
        setIsLoaded(true);
        return;
      }

      // Transform database format to app format
      const transformedCards: KanbanCard[] = (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description || undefined,
        column: row.column_id as ColumnId,
        order: row.order_num,
        createdAt: row.created_at,
        priority: row.priority as KanbanCard["priority"] | undefined,
        tags: row.tags || undefined,
        dueDate: row.due_date || undefined,
      }));

      setCards(transformedCards);
      setIsLoaded(true);
    }

    loadCards();
  }, []);

  const addCard = useCallback(
    async (
      title: string,
      description: string,
      column: ColumnId = "todo",
      priority?: KanbanCard["priority"],
      dueDate?: number
    ) => {
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

      // Insert into database
      const { error } = await supabase.from("cards").insert({
        id: newCard.id,
        title: newCard.title,
        description: newCard.description,
        column_id: newCard.column,
        order_num: newCard.order,
        created_at: newCard.createdAt,
        priority: newCard.priority,
        tags: newCard.tags,
        due_date: newCard.dueDate,
      });

      if (error) {
        console.error("Error adding card:", error);
        return;
      }

      setCards((prev) => [...prev, newCard]);
    },
    []
  );

  const updateCard = useCallback(
    async (id: string, updates: Partial<Omit<KanbanCard, "id" | "createdAt">>) => {
      // Update in database
      const dbUpdates: Record<string, any> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.column !== undefined) dbUpdates.column_id = updates.column;
      if (updates.order !== undefined) dbUpdates.order_num = updates.order;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

      const { error } = await supabase
        .from("cards")
        .update(dbUpdates)
        .eq("id", id);

      if (error) {
        console.error("Error updating card:", error);
        return;
      }

      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
      );
    },
    []
  );

  const deleteCard = useCallback(async (id: string) => {
    const { error } = await supabase.from("cards").delete().eq("id", id);

    if (error) {
      console.error("Error deleting card:", error);
      return;
    }

    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const moveCard = useCallback(
    async (cardId: string, toColumn: ColumnId, newOrder?: number) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      const updates: Record<string, any> = {
        column_id: toColumn,
      };

      if (newOrder !== undefined) {
        updates.order_num = newOrder;
      }

      const { error } = await supabase
        .from("cards")
        .update(updates)
        .eq("id", cardId);

      if (error) {
        console.error("Error moving card:", error);
        return;
      }

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId
            ? { ...card, column: toColumn, order: newOrder ?? card.order }
            : card
        )
      );
    },
    [cards]
  );

  const restoreCard = useCallback(async (card: KanbanCard) => {
    const { error } = await supabase.from("cards").insert({
      id: card.id,
      title: card.title,
      description: card.description,
      column_id: card.column,
      order_num: card.order,
      created_at: card.createdAt,
      priority: card.priority,
      tags: card.tags,
      due_date: card.dueDate,
    });

    if (error) {
      console.error("Error restoring card:", error);
      return;
    }

    setCards((prev) => [...prev, card]);
  }, []);

  const duplicateCard = useCallback(
    async (id: string) => {
      const cardToDuplicate = cards.find((c) => c.id === id);
      if (!cardToDuplicate) return;

      const duplicatedCard: KanbanCard = {
        ...cardToDuplicate,
        id: crypto.randomUUID(),
        title: `${cardToDuplicate.title} (copy)`,
        createdAt: Date.now(),
        order: Date.now(),
      };

      const { error } = await supabase.from("cards").insert({
        id: duplicatedCard.id,
        title: duplicatedCard.title,
        description: duplicatedCard.description,
        column_id: duplicatedCard.column,
        order_num: duplicatedCard.order,
        created_at: duplicatedCard.createdAt,
        priority: duplicatedCard.priority,
        tags: duplicatedCard.tags,
        due_date: duplicatedCard.dueDate,
      });

      if (error) {
        console.error("Error duplicating card:", error);
        return;
      }

      setCards((prev) => [...prev, duplicatedCard]);
    },
    [cards]
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
