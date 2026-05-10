import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
