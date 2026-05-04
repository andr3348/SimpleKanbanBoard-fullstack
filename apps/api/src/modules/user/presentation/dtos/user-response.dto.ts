import { User } from '../../domain/user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.props.id;
    dto.name = user.props.name;
    dto.email = user.props.email;
    dto.createdAt = user.props.createdAt;
    return dto;
  }
}
