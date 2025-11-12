import { Document } from "mongoose";

export interface IGoal extends Document {
  id: number;
  title: string;
  description?: string;
  dueDate?: string; // ISO 8601
  completed: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface IGoalCreate  {
  title: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
}

export type IGoalUpdate = Partial<IGoalCreate>;
