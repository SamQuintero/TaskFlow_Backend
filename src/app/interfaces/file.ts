import { Document, Types } from 'mongoose';

export interface IFile extends Document {
  s3Key: string;
  fileName: string;
  mimetype: string;
  size: number;
  owner: Types.ObjectId; // El ID del usuario dueño
}