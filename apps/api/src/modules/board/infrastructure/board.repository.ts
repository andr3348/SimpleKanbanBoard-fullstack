import { Injectable } from '@nestjs/common';
import {
  CreateBoardInput,
  IBoardRepository,
} from '../domain/board.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Board } from '../domain/board.entity';
import { Board as PrismaBoard } from 'src/generated/prisma/client';

@Injectable()
export class BoardRepository implements IBoardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Board | null> {
    const row = await this.prisma.board.findUnique({ where: { id } });
    if (!row) return null;

    return this.toEntity(row);
  }

  async findAllByUser(userId: string): Promise<Board[]> {
    const rows = await this.prisma.board.findMany({
      where: {
        // OR statement to find boards where user is owner or member
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => this.toEntity(r));
  }

  async create(input: CreateBoardInput): Promise<Board> {
    const row = await this.prisma.board.create({
      data: {
        title: input.title,
        description: input.description,
        ownerId: input.ownerId,
        members: {
          create: {
            userId: input.ownerId, // owner is automatically an ADMIN member
            role: 'ADMIN',
          },
        },
      },
    });

    return this.toEntity(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.board.delete({ where: { id } });
  }

  // Checks if a user is a member of a board
  async isMember(boardId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
    });

    return !!member;
  }

  // Convert Prisma model to domain entity
  private toEntity(row: PrismaBoard): Board {
    return new Board({
      id: row.id,
      title: row.title,
      description: row.description,
      ownerId: row.ownerId,
      createdAt: row.createdAt,
    });
  }
}
