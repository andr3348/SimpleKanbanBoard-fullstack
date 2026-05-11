"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { columnApi } from "../api/column.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddColumnForm({ boardId }: { boardId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const mutation = useMutation({
    mutationFn: () => columnApi.create(boardId, title),
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
        className="flex items-center gap-2 w-64 shrink-0 p-3 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> Add column
      </button>
    );
  }

  return (
    <div className="w-64 shrink-0 rounded-xl bg-muted/40 border p-3 space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Column title..."
        autoFocus
        onKeyDown={(e) =>
          e.key === "Enter" && title.trim() && mutation.mutate()
        }
      />
      <div className="flex gap-2">
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
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
