import { Request, Response } from "express";
import {
  listUsers,
  getUserById,
  createUserModel,
  updateUserModel,
  deleteUserModel,
} from "../models/users";
import { IUser } from "../interfaces/user";

export function getUsers(req: Request, res: Response) {
  // usuario autenticado inyectado por authMiddelware (token=12345)
  // console.log("User:", req.user);
  res.json({ data: listUsers() });
}

export function getUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const user = getUserById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ data: user });
}

export function createUser(req: Request, res: Response) {
  const body = req.body as Omit<IUser, "id">;
  if (!body || !body.name || !body.email) {
    return res.status(400).json({ message: "name and email are required" });
  }
  const user = createUserModel(body);
  res.status(201).json({ data: user });
}

export function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const changes = req.body as Partial<Omit<IUser, "id">>;
  const updated = updateUserModel(id, changes);
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json({ data: updated });
}

export function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });
  const ok = deleteUserModel(id);
  if (!ok) return res.status(404).json({ message: "User not found" });
  res.json({ message: `Usuario ${id} eliminado` });
}
