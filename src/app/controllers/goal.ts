import { Request, Response } from "express";

export const getGoals = (req: Request, res: Response) => {
  res.json({ message: "Lista de metas" });
};

export const createGoal = (req: Request, res: Response) => {
  res.status(201).json({ message: "Meta creada" });
};

export const updateGoal = (req: Request, res: Response) => {
  res.json({ message: `Meta ${req.params.id} actualizada` });
};

export const deleteGoal = (req: Request, res: Response) => {
  res.json({ message: `Meta ${req.params.id} eliminada` });
};
