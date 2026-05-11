import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  coverUrl?: string;
}
