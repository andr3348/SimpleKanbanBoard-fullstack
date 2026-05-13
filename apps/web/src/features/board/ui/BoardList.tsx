"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { boardApi } from "../api/board.api";
import { CreateBoardModal } from "./CreateBoardModal";
import { Button } from "@/components/ui/button";
import { Plus, Lock, Users, LogOut, LayoutDashboard } from "lucide-react";
import { http } from "@/shared/api/http";
import type { BoardWithRole } from "@/shared/types";

function BoardCard({ board }: { board: BoardWithRole }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/boards/${board.id}`)}
      className="group relative h-36 rounded-xl overflow-hidden text-left shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      {board.coverUrl ? (
        <img
          src={board.coverUrl}
          alt={board.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-indigo-600" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <span className="text-white font-semibold text-sm leading-snug line-clamp-2 drop-shadow-sm">
          {board.title}
        </span>
        <span className="text-white/80 text-xs capitalize flex items-center gap-1.5 drop-shadow-sm">
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400">Loading boards...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.04),transparent_50%)] pointer-events-none" />

      <div className="relative container mx-auto py-10 px-4">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <LayoutDashboard className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">My Boards</h1>
              <p className="text-sm text-zinc-500">
                {boards.length} {boards.length === 1 ? "board" : "boards"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> New board
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {boards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
              <LayoutDashboard className="size-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-1">
              No boards yet
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              Create your first board to get started
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create board
            </Button>
          </div>
        )}

        {ownedBoards.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Owned
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {ownedBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          </section>
        )}

        {memberBoards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Member
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {memberBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          </section>
        )}

        <CreateBoardModal open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}
