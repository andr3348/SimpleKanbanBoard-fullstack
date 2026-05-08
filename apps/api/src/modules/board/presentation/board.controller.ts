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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { CreateBoardUseCase } from '../application/use-cases/create-board.usecase';
import { GetBoardsUseCase } from '../application/use-cases/get-boards.usecase';
import { GetBoardUseCase } from '../application/use-cases/get-board.usecase';
import { DeleteBoardUseCase } from '../application/use-cases/delete-board.usecase';
import { BoardResponseDto } from './dtos/board-response.dto';
import { CreateBoardDto } from '../application/dtos/create-board.dto';
import {
  type AuthenticatedUser,
  CurrentUser,
} from 'src/common/decorators/current-user.decorator';
import { InviteMemberUseCase } from '../application/use-cases/invite-member.usecase';
import { RemoveMembereUseCase } from '../application/use-cases/remove-member.usecase';
import { InviteMemberDto } from '../application/dtos/invite-member.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
    private readonly getBoardUseCase: GetBoardUseCase,
    private readonly deleteBoardUseCase: DeleteBoardUseCase,
    private readonly inviteMemberUseCase: InviteMemberUseCase,
    private readonly removeMemberUseCase: RemoveMembereUseCase,
  ) {}

  @Get()
  async getBoards(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BoardResponseDto[]> {
    const board = await this.getBoardsUseCase.execute(user.id);
    return board.map((b) => BoardResponseDto.fromEntity(b));
  }

  @Get(':id')
  async getBoard(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BoardResponseDto> {
    const board = await this.getBoardUseCase.execute(id, user.id);
    return BoardResponseDto.fromEntity(board);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Body() dto: CreateBoardDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BoardResponseDto> {
    const board = await this.createBoardUseCase.execute(dto, user.id);
    return BoardResponseDto.fromEntity(board);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBoard(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteBoardUseCase.execute(id, user.id);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.NO_CONTENT)
  async inviteMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: InviteMemberDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.inviteMemberUseCase.execute(id, user.id, dto.email);
  }

  @Delete(':id/member/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.removeMemberUseCase.execute(id, user.id, userId);
  }
}
