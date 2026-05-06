import { User } from 'src/modules/user/domain/user.entity';

export interface AuthResult {
  user: User;
  token: string;
}
