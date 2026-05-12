"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { columnApi } from "@/features/column/api/column.api";
import { DraggableCard } from "@/features/card/ui/DraggableCard";
import { AddCardForm } from "@/features/card/ui/AddCardForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ColumnInBoard, BoardMember } from "@/shared/types";

interface Props {
  column: ColumnInBoard;
  boardId: string;
  members: BoardMember[];
}

export function BoardColumn({ column, boardId, members }: Props) {
  const queryClient = useQueryClient();
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const renameMutation = useMutation({
    mutationFn: () => columnApi.update(boardId, column.id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      setRenaming(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => columnApi.delete(boardId, column.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
  });

  return (
    <div className="flex flex-col w-64 shrink-0 rounded-xl bg-muted/40 border border-border/50 max-h-full">
      {/* Column header */}
      <div className="flex items-center gap-2 p-3 shrink-0">
        {renaming ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              renameMutation.mutate();
            }}
            className="flex-1 flex gap-1"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setRenaming(false)}
              autoFocus
              className="flex-1 text-sm font-medium bg-background border rounded px-2 py-0.5 outline-none"
            />
          </form>
        ) : (
          <span className="flex-1 text-sm font-medium truncate">
            {column.title}
          </span>
        )}

        <span className="text-xs text-muted-foreground shrink-0">
          {column.cards.length}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRenaming(true)}>
              <Pencil className="w-3.5 h-3.5 mr-2" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                if (confirm("Delete this column and all its cards?"))
                  deleteMutation.mutate();
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-2 px-2 overflow-y-auto flex-1 min-h-[2rem] transition-colors rounded-md ${
            isOver ? "bg-primary/5" : ""
          }`}
        >
          {column.cards.map((card) => (
            <DraggableCard
              key={card.id}
              card={card}
              columnId={column.id}
              boardId={boardId}
              members={members}
            />
          ))}
        </div>
      </SortableContext>

      <AddCardForm columnId={column.id} boardId={boardId} />
    </div>
  );
}
