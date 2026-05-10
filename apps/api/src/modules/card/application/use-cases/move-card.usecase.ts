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
import { MoveCardDto } from '../dtos/move-card.dto';
import { Card } from '../../domain/card.entity';

@Injectable()
export class MoveCardUseCase {
  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: ICardRepository,
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: IColumnRepository,
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(
    cardId: string,
    dto: MoveCardDto,
    requesterId: string,
  ): Promise<Card> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) throw new NotFoundException('Card not found');

    const column = await this.columnRepository.findById(card.columnId);
    if (!column) throw new NotFoundException('Column not found');

    const isMember = await this.boardRepository.isMember(
      column.boardId,
      requesterId,
    );
    if (!isMember) throw new ForbiddenException('Access denied');

    const targetColumn = await this.columnRepository.findById(dto.columnId);
    if (!targetColumn) throw new NotFoundException('Target column not found');

    // Ensure target column belongs to the same board
    if (targetColumn.boardId !== column.boardId)
      throw new ForbiddenException('Cannot move card across different boards');

    return this.cardRepository.move(cardId, dto.columnId, dto.position);
  }
}
