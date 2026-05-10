import { Inject, Injectable } from '@nestjs/common';
import {
  BOARD_REPOSITORY,
  BoardWithRole,
  type IBoardRepository,
} from '../../domain/board.repository.interface';

@Injectable()
export class GetBoardsUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(userId: string): Promise<BoardWithRole[]> {
    return this.boardRepository.findAllByUser(userId);
  }
}
