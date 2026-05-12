import {
  BoardDetail,
  CardInBoard,
  ColumnInBoard,
  BoardMemberInfo,
} from '../../domain/board.repository.interface';

class CardInBoardDto {
  id: string;
  title: string;
  description: string | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  createdAt: Date;

  static from(card: CardInBoard): CardInBoardDto {
    const dto = new CardInBoardDto();
    dto.id = card.id;
    dto.title = card.title;
    dto.description = card.description;
    dto.position = card.position;
    dto.columnId = card.columnId;
    dto.assigneeId = card.assigneeId;
    dto.createdAt = card.createdAt;
    return dto;
  }
}

class ColumnInBoardDto {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: CardInBoardDto[];

  static from(column: ColumnInBoard): ColumnInBoardDto {
    const dto = new ColumnInBoardDto();
    dto.id = column.id;
    dto.title = column.title;
    dto.position = column.position;
    dto.boardId = column.boardId;
    dto.cards = column.cards.map(CardInBoardDto.from);
    return dto;
  }
}

class BoardMemberDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;

  static from(member: BoardMemberInfo): BoardMemberDto {
    const dto = new BoardMemberDto();
    dto.id = member.id;
    dto.userId = member.userId;
    dto.userName = member.userName;
    dto.userEmail = member.userEmail;
    dto.role = member.role;
    return dto;
  }
}

export class BoardDetailResponseDto {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  coverUrl: string | null;
  columns: ColumnInBoardDto[];
  members: BoardMemberDto[];
  userRole: string;

  static from(detail: BoardDetail): BoardDetailResponseDto {
    const { board, columns, members, userRole } = detail;
    const dto = new BoardDetailResponseDto();
    dto.id = board.id;
    dto.title = board.title;
    dto.description = board.description;
    dto.ownerId = board.ownerId;
    dto.createdAt = board.createdAt;
    dto.coverUrl = board.coverUrl;
    dto.columns = columns.map(ColumnInBoardDto.from);
    dto.members = members.map(BoardMemberDto.from);
    dto.userRole = userRole;
    return dto;
  }
}
