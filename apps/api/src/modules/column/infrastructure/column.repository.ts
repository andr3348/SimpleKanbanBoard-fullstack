import { Injectable } from '@nestjs/common';
import {
  CreateColumnInput,
  IColumnRepository,
} from '../domain/column.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Column } from '../domain/column.entity';
import { Column as PrismaColumn } from '@repo/database';

@Injectable()
export class ColumnRepository implements IColumnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Column | null> {
    const row = await this.prisma.column.findUnique({ where: { id } });
    if (!row) return null;
    return this.toEntity(row);
  }

  async findAllByBoard(boardId: string): Promise<Column[]> {
    const rows = await this.prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async getNextPosition(boardId: string): Promise<number> {
    const last = await this.prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return last ? last.position + 1 : 0;
  }

  async create(input: CreateColumnInput): Promise<Column> {
    const row = await this.prisma.column.create({ data: input });
    return this.toEntity(row);
  }

  async update(id: string, title: string): Promise<Column> {
    const row = await this.prisma.column.update({
      where: { id },
      data: { title },
    });
    return this.toEntity(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.column.delete({ where: { id } });
  }

  private toEntity(row: PrismaColumn): Column {
    return new Column({
      id: row.id,
      title: row.title,
      position: row.position,
      boardId: row.boardId,
    });
  }
}
