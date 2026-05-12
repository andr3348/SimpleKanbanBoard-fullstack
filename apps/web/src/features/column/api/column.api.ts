import { http } from "@/shared/api/http";
import type { ColumnInBoard } from "@/shared/types";

export const columnApi = {
  create: (boardId: string, title: string) =>
    http
      .post<ColumnInBoard>(`/boards/${boardId}/columns`, { title })
      .then((r) => r.data),

  update: (boardId: string, columnId: string, title: string) =>
    http
      .patch<ColumnInBoard>(`/boards/${boardId}/columns/${columnId}`, { title })
      .then((r) => r.data),

  delete: (boardId: string, columnId: string) =>
    http.delete(`/boards/${boardId}/columns/${columnId}`),
};
