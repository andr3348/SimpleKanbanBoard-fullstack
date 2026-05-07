import { Inject, Injectable } from '@nestjs/common';
import {
  BOARD_REPOSITORY,
  type IBoardRepository,
} from '../../domain/board.repository.interface';
import { CreateBoardDto } from '../dtos/create-board.dto';
import { Board } from '../../domain/board.entity';

@Injectable()
export class CreateBoardUseCase {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: IBoardRepository,
  ) {}

  async execute(dto: CreateBoardDto, ownerId: string): Promise<Board> {
    return this.boardRepository.create({
      title: dto.title,
      description: dto.description,
      ownerId,
    });
  }
}
