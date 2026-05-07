import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from '../../domain/board.repository.interface';

@Injectable()
export class DeleteBoardUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(boardId: string, requesterId: string): Promise<void> {
    const board = await this.boardRepository.findbyId(boardId);
    if (!board) throw new NotFoundException('Board not found');

    if (board.ownerId !== requesterId)
      throw new ForbiddenException('Only the owner can delete this board');

    return this.boardRepository.delete(boardId);
  }
}
