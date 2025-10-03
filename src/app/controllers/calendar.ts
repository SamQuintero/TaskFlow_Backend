import { Request, Response } from "express";

export const syncCalendar = (req: Request, res: Response) => {
  res.json({ message: "Calendario sincronizado con éxito" });
};

export const getEvents = (req: Request, res: Response) => {
  res.json({ message: "Eventos obtenidos del calendario" });
};
