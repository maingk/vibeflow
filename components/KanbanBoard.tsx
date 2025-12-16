"use client";

import { useState } from "react";
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
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { AddCardModal } from "./AddCardModal";
import { useKanban } from "@/hooks/useKanban";
import { COLUMNS, ColumnId, KanbanCard as KanbanCardType } from "@/types";

export function KanbanBoard() {
  const { cards, isLoaded, addCard, deleteCard, moveCard, getCardsByColumn } =
    useKanban();
  const [activeCard, setActiveCard] = useState<KanbanCardType | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<ColumnId | null>(null);
  const [overColumn, setOverColumn] = useState<ColumnId | null>(null);

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

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <>
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
              cards={getCardsByColumn(column.id)}
              onDeleteCard={deleteCard}
              onAddCard={() => setAddingToColumn(column.id)}
              isOver={overColumn === column.id}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="rotate-3">
              <KanbanCard card={activeCard} onDelete={() => {}} />
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
