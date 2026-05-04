import { User } from './user.entity';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserInput): Promise<User>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
