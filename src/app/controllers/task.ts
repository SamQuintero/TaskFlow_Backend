import { Request, Response } from "express";
import { ITaskCreate, ITaskUpdate } from "../interfaces/task";
import {
  listTasks,
  getTaskById,
  createTaskModel,
  updateTaskModel,
  deleteTaskModel,
} from "../models/task";

export const getTasks = (req: Request, res: Response) => {
  res.json({ data: listTasks() });
};

export const getTask = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const task = getTaskById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ data: task });
};

export const createTask = (req: Request, res: Response) => {
  const body = req.body as ITaskCreate;
  if (!body || !body.title || !body.priority) {
    return res.status(400).json({ message: "title and priority are required" });
  }
  const task = createTaskModel(body);
  res.status(201).json({ data: task });
};

export const updateTask = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const changes = req.body as ITaskUpdate;
  const updated = updateTaskModel(id, changes);
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json({ data: updated });
};

export const deleteTask = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const ok = deleteTaskModel(id);
  if (!ok) return res.status(404).json({ message: "Task not found" });
  res.json({ message: `Tarea ${id} eliminada` });
};
