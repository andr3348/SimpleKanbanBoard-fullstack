export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export class User {
  constructor(public readonly props: UserProps) {}
}
