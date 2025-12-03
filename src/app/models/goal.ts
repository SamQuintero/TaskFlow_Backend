import mongoose, { Schema, Document } from "mongoose";
import { IGoal } from "../interfaces/goal.js";


const goalSchema = new Schema<IGoal>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String }, 
    completed: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true, 
  }
);


export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
