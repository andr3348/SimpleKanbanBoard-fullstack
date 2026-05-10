import { IsInt, IsUUID, Min } from 'class-validator';

export class MoveCardDto {
  @IsUUID()
  columnId: string;

  @IsInt()
  @Min(0)
  position: number;
}
