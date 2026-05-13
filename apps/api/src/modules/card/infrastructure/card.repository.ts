import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCardInput,
  ICardRepository,
  UpdateCardInput,
} from '../domain/card.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Card } from '../domain/card.entity';
import { Card as PrismaCard } from '@repo/database';

@Injectable()
export class CardRepository implements ICardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Card | null> {
    const row = await this.prisma.card.findUnique({ where: { id } });
    if (!row) return null;
    return this.toEntity(row);
  }

  async findAllByColumn(columnId: string): Promise<Card[]> {
    const rows = await this.prisma.card.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async getNextPosition(columnId: string): Promise<number> {
    const last = await this.prisma.card.findFirst({
      where: { columnId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return last ? last.position + 1 : 0;
  }

  async create(input: CreateCardInput): Promise<Card> {
    const row = await this.prisma.card.create({ data: input });
    return this.toEntity(row);
  }

  async update(id: string, data: UpdateCardInput): Promise<Card> {
    const row = await this.prisma.card.update({
      where: { id },
      data,
    });
    return this.toEntity(row);
  }

  async move(
    id: string,
    targetColumnId: string,
    targetPosition: number,
  ): Promise<Card> {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');

    const fromColumnId = card.columnId;
    const fromPosition = card.position;

    if (fromColumnId === targetColumnId && fromPosition === targetPosition) {
      return this.toEntity(card);
    }

    return this.prisma.$transaction(async (tx) => {
      if (fromColumnId === targetColumnId) {
        if (fromPosition < targetPosition) {
          await tx.card.updateMany({
            where: {
              columnId: fromColumnId,
              position: { gt: fromPosition, lte: targetPosition },
            },
            data: { position: { decrement: 1 } },
          });
        } else {
          await tx.card.updateMany({
            where: {
              columnId: fromColumnId,
              position: { gte: targetPosition, lt: fromPosition },
            },
            data: { position: { increment: 1 } },
          });
        }
      } else {
        await tx.card.updateMany({
          where: {
            columnId: fromColumnId,
            position: { gt: fromPosition },
          },
          data: { position: { decrement: 1 } },
        });

        await tx.card.updateMany({
          where: {
            columnId: targetColumnId,
            position: { gte: targetPosition },
          },
          data: { position: { increment: 1 } },
        });
      }

      const row = await tx.card.update({
        where: { id },
        data: { columnId: targetColumnId, position: targetPosition },
      });

      return this.toEntity(row);
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.card.delete({ where: { id } });
  }

  private toEntity(row: PrismaCard): Card {
    return new Card({
      id: row.id,
      title: row.title,
      description: row.description,
      position: row.position,
      columnId: row.columnId,
      assigneeId: row.assigneeId,
      createdAt: row.createdAt,
    });
  }
}
