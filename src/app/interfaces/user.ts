import { Document } from "mongoose";

export interface IUser  extends Document{
    id?: number;
    name: string;
    email : string;
    password?: string;
    googleId?: string;   
    avatar?: string;  
    role: "user" | "admin";
    verified: boolean;
    verificationToken?: string;
}

