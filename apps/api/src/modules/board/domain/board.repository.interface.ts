import { Board } from './board.entity';

export type BoardRole = 'owner' | 'admin' | 'member';

export interface BoardWithRole {
  board: Board;
  role: BoardRole;
}
export interface CreateBoardInput {
  title: string;
  description?: string;
  coverUrl?: string;
  ownerId: string;
}

export interface UpdateBoardInput {
  title?: string;
  description?: string;
  coverUrl?: string;
}

export interface CardInBoard {
  id: string;
  title: string;
  description: string | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  createdAt: Date;
}

export interface ColumnInBoard {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: CardInBoard[];
}

export interface BoardMemberInfo {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: BoardRole;
}

export interface BoardDetail {
  board: Board;
  columns: ColumnInBoard[];
  members: BoardMemberInfo[];
  userRole: BoardRole;
}

export interface IBoardRepository {
  findById(id: string): Promise<Board | null>;
  findByIdWithDetails(id: string, userId: string): Promise<BoardDetail | null>;
  findAllByUser(userId: string): Promise<BoardWithRole[]>;
  create(input: CreateBoardInput): Promise<Board>;
  update(id: string, input: UpdateBoardInput): Promise<Board>;
  delete(id: string): Promise<void>;
  isMember(boardId: string, userId: string): Promise<boolean>;
  addMember(boardId: string, userId: string): Promise<void>;
  removeMember(boardId: string, userId: string): Promise<void>;
}

export const BOARD_REPOSITORY = Symbol('IBoardRepository');
