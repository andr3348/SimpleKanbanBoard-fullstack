"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { boardApi } from "../api/board.api";
import { cardApi } from "@/features/card/api/card.api";
import { useBoardStore } from "../model/board.store";
import { BoardHeader } from "./BoardHeader";
import { BoardColumn } from "./BoardColumn";
import { AddColumnForm } from "@/features/column/ui/AddColumnForm";
import type { CardInBoard } from "@/shared/types";

export function BoardView({ boardId }: { boardId: string }) {
  const queryClient = useQueryClient();
  const { board, setBoard, moveCard } = useBoardStore();
  const [activeCard, setActiveCard] = useState<CardInBoard | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardApi.getById(boardId),
  });

  useEffect(() => {
    if (data) setBoard(data);
  }, [data, setBoard]);

  const moveMutation = useMutation({
    mutationFn: ({
      cardId,
      fromColumnId,
      toColumnId,
      position,
    }: {
      cardId: string;
      fromColumnId: string;
      toColumnId: string;
      position: number;
    }) =>
      cardApi.move(fromColumnId, cardId, { columnId: toColumnId, position }),
    onError: () =>
      queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const findColumnByCardId = (cardId: string) =>
    board?.columns.find((col) => col.cards.some((c) => c.id === cardId));

  const findColumnById = (id: string) =>
    board?.columns.find((col) => col.id === id);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const card = board?.columns
      .flatMap((c) => c.cards)
      .find((c) => c.id === active.id);
    setActiveCard(card ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !board) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const fromCol = findColumnByCardId(activeId);
    const toCol = findColumnByCardId(overId) ?? findColumnById(overId);
    if (!fromCol || !toCol || fromCol.id === toCol.id) return;

    moveCard(activeId, fromCol.id, toCol.id, toCol.cards.length);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over || !board) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromCol = findColumnByCardId(activeId);
    const toCol = findColumnByCardId(overId) ?? findColumnById(overId);
    if (!fromCol || !toCol) return;

    const index = toCol.cards.findIndex((c) => c.id === overId);
    const position = index === -1 ? Math.max(0, toCol.cards.length - 1) : index;

    moveMutation.mutate({
      cardId: activeId,
      fromColumnId: fromCol.id,
      toColumnId: toCol.id,
      position,
    });
  };

  if (isLoading || !board) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading board...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <BoardHeader board={board} boardId={boardId} />

      <main
        className="flex-1 overflow-x-auto overflow-y-hidden relative"
        style={{
          backgroundImage: board.coverUrl
            ? `url(${board.coverUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay to make content readable over background */}
        {board.coverUrl && (
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 h-full items-start p-4 w-max relative z-10">
            {board.columns.map((col) => (
              <BoardColumn key={col.id} column={col} boardId={boardId} />
            ))}
            <AddColumnForm boardId={boardId} />
          </div>

          <DragOverlay>
            {activeCard && (
              <div className="bg-card border rounded-lg p-3 w-64 shadow-xl rotate-1 opacity-95">
                <p className="text-sm font-medium truncate">
                  {activeCard.title}
                </p>
                {activeCard.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {activeCard.description}
                  </p>
                )}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
