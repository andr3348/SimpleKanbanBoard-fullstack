import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../domain/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../../domain/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRespository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRespository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    return this.userRespository.create({
      email: dto.email,
      name: dto.name,
      passwordHash: dto.passwordHash,
    });
  }
}
