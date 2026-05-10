import { Board } from '../../domain/board.entity';
import { BoardRole } from '../../domain/board.repository.interface';

export class BoardResponseDto {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;

  static fromEntity(board: Board): BoardResponseDto {
    const dto = new BoardResponseDto();
    dto.id = board.id;
    dto.title = board.title;
    dto.description = board.description;
    dto.ownerId = board.ownerId;
    dto.createdAt = board.createdAt;
    return dto;
  }
}

export class BoardListItemResponseDto {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  role: BoardRole;

  static fromBoardWithRole(
    board: Board,
    role: BoardRole,
  ): BoardListItemResponseDto {
    const dto = new BoardListItemResponseDto();
    dto.id = board.id;
    dto.title = board.title;
    dto.description = board.description;
    dto.ownerId = board.ownerId;
    dto.createdAt = board.createdAt;
    dto.role = role;
    return dto;
  }
}
