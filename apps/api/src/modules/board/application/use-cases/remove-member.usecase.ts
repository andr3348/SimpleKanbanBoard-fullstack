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

    // Owner can remove anyone except themselves
    if (board.ownerId === requesterId) {
      if (board.ownerId === targetUserId)
        throw new ForbiddenException('Cannot remove the board owner');

      await this.boardRepository.removeMember(boardId, targetUserId);
      return;
    }

    // Only admin and above can remove members
    const requesterRole = await this.boardRepository.getMemberRole(
      boardId,
      requesterId,
    );
    if (requesterRole !== 'admin')
      throw new ForbiddenException('Only the owner and admins can remove members');

    // Admin cannot remove the owner
    if (board.ownerId === targetUserId)
      throw new ForbiddenException('Cannot remove the board owner');

    // Admin cannot remove other admins
    const targetRole = await this.boardRepository.getMemberRole(
      boardId,
      targetUserId,
    );
    if (targetRole === 'admin')
      throw new ForbiddenException('Admins cannot remove other admins');

    await this.boardRepository.removeMember(boardId, targetUserId);
  }
}
