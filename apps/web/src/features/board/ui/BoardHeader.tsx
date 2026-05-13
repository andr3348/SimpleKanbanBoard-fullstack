"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, Users, Trash2, Image } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { boardApi } from "../api/board.api";
import { Button } from "@/components/ui/button";
import { BoardReport } from "./BoardReport";
import { EditBoardCoverModal } from "./EditBoardCoverModal";
import { ManageMembersModal } from "./ManageMembersModal";
import type { BoardDetail } from "@/shared/types";

// react-pdf needs client-only - SSR will crash
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false },
);

interface Props {
  board: BoardDetail;
  boardId: string;
}

export function BoardHeader({ board, boardId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editCoverOpen, setEditCoverOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => boardApi.delete(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      router.push("/boards");
    },
  });

  const totalCards = board.columns.reduce(
    (acc, col) => acc + col.cards.length,
    0,
  );

  return (
    <header className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-white shadow-sm shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/boards")}
        className="text-zinc-400 hover:text-zinc-700"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      <div className="flex-1 min-w-0">
        <h1 className="font-semibold truncate text-zinc-900">
          {board.title}
        </h1>
        <p className="text-xs text-zinc-400">
          {board.columns.length} columns &middot; {totalCards} cards
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMembersOpen(true)}
          className="text-zinc-600"
        >
          <Users className="w-4 h-4 mr-1.5" />
          {board.members.length}
        </Button>

        {(board.userRole === "owner" || board.userRole === "admin") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditCoverOpen(true)}
            className="text-zinc-600"
          >
            <Image className="w-4 h-4 mr-1.5" />
            Cover
          </Button>
        )}

        <PDFDownloadLink
          document={<BoardReport board={board} />}
          fileName={`${board.title.replace(/\s+/g, "-")}-report.pdf`}
        >
          {({ loading }) => (
            <Button variant="ghost" size="sm" disabled={loading} className="text-zinc-600">
              <FileText className="w-4 h-4 mr-1.5" />
              {loading ? "Generating..." : "PDF"}
            </Button>
          )}
        </PDFDownloadLink>

        {board.userRole === "owner" && (
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-red-600 hover:bg-red-50 ml-2"
            onClick={() => {
              if (confirm("Delete this board and all its data?"))
                deleteMutation.mutate();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <EditBoardCoverModal
        board={board}
        open={editCoverOpen}
        onOpenChange={setEditCoverOpen}
      />

      <ManageMembersModal
        board={board}
        open={membersOpen}
        onOpenChange={setMembersOpen}
      />
    </header>
  );
}
