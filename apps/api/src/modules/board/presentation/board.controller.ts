import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { CreateBoardUseCase } from '../application/use-cases/create-board.usecase';
import { GetBoardsUseCase } from '../application/use-cases/get-boards.usecase';
import { GetBoardUseCase } from '../application/use-cases/get-board.usecase';
import { DeleteBoardUseCase } from '../application/use-cases/delete-board.usecase';
import { Request, Request, type Request } from 'express';
import { BoardResponseDto } from './dtos/board-response.dto';
import { CreateBoardDto } from '../application/dtos/create-board.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
    private readonly getBoardUseCase: GetBoardUseCase,
    private readonly deleteBoardUseCase: DeleteBoardUseCase,
  ) {}

  @Get()
  async getBoards(@Req() req: Request): Promise<BoardResponseDto[]> {
    const board = await this.getBoardsUseCase.execute(req.user['id']); // req.user['id'] is what JwtStrategy.validate() returns
    return board.map((b) => BoardResponseDto.fromEntity(b));
  }

  @Get(':id')
  async getBoard(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<BoardResponseDto> {
    const board = await this.getBoardUseCase.execute(id, req.user['id']);
    return BoardResponseDto.fromEntity(board);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Body() dto: CreateBoardDto,
    @Req() req: Request,
  ): Promise<BoardResponseDto> {
    const board = await this.createBoardUseCase.execute(dto, req.user['id']);
    return BoardResponseDto.fromEntity(board);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBoard(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<void> {
    await this.deleteBoardUseCase.execute(id, req.user['id']);
  }
}
