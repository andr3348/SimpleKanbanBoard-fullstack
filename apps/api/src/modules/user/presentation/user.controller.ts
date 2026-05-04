import { Controller, Get, Param } from '@nestjs/common';
import { UserResponseDto } from './dtos/user-response.dto';
import { GetUserUseCase } from '../application/user-cases/get-user.usecase';

@Controller('users')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserUseCase.execute(id);
    return UserResponseDto.fromEntity(user);
  }
}
