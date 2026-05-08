import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from '../../domain/board.repository.interface';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/user.repository.interface';

@Injectable()
export class InviteMemberUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    boardId: string,
    requesterId: string,
    email: string,
  ): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');
    if (board.ownerId !== requesterId)
      throw new NotFoundException('Unauthorized'); // No other user can invite members then the board owner

    const invitee = await this.userRepository.findByEmail(email);
    if (!invitee) throw new NotFoundException('User not found');

    // Verify owner cannot be invited as a member of its own board
    if (board.ownerId === invitee.id)
      throw new NotFoundException('Owner cannot be invited as a member');

    // Verify the invitee is not already a member
    const alreadyMember = await this.boardRepository.isMember(
      boardId,
      invitee.id,
    );
    if (alreadyMember) throw new NotFoundException('User is already a member');

    await this.boardRepository.addMember(boardId, invitee.id);
  }
}
