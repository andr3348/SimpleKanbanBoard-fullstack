import { Column } from './column.entity';

export interface CreateColumnInput {
  title: string;
  position: number;
  boardId: string;
}

export interface IColumnRepository {
  findById(id: string): Promise<Column | null>;
  findAllByBoard(boardId: string): Promise<Column[]>;
  getNextPosition(boardId: string): Promise<number>;
  create(input: CreateColumnInput): Promise<Column>;
  update(id: string, title: string): Promise<Column>;
  delete(id: string): Promise<void>;
}

export const COLUMN_REPOSITORY = Symbol('IColumnRepository');
