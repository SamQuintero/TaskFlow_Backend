import { Schema, model, Document } from "mongoose";
import { ITask, Priority } from "../interfaces/task.js";

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
    goal: { type: Schema.Types.ObjectId, ref: "Goal", required: false },
  },
  {
    timestamps: true, 
  }
);

const Task = model<ITask>("Task", taskSchema);
export default Task;
