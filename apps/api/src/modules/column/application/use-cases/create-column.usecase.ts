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
import { CreateColumnDto } from '../dtos/create-column.dto';
import { Column } from '../../domain/column.entity';

@Injectable()
export class CreateColumnUseCase {
  constructor(
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: IColumnRepository,
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(
    dto: CreateColumnDto,
    boardId: string,
    requesterId: string,
  ): Promise<Column> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    const isMember = await this.boardRepository.isMember(boardId, requesterId);
    if (!isMember) throw new ForbiddenException('Access denied');

    const position = await this.columnRepository.getNextPosition(boardId);

    return this.columnRepository.create({
      title: dto.title,
      position,
      boardId,
    });
  }
}
