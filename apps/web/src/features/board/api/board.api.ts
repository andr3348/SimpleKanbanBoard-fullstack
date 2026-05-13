import { http } from "@/shared/api/http";
import { BoardDetail, BoardWithRole } from "@/shared/types";

export const boardApi = {
  getAll: () => http.get<BoardWithRole[]>("/boards").then((r) => r.data),

  getById: (id: string) =>
    http.get<BoardDetail>(`/boards/${id}`).then((r) => r.data),

  create: (data: { title: string; description?: string; coverUrl?: string }) =>
    http.post<BoardWithRole>("/boards", data).then((r) => r.data),

  update: (
    id: string,
    data: { title?: string; description?: string; coverUrl?: string | null },
  ) => http.patch<BoardWithRole>(`/boards/${id}`, data).then((r) => r.data),

  delete: (id: string) => http.delete(`/boards/${id}`),

  invite: (boardId: string, email: string) =>
    http.post(`/boards/${boardId}/members`, { email }),

  removeMember: (boardId: string, userId: string) =>
    http.delete(`/boards/${boardId}/members/${userId}`),

  updateMemberRole: (
    boardId: string,
    userId: string,
    role: "admin" | "member",
  ) => http.patch(`/boards/${boardId}/members/${userId}`, { role }),
};

export const unsplashApi = {
  search: (query: string) =>
    http
      .get<
        { id: string; thumbUrl: string; coverUrl: string; author: string }[]
      >(`/unsplash/search?query=${query}`)
      .then((r) => r.data),
};
