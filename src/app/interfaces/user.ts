import { Document } from "mongoose";

export interface IUser  extends Document{
    id?: number;
    name: string;
    email : string;
    password?: string;
    role: "user" | "admin";
}

