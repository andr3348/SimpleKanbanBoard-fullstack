import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './presentation/user.controller';
import { USER_REPOSITORY } from './domain/user.repository.interface';
import { UserRepository } from './infrastructure/user.repository';
import { CreateUserUseCase } from './application/user-cases/create-user.usecase';
import { GetUserUseCase } from './application/user-cases/get-user.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    CreateUserUseCase,
    GetUserUseCase,
  ],
  exports: [GetUserUseCase],
})
export class UserModule {}
