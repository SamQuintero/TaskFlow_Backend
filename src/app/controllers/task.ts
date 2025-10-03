import { Request, Response } from "express";

export const getTasks = (req: Request, res: Response) => {
  res.json({ message: "Lista de tareas" });
};

export const createTask = (req: Request, res: Response) => {
  res.status(201).json({ message: "Tarea creada" });
};

export const updateTask = (req: Request, res: Response) => {
  res.json({ message: `Tarea ${req.params.id} actualizada` });
};

export const deleteTask = (req: Request, res: Response) => {
  res.json({ message: `Tarea ${req.params.id} eliminada` });
};