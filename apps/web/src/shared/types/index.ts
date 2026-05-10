export interface BoardWithRole {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
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
  columns: ColumnInBoard[];
}
