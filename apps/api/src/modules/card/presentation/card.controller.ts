import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { DeleteCardUseCase } from '../application/use-cases/delete-card.usecase';
import { MoveCardUseCase } from '../application/use-cases/move-card.usecase';
import { UpdateCardUseCase } from '../application/use-cases/update-card.usecase';
import { CreateCardUseCase } from '../application/use-cases/create-card.usecase';
import { CreateCardDto } from '../application/dtos/create-card.dto';
import {
  type AuthenticatedUser,
  CurrentUser,
} from 'src/common/decorators/current-user.decorator';
import { CardResponseDto } from './dtos/card-response.dto';
import { UpdateCardDto } from '../application/dtos/update-card.dto';
import { MoveCardDto } from '../application/dtos/move-card.dto';

@UseGuards(JwtAuthGuard)
@Controller('columns/:columnId/cards')
export class CardController {
  constructor(
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly moveCardUseCase: MoveCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() dto: CreateCardDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CardResponseDto> {
    const card = await this.createCardUseCase.execute(dto, columnId, user.id);
    return CardResponseDto.fromEntity(card);
  }

  @Patch(':cardId')
  async update(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: UpdateCardDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CardResponseDto> {
    const card = await this.updateCardUseCase.execute(cardId, dto, user.id);
    return CardResponseDto.fromEntity(card);
  }

  @Patch(':cardId/move')
  async move(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: MoveCardDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CardResponseDto> {
    const card = await this.moveCardUseCase.execute(cardId, dto, user.id);
    return CardResponseDto.fromEntity(card);
  }

  @Delete(':cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteCardUseCase.execute(cardId, user.id);
  }
}
