"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { GripVertical, User } from "lucide-react";
import { CardDetailSheet } from "./CardDetailSheet";
import type { CardInBoard, BoardMember } from "@/shared/types";

interface Props {
  card: CardInBoard;
  columnId: string;
  boardId: string;
  members: BoardMember[];
}

export function DraggableCard({ card, columnId, boardId, members }: Props) {
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
        className="group bg-white border border-zinc-200/70 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 cursor-pointer"
        onClick={() => !isDragging && setOpen(true)}
      >
        <div className="flex items-start gap-2">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 text-zinc-200 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-800 truncate">
              {card.title}
            </p>
            {card.description && (
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                {card.description}
              </p>
            )}

            {card.assigneeId && (
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-100">
                <div className="size-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-indigo-600">
                    {members.find((m) => m.userId === card.assigneeId)
                      ?.userName?.charAt(0)
                      ?.toUpperCase() || "?"}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 truncate">
                  {members.find((m) => m.userId === card.assigneeId)
                    ?.userName || "Assigned"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CardDetailSheet
        card={card}
        columnId={columnId}
        boardId={boardId}
        members={members}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
