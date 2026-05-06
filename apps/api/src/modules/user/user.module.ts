import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserController } from './presentation/user.controller';
import { USER_REPOSITORY } from './domain/user.repository.interface';
import { UserRepository } from './infrastructure/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { GetUserUseCase } from './application/use-cases/get-user.usecase';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)], // forwardRef fixes circular dependency
  controllers: [UserController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    CreateUserUseCase,
    GetUserUseCase,
  ],
  exports: [GetUserUseCase, USER_REPOSITORY],
})
export class UserModule {}
