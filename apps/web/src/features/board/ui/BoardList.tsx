"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { boardApi } from "../api/board.api";
import { CreateBoardModal } from "./CreateBoardModal";
import { Button } from "@/components/ui/button";
import { Plus, Lock, Users, LogOut } from "lucide-react";
import { http } from "@/shared/api/http";
import type { BoardWithRole } from "@/shared/types";

function BoardCard({ board }: { board: BoardWithRole }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/boards/${board.id}`)}
      className="group relative h-32 rounded-xl overflow-hidden text-left shadow-sm hover:shadow-md transition-shadow"
    >
      {board.coverUrl ? (
        <img
          src={board.coverUrl}
          alt={board.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600" />
      )}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <span className="text-white font-semibold text-sm line-clamp-2">
          {board.title}
        </span>
        <span className="text-white/70 text-xs capitalize flex items-center gap-1">
          {board.role === "owner" ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Users className="w-3 h-3" />
          )}
          {board.role}
        </span>
      </div>
    </button>
  );
}

export function BoardList() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: boards = [], isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: boardApi.getAll,
  });

  const handleLogout = async () => {
    // Clear the auth cookie by calling a logout endpoint or just clearing local state
    try {
      await http.post("/auth/logout", {});
    } catch {
      // Even if logout fails, redirect to login
    }
    router.push("/login");
  };

  const ownedBoards = boards.filter((b) => b.role === "owner");
  const memberBoards = boards.filter((b) => b.role !== "owner");

  if (isLoading)
    return <div className="p-8 text-muted-foreground">Loading boards...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Boards</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> New board
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      {ownedBoards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Owned</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ownedBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </div>
      )}

      {memberBoards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Member</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {memberBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </div>
      )}

      {boards.length === 0 && (
        <div className="text-muted-foreground">No boards yet.</div>
      )}

      <CreateBoardModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
