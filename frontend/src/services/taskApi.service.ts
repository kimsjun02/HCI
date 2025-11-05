import { apiService } from "./api.service";
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  PaginatedResponse,
  TaskFilters,
} from "@/types";

class TaskApiService {
  async listTasks(filters?: TaskFilters): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.priority) queryParams.append("priority", filters.priority);
    if (filters?.searchQuery)
      queryParams.append("search", filters.searchQuery);

    const query = queryParams.toString();
    return apiService.get<Task[]>(`/tasks${query ? `?${query}` : ""}`);
  }

  async getTaskById(id: string): Promise<Task> {
    return apiService.get<Task>(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    return apiService.post<Task>("/tasks", data);
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return apiService.put<Task>(`/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<void> {
    return apiService.delete<void>(`/tasks/${id}`);
  }

  async listTasksPaginated(params: {
    page: number;
    pageSize: number;
  }): Promise<PaginatedResponse<Task>> {
    return apiService.get<PaginatedResponse<Task>>(
      `/tasks?page=${params.page}&pageSize=${params.pageSize}`
    );
  }
}

export const taskApi = new TaskApiService();

