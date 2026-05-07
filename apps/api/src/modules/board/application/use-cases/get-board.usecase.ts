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
import { Board } from '../../domain/board.entity';

@Injectable()
export class GetBoardUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(boardId: string, requesterId: string): Promise<Board> {
    const board = await this.boardRepository.findbyId(boardId);
    if (!board) throw new NotFoundException('Board not found');

    // if board exists, check if requester is a member
    const isMember = await this.boardRepository.isMember(boardId, requesterId);
    if (!isMember) throw new ForbiddenException('Access denied');

    return board;
  }
}
