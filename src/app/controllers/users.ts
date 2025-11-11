import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {UserModel} from "../models/users";



export async function getUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
}


export async function getUser(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario", error });
  }
}


export async function createUser(req: Request, res: Response) {
  try {
    console.log(req.body)
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Faltan campos requeridos" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ name, email, password:hashedPassword });
    console.log("Usuario creado:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario", error });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // retorna el documento actualizado
    );

    if (!updatedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
}


export async function deleteUser(req: Request, res: Response) {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
}
