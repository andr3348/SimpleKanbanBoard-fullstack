export interface BoardProps {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  coverUrl: string | null;
}

export class Board {
  constructor(private readonly props: BoardProps) {}

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get coverUrl(): string | null {
    return this.props.coverUrl;
  }
}
