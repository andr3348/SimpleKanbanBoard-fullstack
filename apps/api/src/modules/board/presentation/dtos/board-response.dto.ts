import { Board } from '../../domain/board.entity';

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
