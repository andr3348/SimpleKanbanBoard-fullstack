import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CARD_REPOSITORY,
  type ICardRepository,
} from '../../domain/card.repository.interface';
import {
  COLUMN_REPOSITORY,
  type IColumnRepository,
} from 'src/modules/column/domain/column.repository.interface';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from 'src/modules/board/domain/board.repository.interface';
import { CreateCardDto } from '../dtos/create-card.dto';
import { Card } from '../../domain/card.entity';

@Injectable()
export class CreateCardUseCase {
  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: ICardRepository,
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: IColumnRepository,
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(
    dto: CreateCardDto,
    columnId: string,
    requesterId: string,
  ): Promise<Card> {
    const column = await this.columnRepository.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    const isMember = await this.boardRepository.isMember(
      column.boardId,
      requesterId,
    );
    if (!isMember) throw new ForbiddenException('Access denied');

    const position = await this.cardRepository.getNextPosition(columnId);

    return this.cardRepository.create({
      title: dto.title,
      description: dto.description,
      assigneeId: dto.assigneeId,
      position,
      columnId,
    });
  }
}
