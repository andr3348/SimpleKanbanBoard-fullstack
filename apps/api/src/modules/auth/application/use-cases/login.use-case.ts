import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/user.repository.interface';
import { HashingService } from '../../domain/services/hashing.service';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '../../domain/services/jwt.service';
import { AuthResult } from '../dtos/auth-result';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await this.hashingService.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user, token };
  }
}
