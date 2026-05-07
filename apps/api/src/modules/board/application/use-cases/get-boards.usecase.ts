import { Inject, Injectable } from '@nestjs/common';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from '../../domain/board.repository.interface';
import { Board } from '../../domain/board.entity';

@Injectable()
export class GetBoardsUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(userId: string): Promise<Board[]> {
    return this.boardRepository.findAllByUser(userId);
  }
}
