import { Request, Response } from "express";
import { uploadFileToS3, getFileStreamFromS3 } from "../services/s3";
import { FileModel } from '../models/file';
import { publishFileUploaded } from "../../realtime/publishers";

// Controlador para subir un archivo a S3
export const uploadFile = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No se envió ningún archivo" });
    }
  
    // Obtenemos el ID del usuario logueado (inyectado por authMiddleware)
    // (req as any).user contiene { id, email, role } del JWT
    const userId = (req as any).user.id;
  
    try {
      const result = await uploadFileToS3(file);
  
      
      const newDbFile = await FileModel.create({
        s3Key: result.Key,
        fileName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        owner: userId 
      });
  
      console.log("Archivo subido a S3:", result.Key);
      console.log("Metadata guardada en DB:", newDbFile._id);

      try {
        publishFileUploaded(
          {
            id: String(newDbFile._id),
            s3Key: result.Key,
            fileName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            owner: userId
          },
          { userId }
        );
      } catch {}
  
      res.status(201).json({
        message: "Archivo subido con éxito",
        s3Key: result.Key,
        location: result.Location,
        dbId: newDbFile._id // devolver el ID de la base de datos
      });
  
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      res.status(500).json({ message: "Error al subir el archivo", error });
    }
  };
  
  export const getFile = async (req: Request, res: Response) => {
    const key = req.params.key;
    
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
  
    try {
      // Buscamos el archivo en nuestra BD, no directamente en S3
      const dbFile = await FileModel.findOne({ s3Key: key });
  
      if (!dbFile) {
        return res.status(404).json({ message: "Archivo no encontrado" });
      }
  
      // El usuario es el dueño? O el usuario es un 'admin'?
      if (dbFile.owner.toString() !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: "No tienes permiso para ver este archivo" });
      }
  
      const readStream = getFileStreamFromS3(key);
  
      // "Tuberia" (Pipe): Enviamos el archivo directamente al cliente
      readStream.pipe(res);
  
    } catch (error) {
      console.error("Error al obtener el archivo:", error);
      res.status(404).json({ message: "Archivo no encontrado" });
    }
  };
