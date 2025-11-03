import { Request, Response } from "express";
import { IGoalCreate, IGoalUpdate } from "../interfaces/goal";
import {
  listGoals,
  getGoalById,
  createGoalModel,
  updateGoalModel,
  deleteGoalModel,
} from "../models/goal";

export const getGoals = (req: Request, res: Response) => {
  res.json({ data: listGoals() });
};

export const getGoal = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const goal = getGoalById(id);
  if (!goal) return res.status(404).json({ message: "Goal not found" });
  res.json({ data: goal });
};

export const createGoal = (req: Request, res: Response) => {
  const body = req.body as IGoalCreate;
  if (!body || !body.title) {
    return res.status(400).json({ message: "title is required" });
  }
  const goal = createGoalModel(body);
  res.status(201).json({ data: goal });
};

export const updateGoal = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const changes = req.body as IGoalUpdate;
  const updated = updateGoalModel(id, changes);
  if (!updated) return res.status(404).json({ message: "Goal not found" });
  res.json({ data: updated });
};

export const deleteGoal = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const ok = deleteGoalModel(id);
  if (!ok) return res.status(404).json({ message: "Goal not found" });
  res.json({ message: `Meta ${id} eliminada` });
};
