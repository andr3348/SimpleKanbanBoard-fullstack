import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { type Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * TEMPORARY - Remove in production!
 * Test endpoint to bypass login during development
 */
@Controller('auth')
export class TestAuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('test-login')
  @HttpCode(HttpStatus.OK)
  async testLogin(@Res({ passthrough: true }) res: Response) {
    // Create or get test user
    let user = await this.prisma.user.findFirst({
      where: { email: 'test@example.com' },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          passwordHash: 'test-hash', // fake hash for testing
        },
      });
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    // Set cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: 'Logged in as test user',
      user: { id: user.id, email: user.email },
      token,
    };
  }
}
