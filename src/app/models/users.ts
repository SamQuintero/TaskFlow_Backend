import { IUser } from "../interfaces/user";
import { Schema, model } from "mongoose";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  avatar: { type: String, required: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null }
},
 { timestamps: true });

export const UserModel = model<IUser>("User", userSchema);