import { Request, Response } from "express";
import {Goal}  from "../models/goal"; 
import { IGoalCreate, IGoalUpdate } from "../interfaces/goal";

// Obtener todas las metas
export const getGoals = async (req: Request, res: Response) => {
  try {
    const goals = await Goal.find();
    res.json({ data: goals });
  } catch (error) {
    res.status(500).json({ message: "Error fetching goals", error });
  }
};

// Obtener una meta por ID
export const getGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json({ data: goal });
  } catch (error) {
    res.status(400).json({ message: "Invalid goal ID", error });
  }
};

// Crear una nueva meta
export const createGoal = async (req: Request, res: Response) => {
  try {
    const body = req.body as IGoalCreate;
    if (!body || !body.title) {
      return res.status(400).json({ message: "title is required" });
    }

    const newGoal = new Goal({
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      completed: body.completed ?? false,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json({ data: savedGoal });
  } catch (error) {
    res.status(500).json({ message: "Error creating goal", error });
  }
};

// Actualizar una meta existente
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const changes = req.body as IGoalUpdate;

    const updatedGoal = await Goal.findByIdAndUpdate(id, changes, {
      new: true, // devuelve el documento actualizado
      runValidators: true, // valida los datos antes de actualizar
    });

    if (!updatedGoal) return res.status(404).json({ message: "Goal not found" });
    res.json({ data: updatedGoal });
  } catch (error) {
    res.status(400).json({ message: "Invalid goal ID", error });
  }
};


export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedGoal = await Goal.findByIdAndDelete(id);
    if (!deletedGoal) return res.status(404).json({ message: "Goal not found" });
    res.json({ message: `Goal ${id} deleted` });
  } catch (error) {
    res.status(400).json({ message: "Invalid goal ID", error });
  }
};
