import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  COLUMN_REPOSITORY,
  type IColumnRepository,
} from '../../domain/column.repository.interface';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from 'src/modules/board/domain/board.repository.interface';
import { Column } from '../../domain/column.entity';

@Injectable()
export class UpdateColumnUseCase {
  constructor(
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: IColumnRepository,
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(
    columnId: string,
    title: string,
    requesterId: string,
  ): Promise<Column> {
    const column = await this.columnRepository.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    const isMember = await this.boardRepository.isMember(
      column.boardId,
      requesterId,
    );
    if (!isMember) throw new ForbiddenException('Access denied');

    return this.columnRepository.update(columnId, title);
  }
}
