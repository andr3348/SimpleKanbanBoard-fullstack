import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterDto } from '../application/dtos/register.dto';
import { LoginDto } from '../application/dtos/login.dto';
import { type Response } from 'express';
import { AuthResponseDto } from './dtos/auth-response.dto';
import {
  type AuthenticatedUser,
  CurrentUser,
} from 'src/common/decorators/current-user.decorator';
import { GetUserUseCase } from 'src/modules/user/application/use-cases/get-user.usecase';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly getUser: GetUserUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, token } = await this.registerUser.execute(dto);
    this.setTokenCookie(res, token);
    return AuthResponseDto.fromEntity(user);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { user, token } = await this.loginUser.execute(dto);
    this.setTokenCookie(res, token);
    return AuthResponseDto.fromEntity(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser): Promise<AuthResponseDto> {
    const currentUser = await this.getUser.execute(user.id);
    return AuthResponseDto.fromEntity(currentUser);
  }

  private setTokenCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 24h
    });
  }
}
