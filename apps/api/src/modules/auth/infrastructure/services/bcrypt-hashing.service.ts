import { Injectable } from '@nestjs/common';
import { HashingService } from '../../domain/services/hashing.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashingService extends HashingService {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
