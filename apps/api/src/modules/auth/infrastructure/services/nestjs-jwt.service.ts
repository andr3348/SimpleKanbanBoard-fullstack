import { Injectable } from '@nestjs/common';
import { JwtPayload, JwtService } from '../../domain/services/jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class NestJsJwtService extends JwtService {
  constructor(private readonly jwt: NestJwtService) {
    super();
  }

  sign(payload: JwtPayload): string {
    return this.jwt.sign(payload);
  }

  verify(token: string): JwtPayload {
    return this.jwt.verify<JwtPayload>(token);
  }
}
