import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { HashingService } from './domain/services/hashing.service';
import { BcryptHashingService } from './infrastructure/services/bcrypt-hashing.service';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/auth.controller';
import { JwtService } from './domain/services/jwt.service';
import { NestJsJwtService } from './infrastructure/services/nestjs-jwt.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => UserModule), // forwardRef fixes circular dependency
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: HashingService, useClass: BcryptHashingService },
    { provide: JwtService, useClass: NestJsJwtService },
    JwtStrategy,
    JwtAuthGuard,
    RegisterUseCase,
    LoginUseCase,
  ],
  exports: [JwtAuthGuard, JwtStrategy], // exported for use in other modules
})
export class AuthModule {}
