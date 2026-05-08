import { Board } from './board.entity';

export interface CreateBoardInput {
  title: string;
  description?: string;
  ownerId: string;
}

export interface IBoardRepository {
  findById(id: string): Promise<Board | null>;
  findAllByUser(userId: string): Promise<Board[]>;
  create(input: CreateBoardInput): Promise<Board>;
  delete(id: string): Promise<void>;
  isMember(boardId: string, userId: string): Promise<boolean>;
  addMember(boardId: string, userId: string): Promise<void>;
  removeMember(boardId: string, userId: string): Promise<void>;
}

export const BOARD_REPOSITORY = Symbol('IBoardRepository');
