import { User } from 'src/modules/user/domain/user.entity';

export class AuthResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;

  static fromEntity(user: User): AuthResponseDto {
    const dto = new AuthResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
