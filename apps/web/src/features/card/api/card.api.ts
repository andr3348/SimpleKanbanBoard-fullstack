import { http } from "@/shared/api/http";
import type { CardInBoard } from "@/shared/types";

export const cardApi = {
  create: (
    columnId: string,
    data: { title: string; description?: string; assigneeId?: string },
  ) =>
    http
      .post<CardInBoard>(`/columns/${columnId}/cards`, data)
      .then((r) => r.data),

  update: (
    columnId: string,
    cardId: string,
    data: { title?: string; description?: string; assigneeId?: string | null },
  ) =>
    http
      .patch<CardInBoard>(`/columns/${columnId}/cards/${cardId}`, data)
      .then((r) => r.data),

  move: (
    columnId: string,
    cardId: string,
    data: { columnId: string; position: number },
  ) =>
    http
      .patch<CardInBoard>(`/columns/${columnId}/cards/${cardId}/move`, data)
      .then((r) => r.data),

  delete: (columnId: string, cardId: string) =>
    http.delete(`/columns/${columnId}/cards/${cardId}`),
};
