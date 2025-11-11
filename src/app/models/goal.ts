import mongoose, { Schema, Document } from "mongoose";
import { IGoal } from "../interfaces/goal";


const goalSchema = new Schema<IGoal>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String }, 
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true, 
  }
);


export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
