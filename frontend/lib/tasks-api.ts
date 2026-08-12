import { Task, Subtask, Comment } from "@/types";
import { api } from "@/lib/api";

export const tasksApi = {
  getAll: (params?: { status?: string; search?: string }) => {
    const qs = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return api.get<Task[]>(`/tasks${qs}`);
  },
  getOne: (id: string) => api.get<Task>(`/tasks/${id}`),
  create: (data: Partial<Task>) => api.post<Task>("/tasks", data),
  update: (id: string, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const subtasksApi = {
  getByTask: (taskId: string) => api.get<Subtask[]>(`/tasks/${taskId}/subtasks`),
  create: (taskId: string, data: Partial<Subtask>) =>
    api.post<Subtask>(`/tasks/${taskId}/subtasks`, data),
  update: (id: string, data: Partial<Subtask>) =>
    api.patch<Subtask>(`/subtasks/${id}`, data),
  delete: (id: string) => api.delete(`/subtasks/${id}`),
};

export const commentsApi = {
  getByTask: (taskId: string) => api.get<Comment[]>(`/tasks/${taskId}/comments`),
  create: (taskId: string, content: string) =>
    api.post<Comment>(`/tasks/${taskId}/comments`, { content }),
  delete: (taskId: string, id: string) =>
    api.delete(`/tasks/${taskId}/comments/${id}`),
};

export const usersApi = {
  getAll: () => api.get<any[]>("/users"),
};

export const labelsApi = {
  getAll: () => api.get<any[]>("/labels"),
};
