export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ITask {
  id: number;
  title: string;
  priority: Priority;
  estimateHours?: number;
  dueDate?: string; // ISO 8601 string
  completed: boolean;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface ITaskCreate {
  title: string;
  priority: Priority;
  estimateHours?: number;
  dueDate?: string;
  completed?: boolean;
}

export type ITaskUpdate = Partial<ITaskCreate>;
