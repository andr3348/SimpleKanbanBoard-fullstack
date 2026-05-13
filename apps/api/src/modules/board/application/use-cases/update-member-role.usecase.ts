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
export class UpdateMemberRoleUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(
    boardId: string,
    requesterId: string,
    targetUserId: string,
    role: 'admin' | 'member',
  ): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    if (board.ownerId !== requesterId)
      throw new ForbiddenException('Only the owner can change member roles');

    if (board.ownerId === targetUserId)
      throw new ForbiddenException('Cannot change the board owner role');

    const isTargetMember = await this.boardRepository.isMember(
      boardId,
      targetUserId,
    );
    if (!isTargetMember)
      throw new NotFoundException('User is not a member of this board');

    await this.boardRepository.updateMemberRole(boardId, targetUserId, role);
  }
}
