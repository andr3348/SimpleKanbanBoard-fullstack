import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string | null;
}
