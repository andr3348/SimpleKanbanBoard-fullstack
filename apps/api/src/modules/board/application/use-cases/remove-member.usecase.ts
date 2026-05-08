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
export class RemoveMembereUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(
    boardId: string,
    requesterId: string,
    targetUserId: string,
  ): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    if (board.ownerId !== requesterId)
      throw new ForbiddenException('Only the owner can remove members');
    if (board.ownerId === targetUserId)
      throw new ForbiddenException('Cannot remove the board owner');

    await this.boardRepository.removeMember(boardId, targetUserId);
  }
}
