import { Document } from "mongoose";

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ITask extends Document{
  id: number;
  title: string;
  priority: Priority;
  estimateHours?: number;
  dueDate?: string; // ISO 8601 string
  completed: boolean;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  owner: any; // ObjectId del creador (ref User)
  goal?: any; // ObjectId de la meta (ref Goal)
}

export interface ITaskCreate extends Document{
  title: string;
  priority: Priority;
  estimateHours?: number;
  dueDate?: string;
  completed?: boolean;
  goal?: any; // ObjectId de la meta
}

export type ITaskUpdate = Partial<ITaskCreate>;
