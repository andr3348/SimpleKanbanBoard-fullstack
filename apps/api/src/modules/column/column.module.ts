import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { BoardModule } from '../board/board.module';
import { ColumnController } from './presentation/column.controller';
import { COLUMN_REPOSITORY } from './domain/column.repository.interface';
import { ColumnRepository } from './infrastructure/column.repository';
import { CreateColumnUseCase } from './application/use-cases/create-column.usecase';
import { UpdateColumnUseCase } from './application/use-cases/update-column.usecase';
import { DeleteColumnUseCase } from './application/use-cases/delete-column.usecase';

@Module({
  imports: [PrismaModule, AuthModule, BoardModule],
  controllers: [ColumnController],
  providers: [
    { provide: COLUMN_REPOSITORY, useClass: ColumnRepository },
    CreateColumnUseCase,
    UpdateColumnUseCase,
    DeleteColumnUseCase,
  ],
  exports: [COLUMN_REPOSITORY],
})
export class ColumnModule {}
