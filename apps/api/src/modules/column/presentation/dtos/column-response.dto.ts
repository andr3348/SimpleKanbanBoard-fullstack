import { Column } from '../../domain/column.entity';

export class ColumnResponseDto {
  id: string;
  title: string;
  position: number;
  boardId: string;

  static fromEntity(column: Column): ColumnResponseDto {
    const dto = new ColumnResponseDto();
    dto.id = column.id;
    dto.title = column.title;
    dto.position = column.position;
    dto.boardId = column.boardId;
    return dto;
  }
}
