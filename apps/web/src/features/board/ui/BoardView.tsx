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
  const [dragOrigin, setDragOrigin] = useState<{
    fromColumnId: string;
  } | null>(null);

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
    const cardId = active.id as string;
    const col = board?.columns.find((c) =>
      c.cards.some((c) => c.id === cardId),
    );
    if (!col) return;
    const card = col.cards.find((c) => c.id === cardId);
    setActiveCard(card ?? null);
    setDragOrigin({ fromColumnId: col.id });
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
    if (!over || !board || !dragOrigin) return;
    setDragOrigin(null);

    const activeId = active.id as string;
    const overId = over.id as string;

    const toCol = findColumnByCardId(overId) ?? findColumnById(overId);
    if (!toCol) return;

    const index = toCol.cards.findIndex((c) => c.id === overId);
    const position = index === -1 ? Math.max(0, toCol.cards.length - 1) : index;

    moveMutation.mutate({
      cardId: activeId,
      fromColumnId: dragOrigin.fromColumnId,
      toColumnId: toCol.id,
      position,
    });
  };

  if (isLoading || !board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50">
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
        {!board.coverUrl && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.03),transparent_50%)] pointer-events-none" />
        )}

        {board.coverUrl && (
          <div className="fixed left-0 right-0 bottom-0 top-16 bg-black/50 pointer-events-none backdrop-blur-[1px]" />
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 h-full items-start p-5 w-max relative z-10">
            {board.columns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                boardId={boardId}
                members={board.members}
              />
            ))}
            <AddColumnForm boardId={boardId} />
          </div>

          <DragOverlay>
            {activeCard && (
              <div className="bg-white border border-zinc-200 rounded-lg p-3 w-64 shadow-xl rotate-2 opacity-95">
                <p className="text-sm font-medium text-zinc-800 truncate">
                  {activeCard.title}
                </p>
                {activeCard.description && (
                  <p className="text-xs text-zinc-400 mt-1 truncate">
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
