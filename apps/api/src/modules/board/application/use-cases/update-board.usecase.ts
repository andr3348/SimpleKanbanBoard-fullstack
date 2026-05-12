import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from '../../domain/board.repository.interface';
import { UpdateBoardDto } from '../dtos/update-board.dto';
import { Board } from '../../domain/board.entity';

@Injectable()
export class UpdateBoardUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(
    boardId: string,
    dto: UpdateBoardDto,
    userId: string,
  ): Promise<Board> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new Error('Board not found');
    }

    // Only owner can update the board
    if (board.ownerId !== userId) {
      throw new UnauthorizedException('Only board owner can update the board');
    }

    return this.boardRepository.update(boardId, {
      title: dto.title,
      description: dto.description,
      coverUrl: dto.coverUrl,
    });
  }
}
