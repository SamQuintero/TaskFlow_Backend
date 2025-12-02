import { Document } from "mongoose";

export interface IGoal extends Document {
  id: number;
  title: string;
  description?: string;
  dueDate?: string; // ISO 8601
  completed: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  owner: any; // ObjectId del creador (ref User)
}

export interface IGoalCreate  {
  title: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  owner?: any; // lo asigna el servidor desde el JWT
}

export type IGoalUpdate = Partial<IGoalCreate>;
