"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { GripVertical, User } from "lucide-react";
import { CardDetailSheet } from "./CardDetailSheet";
import type { CardInBoard } from "@/shared/types";

interface Props {
  card: CardInBoard;
  columnId: string;
  boardId: string;
}

export function DraggableCard({ card, columnId, boardId }: Props) {
  const [open, setOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => !isDragging && setOpen(true)}
      >
        <div className="flex items-start gap-2">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 text-muted-foreground/40 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{card.title}</p>
            {card.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {card.description}
              </p>
            )}

            {card.assigneeId && (
              <div className="flex items-center gap-1 mt-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Assigned</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardDetailSheet
        card={card}
        columnId={columnId}
        boardId={boardId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
