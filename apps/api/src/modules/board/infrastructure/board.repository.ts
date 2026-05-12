import { Injectable } from '@nestjs/common';
import {
  BoardDetail,
  BoardRole,
  BoardWithRole,
  CreateBoardInput,
  UpdateBoardInput,
  IBoardRepository,
} from '../domain/board.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { Board } from '../domain/board.entity';
import { Board as PrismaBoard } from '@repo/database';

@Injectable()
export class BoardRepository implements IBoardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Board | null> {
    const row = await this.prisma.board.findUnique({ where: { id } });
    if (!row) return null;

    return this.toEntity(row);
  }

  async findByIdWithDetails(
    id: string,
    userId: string,
  ): Promise<BoardDetail | null> {
    const row = await this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
            },
          },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!row) return null;

    // Calculate user's role
    const isOwner = row.ownerId === userId;
    const memberRole = row.members.find((m) => m.userId === userId)?.role;
    const userRole: 'owner' | 'admin' | 'member' = isOwner
      ? 'owner'
      : memberRole === 'ADMIN'
        ? 'admin'
        : 'member';

    return {
      board: this.toEntity(row),
      columns: row.columns.map((col) => ({
        id: col.id,
        title: col.title,
        position: col.position,
        boardId: col.boardId,
        cards: col.cards.map((card) => ({
          id: card.id,
          title: card.title,
          description: card.description,
          position: card.position,
          columnId: card.columnId,
          assigneeId: card.assigneeId,
          createdAt: card.createdAt,
        })),
      })),
      members: row.members.map((m) => ({
        id: m.id,
        userId: m.user.id,
        userName: m.user.name,
        userEmail: m.user.email,
        role: m.role === 'ADMIN' ? 'admin' : 'member',
      })),
      userRole,
    };
  }

  async findAllByUser(userId: string): Promise<BoardWithRole[]> {
    const rows = await this.prisma.board.findMany({
      where: {
        // OR statement to find boards where user is owner or member
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        members: {
          where: { userId },
          select: { role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => {
      const isOwner = r.ownerId === userId;
      const memberRole = r.members[0]?.role; // always exists since owner is also a member

      const role: BoardRole = isOwner
        ? 'owner'
        : memberRole === 'ADMIN'
          ? 'admin'
          : 'member';

      return { board: this.toEntity(r), role };
    });
  }

  async create(input: CreateBoardInput): Promise<Board> {
    const row = await this.prisma.board.create({
      data: {
        title: input.title,
        description: input.description,
        coverUrl: input.coverUrl,
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

  async update(id: string, input: UpdateBoardInput): Promise<Board> {
    const row = await this.prisma.board.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.coverUrl !== undefined && { coverUrl: input.coverUrl }),
      },
    });

    return this.toEntity(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.board.delete({ where: { id } });
  }

  async addMember(boardId: string, userId: string): Promise<void> {
    await this.prisma.boardMember.create({
      data: { boardId, userId, role: 'MEMBER' },
    });
  }

  async removeMember(boardId: string, userId: string): Promise<void> {
    await this.prisma.boardMember.delete({
      where: { boardId_userId: { boardId, userId } },
    });
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
      coverUrl: row.coverUrl,
    });
  }
}
