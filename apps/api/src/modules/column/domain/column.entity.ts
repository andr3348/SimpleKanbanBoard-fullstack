export interface ColumnProps {
  id: string;
  title: string;
  position: number;
  boardId: string;
}

export class Column {
  constructor(private readonly props: ColumnProps) {}

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get position(): number {
    return this.props.position;
  }

  get boardId(): string {
    return this.props.boardId;
  }
}
