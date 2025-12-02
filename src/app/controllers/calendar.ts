import { Request, Response } from "express";
import Task from "../models/task";
import { Goal } from "../models/goal";

export const syncCalendar = (req: Request, res: Response) => {
  res.json({ message: "Calendario sincronizado con éxito" });
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id as string;
    const tasks = await Task.find({ owner: userId, dueDate: { $exists: true, $ne: null } });
    const goals = await Goal.find({ owner: userId, dueDate: { $exists: true, $ne: null } });

    const events = [
      ...tasks.map((t: any) => ({
        id: String(t._id),
        type: "task",
        title: t.title,
        start: t.dueDate,
        end: t.dueDate,
        completed: !!t.completed
      })),
      ...goals.map((g: any) => ({
        id: String(g._id),
        type: "goal",
        title: g.title,
        start: g.dueDate,
        end: g.dueDate,
        completed: !!g.completed
      })),
    ];

    res.json({ data: events });
  } catch (error) {
    res.status(500).json({ message: "Error fetching calendar events" });
  }
};
