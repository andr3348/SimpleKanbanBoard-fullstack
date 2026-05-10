import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BoardModule } from '../board/board.module';
import { ColumnModule } from '../column/column.module';
import { CardController } from './presentation/card.controller';
import { Module } from '@nestjs/common';
import { CARD_REPOSITORY } from './domain/card.repository.interface';
import { CardRepository } from './infrastructure/card.repository';
import { CreateCardUseCase } from './application/use-cases/create-card.usecase';
import { UpdateCardUseCase } from './application/use-cases/update-card.usecase';
import { MoveCardUseCase } from './application/use-cases/move-card.usecase';
import { DeleteCardUseCase } from './application/use-cases/delete-card.usecase';

@Module({
  imports: [PrismaModule, AuthModule, BoardModule, ColumnModule],
  controllers: [CardController],
  providers: [
    { provide: CARD_REPOSITORY, useClass: CardRepository },
    CreateCardUseCase,
    UpdateCardUseCase,
    MoveCardUseCase,
    DeleteCardUseCase,
  ],
  exports: [],
})
export class CardModule {}
