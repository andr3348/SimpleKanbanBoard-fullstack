export type { User, Board, Column, Card, BoardRole } from "@repo/database";

// frontend-only types
export interface BoardWithRole {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  coverUrl: string | null;
  role: "owner" | "admin" | "member";
}

export interface CardInBoard {
  id: string;
  title: string;
  description: string | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  createdAt: string;
}

export interface ColumnInBoard {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: CardInBoard[];
}

export interface BoardDetail {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  coverUrl: string | null;
  columns: ColumnInBoard[];
}
