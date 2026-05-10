import { Card } from './card.entity';

export interface CreateCardInput {
  title: string;
  description?: string;
  position: number;
  columnId: string;
  assigneeId?: string;
}

export interface UpdateCardInput {
  title?: string;
  description?: string;
  assigneeId?: string | null;
}

export interface ICardRepository {
  findById(id: string): Promise<Card | null>;
  findAllByColumn(columnId: string): Promise<Card[]>;
  getNextPosition(columnId: string): Promise<number>;
  create(input: CreateCardInput): Promise<Card>;
  update(id: string, data: UpdateCardInput): Promise<Card>;
  move(id: string, columnId: string, position: number): Promise<Card>;
  delete(id: string): Promise<void>;
}

export const CARD_REPOSITORY = Symbol('ICardRepository');
