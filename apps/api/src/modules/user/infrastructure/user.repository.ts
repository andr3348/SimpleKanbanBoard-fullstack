import { Injectable } from '@nestjs/common';
import {
  CreateUserInput,
  IUserRepository,
} from '../domain/user.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../domain/user.entity';
import { User as PrismaUser } from 'src/generated/prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(raw: PrismaUser): User {
    return new User(raw);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.toEntity(user);
  }

  async create(user: CreateUserInput): Promise<User> {
    const raw = await this.prisma.user.create({ data: user });
    return this.toEntity(raw);
  }
}
