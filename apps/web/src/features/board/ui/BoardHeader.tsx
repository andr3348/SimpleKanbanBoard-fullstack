"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, Users, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { boardApi } from "../api/board.api";
import { Button } from "@/components/ui/button";
import { BoardReport } from "./BoardReport";
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
    <header className="flex items-center gap-3 px-4 py-3 border-b bg-background/80 backdrop-blur shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/boards")}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      <div className="flex-1 min-w-0">
        <h1 className="font-semibold truncate">{board.title}</h1>
        <p className="text-xs text-muted-foreground">
          {board.columns.length} columns · {totalCards} cards
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* PDF Export */}
        <PDFDownloadLink
          document={<BoardReport board={board} />}
          fileName={`${board.title.replace(/\s+/g, "-")}-report.pdf`}
        >
          {({ loading }) => (
            <Button variant="outline" size="sm" disabled={loading}>
              <FileText className="w-4 h-4 mr-2" />
              {loading ? "Generating..." : "Export PDF"}
            </Button>
          )}
        </PDFDownloadLink>

        {/* Delete board */}
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            if (confirm("Delete this board and all its data?"))
              deleteMutation.mutate();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
