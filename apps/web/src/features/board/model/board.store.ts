import { create } from "zustand";
import type { BoardDetail, CardInBoard } from "@/shared/types";

interface BoardStore {
  board: BoardDetail | null;
  setBoard: (board: BoardDetail) => void;
  moveCard: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    toIndex: number,
  ) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,

  setBoard: (board) => set({ board }),

  moveCard: (cardId, fromColumnId, toColumnId, toIndex) =>
    set((state) => {
      if (!state.board) return state;

      let movedCard: CardInBoard | undefined;

      // Remove from source
      const columns = state.board.columns.map((col) => {
        if (col.id !== fromColumnId) return col;
        movedCard = col.cards.find((c) => c.id === cardId);
        return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
      });

      if (!movedCard) return state;

      // Insert into target
      const updated = columns.map((col) => {
        if (col.id !== toColumnId) return col;
        const cards = [...col.cards];
        cards.splice(toIndex, 0, { ...movedCard!, columnId: toColumnId });
        return { ...col, cards };
      });

      return { board: { ...state.board, columns: updated } };
    }),
}));
