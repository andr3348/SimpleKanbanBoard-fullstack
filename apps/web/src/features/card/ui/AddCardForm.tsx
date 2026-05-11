"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { cardApi } from "../api/card.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  columnId: string;
  boardId: string;
}

export function AddCardForm({ columnId, boardId }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const mutation = useMutation({
    mutationFn: () => cardApi.create(columnId, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      setTitle("");
      setOpen(false);
    },
  });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors m-1"
      >
        <Plus className="w-3.5 h-3.5" /> Add card
      </button>
    );
  }

  return (
    <div className="p-2 space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title..."
        autoFocus
        className="text-sm"
        onKeyDown={(e) =>
          e.key === "Enter" && title.trim() && mutation.mutate()
        }
      />
      <div className="flex gap-1">
        <Button
          size="sm"
          onClick={() => mutation.mutate()}
          disabled={!title.trim() || mutation.isPending}
          className="flex-1"
        >
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setTitle("");
          }}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
