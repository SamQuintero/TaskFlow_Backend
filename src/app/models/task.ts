import { Schema, model, Document } from "mongoose";
import { ITask, Priority } from "../interfaces/task";

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    priority: { type: String,                     
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as Priority[], 
    default: "MEDIUM"},
    estimateHours: { type: Number, required: false },
    dueDate: { type: String, required: false }, 
    completed: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true, 
  }
);

const Task = model<ITask>("Task", taskSchema);
export default Task;
