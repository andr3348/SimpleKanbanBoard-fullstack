import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  COLUMN_REPOSITORY,
  type IColumnRepository,
} from '../../domain/column.repository.interface';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from 'src/modules/board/domain/board.repository.interface';

@Injectable()
export class DeleteColumnUseCase {
  constructor(
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: IColumnRepository,
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(columnId: string, requesterId: string): Promise<void> {
    const column = await this.columnRepository.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    const isMember = await this.boardRepository.isMember(
      column.boardId,
      requesterId,
    );
    if (!isMember)
      throw new NotFoundException('You are not a member of this board');

    return this.columnRepository.delete(columnId);
  }
}
