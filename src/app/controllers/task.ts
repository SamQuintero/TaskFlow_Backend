import { Request, Response } from "express";
import Task from "../models/task";
import { ITaskCreate, ITaskUpdate } from "../interfaces/task";
import { publishTaskCreated, publishTaskUpdated, publishTaskDeleted } from "../../realtime/publishers";


export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json({ data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};


export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ data: task });
  } catch (error) {
    res.status(400).json({ message: "Invalid task ID", error });
  }
};


export const createTask = async (req: Request, res: Response) => {
  try {
    const body = req.body as ITaskCreate;
    if (!body || !body.title) {
      return res.status(400).json({ message: "title is required" });
    }

    const newTask = new Task({
      title: body.title,
      priority: body.priority,
      estimateHours: body.estimateHours,
      dueDate: body.dueDate,
      completed: body.completed ?? false,
    });

    const savedTask = await newTask.save();
    try {
      const userId = (req as any).user?.id as string | undefined;
      publishTaskCreated(
        {
          id: String(savedTask._id),
          title: savedTask.title,
          priority: (savedTask as any).priority,
          estimateHours: (savedTask as any).estimateHours,
          dueDate: (savedTask as any).dueDate,
          completed: (savedTask as any).completed,
        },
        { userId }
      );
    } catch {}
    res.status(201).json({ data: savedTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};


export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const changes = req.body as ITaskUpdate;

    const updatedTask = await Task.findByIdAndUpdate(id, changes, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    try {
      const userId = (req as any).user?.id as string | undefined;
      publishTaskUpdated(
        {
          id: String(updatedTask._id),
          title: updatedTask.title,
          priority: (updatedTask as any).priority,
          estimateHours: (updatedTask as any).estimateHours,
          dueDate: (updatedTask as any).dueDate,
          completed: (updatedTask as any).completed,
        },
        { userId }
      );
    } catch {}
    res.json({ data: updatedTask });
  } catch (error) {
    res.status(400).json({ message: "Invalid task ID", error });
  }
};


export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    try {
      const userId = (req as any).user?.id as string | undefined;
      publishTaskDeleted({ id: String(id) }, { userId });
    } catch {}
    res.json({ message: `Task ${id} deleted` });
  } catch (error) {
    res.status(400).json({ message: "Invalid task ID", error });
  }
};
