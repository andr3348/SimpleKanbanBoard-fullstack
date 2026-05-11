"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { boardApi } from "../api/board.api";
import { CreateBoardModal } from "./CreateBoardModal";
import { Button } from "@/components/ui/button";
import { Plus, Lock, Users } from "lucide-react";
import type { BoardWithRole } from "@/shared/types";

export function BoardList() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: boards = [], isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: boardApi.getAll,
  });

  if (isLoading)
    return <div className="p-8 text-muted-foreground">Loading boards...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Boards</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New board
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(`/boards/${item.id}`)}
            className="group relative h-32 rounded-xl overflow-hidden text-left shadow-sm hover:shadow-md transition-shadow"
          >
            {item.coverUrl ? (
              <img
                src={item.coverUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600" />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <span className="text-white font-semibold text-sm line-clamp-2">
                {item.title}
              </span>
              <span className="text-white/70 text-xs capitalize flex items-center gap-1">
                {item.role === "owner" ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Users className="w-3 h-3" />
                )}
                {item.role}
              </span>
            </div>
          </button>
        ))}
      </div>

      <CreateBoardModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
