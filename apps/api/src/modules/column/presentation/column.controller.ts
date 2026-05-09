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
import { CreateColumnUseCase } from '../application/use-cases/create-column.usecase';
import { UpdateColumnUseCase } from '../application/use-cases/update-column.usecase';
import { DeleteColumnUseCase } from '../application/use-cases/delete-column.usecase';
import {
  type AuthenticatedUser,
  CurrentUser,
} from 'src/common/decorators/current-user.decorator';
import { CreateColumnDto } from '../application/dtos/create-column.dto';
import { ColumnResponseDto } from './dtos/column-response.dto';
import { UpdateColumnDto } from '../application/dtos/update-column.dto';

@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/columns')
export class ColumnController {
  constructor(
    private readonly createColumnUseCase: CreateColumnUseCase,
    private readonly updateColumnUseCase: UpdateColumnUseCase,
    private readonly deleteColumnUseCase: DeleteColumnUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateColumnDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ColumnResponseDto> {
    const column = await this.createColumnUseCase.execute(
      dto,
      boardId,
      user.id,
    );
    return ColumnResponseDto.fromEntity(column);
  }

  @Patch(':columnId')
  async update(
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() dto: UpdateColumnDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ColumnResponseDto> {
    const column = await this.updateColumnUseCase.execute(
      columnId,
      dto.title,
      user.id,
    );
    return ColumnResponseDto.fromEntity(column);
  }

  @Delete(':columnId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteColumnUseCase.execute(columnId, user.id);
  }
}
