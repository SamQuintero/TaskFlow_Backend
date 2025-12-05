import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {UserModel} from "../models/users.js";
import { uploadToS3 } from "../services/s3.js";
import { FileModel } from "../models/file.js";



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

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    console.log('Uploading avatar for user:', userId);
    const user = await UserModel.findById(userId);
    
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ message: "No se envió ningún archivo" });
    }
    
    console.log('File received:', req.file.originalname, req.file.size, 'bytes');

    // Subir a S3
    const s3Key = `avatars/${userId}/${Date.now()}-${req.file.originalname}`;
    const s3Result = await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);

    // Guardar en BD
    const fileDoc = await FileModel.create({
      fileName: req.file.originalname,
      s3Key,
      size: req.file.size,
      mimetype: req.file.mimetype,
      owner: userId,
    });

    // Actualizar avatar del usuario
    user.avatar = s3Key;
    await user.save();
    
    console.log('Avatar updated successfully:', s3Key);

    res.status(200).json({
      message: "Avatar actualizado correctamente",
      avatar: s3Key,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Error al subir avatar", error });
  }
}
