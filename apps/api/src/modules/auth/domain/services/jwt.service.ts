export interface JwtPayload {
  sub: string;
  email: string;
}

export abstract class JwtService {
  abstract sign(payload: JwtPayload): string;
  abstract verify(token: string): JwtPayload;
}
