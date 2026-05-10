import { Card } from '../../domain/card.entity';

export class CardResponseDto {
  id: string;
  title: string;
  description: string | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  createdAt: Date;

  static fromEntity(card: Card): CardResponseDto {
    const dto = new CardResponseDto();
    dto.id = card.id;
    dto.title = card.title;
    dto.description = card.description;
    dto.position = card.position;
    dto.columnId = card.columnId;
    dto.assigneeId = card.assigneeId;
    dto.createdAt = card.createdAt;
    return dto;
  }
}
