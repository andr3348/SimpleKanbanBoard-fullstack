import { http } from "@/shared/api/http";
import { BoardDetail, BoardWithRole } from "@/shared/types";

export const boardApi = {
  getAll: () => http.get<BoardWithRole[]>("/boards").then((r) => r.data),

  getById: (id: string) =>
    http.get<BoardDetail>(`/boards/${id}`).then((r) => r.data),

  create: (data: { title: string; description?: string }) =>
    http.post<BoardWithRole>("/boards", data).then((r) => r.data),

  delete: (id: string) => http.delete(`/boards/${id}`),
};
