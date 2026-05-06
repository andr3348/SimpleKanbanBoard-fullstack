import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/user.repository.interface';
import { HashingService } from '../../domain/services/hashing.service';
import { RegisterDto } from '../dtos/register.dto';
import { JwtService } from '../../domain/services/jwt.service';
import { AuthResult } from '../dtos/auth-result';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResult> {
    const isEmailTaken = await this.userRepository.findByEmail(dto.email);
    if (isEmailTaken) throw new ConflictException('Email already taken');

    const passwordHash = await this.hashingService.hash(dto.password);
    const user = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }
}
