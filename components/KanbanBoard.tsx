"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
} from "@dnd-kit/core";
import { ArrowUpDown } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { AddCardModal } from "./AddCardModal";
import { SearchBar } from "./SearchBar";
import { useKanban } from "@/hooks/useKanban";
import { useToast } from "@/contexts/ToastContext";
import { COLUMNS, ColumnId, KanbanCard as KanbanCardType } from "@/types";

type SortOption = "date" | "priority" | "title" | "dueDate";

interface Props {
  addCardTriggerRef?: React.MutableRefObject<(() => void) | null>;
  searchFocusRef?: React.MutableRefObject<(() => void) | null>;
}

export function KanbanBoard({ addCardTriggerRef, searchFocusRef }: Props) {
  const { cards, isLoaded, addCard, deleteCard, restoreCard, duplicateCard, moveCard, getCardsByColumn } =
    useKanban();
  const { addToast } = useToast();
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<ColumnId | null>(null);
  const [overColumn, setOverColumn] = useState<ColumnId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Wire up keyboard shortcuts
  useEffect(() => {
    if (addCardTriggerRef) {
      addCardTriggerRef.current = () => setAddingToColumn("todo");
    }
    if (searchFocusRef) {
      searchFocusRef.current = () => searchInputRef.current?.focus();
    }
  }, [addCardTriggerRef, searchFocusRef]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return rectIntersection(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setOverColumn(null);
      return;
    }

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const activeCardData = cards.find((c) => c.id === activeCardId);
    if (!activeCardData) return;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newColumn = overId as ColumnId;
      setOverColumn(newColumn);
      if (activeCardData.column !== newColumn) {
        moveCard(activeCardId, newColumn);
      }
      return;
    }

    const overCard = cards.find((c) => c.id === overId);
    if (overCard) {
      setOverColumn(overCard.column);
      if (activeCardData.column !== overCard.column) {
        moveCard(activeCardId, overCard.column);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    setOverColumn(null);

    const { active, over } = event;
    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const activeCardData = cards.find((c) => c.id === activeCardId);
    if (!activeCardData) return;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      return;
    }

    const overCard = cards.find((c) => c.id === overId);
    if (overCard && activeCardId !== overId) {
      moveCard(activeCardId, overCard.column, overCard.order - 1);
    }
  };

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;

    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query) ||
        card.priority?.toLowerCase().includes(query)
    );
  }, [cards, searchQuery]);

  const handleDeleteCard = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    deleteCard(id);
    addToast({
      message: `"${card.title}" deleted`,
      type: "success",
      action: {
        label: "Undo",
        onClick: () => restoreCard(card),
      },
    });
  };

  const handleDuplicateCard = (id: string) => {
    duplicateCard(id);
    addToast({
      message: "Card duplicated",
      type: "success",
    });
  };

  const sortCards = (cardsToSort: KanbanCardType[]) => {
    const sorted = [...cardsToSort];

    switch (sortBy) {
      case "date":
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case "priority": {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sorted.sort((a, b) => {
          const aPriority = a.priority ? priorityOrder[a.priority] : 3;
          const bPriority = b.priority ? priorityOrder[b.priority] : 3;
          return aPriority - bPriority;
        });
      }
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "dueDate":
        return sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate - b.dueDate;
        });
      default:
        return sorted.sort((a, b) => a.order - b.order);
    }
  };

  const getFilteredCardsByColumn = (columnId: ColumnId) => {
    const columnCards = filteredCards.filter((card) => card.column === columnId);
    return sortCards(columnCards);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <SearchBar
            ref={searchInputRef}
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search cards by title, description, or priority..."
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-full pl-3 pr-8 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="date">Newest First</option>
            <option value="priority">By Priority</option>
            <option value="title">Alphabetical</option>
            <option value="dueDate">By Due Date</option>
          </select>
          <ArrowUpDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={getFilteredCardsByColumn(column.id)}
              onDeleteCard={handleDeleteCard}
              onDuplicateCard={handleDuplicateCard}
              onAddCard={() => setAddingToColumn(column.id)}
              isOver={overColumn === column.id}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="rotate-3">
              <KanbanCard card={activeCard} onDelete={() => {}} onDuplicate={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {addingToColumn && (
        <AddCardModal
          column={addingToColumn}
          onAdd={addCard}
          onClose={() => setAddingToColumn(null)}
        />
      )}
    </>
  );
}
