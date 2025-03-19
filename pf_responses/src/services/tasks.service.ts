// src/services/tasks.service.ts
import api from '@/lib/api';

interface TaskData {
    title: string;
    description?: string;
    team: number;
    assigned_to?: number;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    due_date?: string;
  }
  
  export const tasksService = {
    async createTask(data: TaskData) {
      const response = await api.post('/tasks/', data);
      return response.data;
    },
  
    async getTasks(filters?: {
      status?: string;
      team?: number;
      due_date?: string;
    }) {
      const response = await api.get('/tasks/', { params: filters });
      return response.data;
    },
  
    async changeTaskStatus(taskId: number, status: string) {
      const response = await api.post(`/tasks/${taskId}/change_status/`, {
        status
      });
      return response.data;
    },
  
    async updateTask(taskId: number, data: Partial<TaskData>) {
      const response = await api.patch(`/tasks/${taskId}/`, data);
      return response.data;
    },
  
    async deleteTask(taskId: number) {
      await api.delete(`/tasks/${taskId}/`);
    }
  };