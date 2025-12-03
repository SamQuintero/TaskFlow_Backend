import { Schema, model, Document, Types } from 'mongoose';
import { IFile } from '../interfaces/file.js'; // Crearemos esta interfaz ahora

const fileSchema = new Schema<IFile>(
  {
    s3Key: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    
    
    // conectamos el archivo con el usuario que lo subió
    owner: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', // Referencia al 'UserModel'
      required: true 
    },
  },
  {
    timestamps: true, // Crea createdAt y updatedAt automáticamente
  }
);

export const FileModel = model<IFile>('File', fileSchema);