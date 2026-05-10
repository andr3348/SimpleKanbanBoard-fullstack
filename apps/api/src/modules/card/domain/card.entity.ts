export interface CardProps {
  id: string;
  title: string;
  description: string | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  createdAt: Date;
}

export class Card {
  constructor(private readonly props: CardProps) {}

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null {
    return this.props.description;
  }

  get position(): number {
    return this.props.position;
  }

  get columnId(): string {
    return this.props.columnId;
  }

  get assigneeId(): string | null {
    return this.props.assigneeId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
