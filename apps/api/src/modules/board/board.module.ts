import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BoardController } from './presentation/board.controller';
import { BOARD_REPOSITORY } from './domain/board.repository.interface';
import { BoardRepository } from './infrastructure/board.repository';
import { CreateBoardUseCase } from './application/use-cases/create-board.usecase';
import { GetBoardsUseCase } from './application/use-cases/get-boards.usecase';
import { GetBoardUseCase } from './application/use-cases/get-board.usecase';
import { DeleteBoardUseCase } from './application/use-cases/delete-board.usecase';
import { UserModule } from '../user/user.module';
import { InviteMemberUseCase } from './application/use-cases/invite-member.usecase';
import { RemoveMembereUseCase } from './application/use-cases/remove-member.usecase';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [BoardController],
  providers: [
    { provide: BOARD_REPOSITORY, useClass: BoardRepository },
    CreateBoardUseCase,
    GetBoardsUseCase,
    GetBoardUseCase,
    DeleteBoardUseCase,
    InviteMemberUseCase,
    RemoveMembereUseCase,
  ],
  exports: [BOARD_REPOSITORY, GetBoardsUseCase],
})
export class BoardModule {}
