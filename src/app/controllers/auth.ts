import { Request, Response } from "express";
import { UserModel } from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendResetPassword } from "./mailer.js";


export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new UserModel({ name, email, password: hashedPassword ,role, verificationToken});
    await user.save();

    await sendVerificationEmail(email, verificationToken, name);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(" Error in register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password!);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email , role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1d"
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const forgotPassword = async (req:Request, res:Response) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Token válido por 15 minutos
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.BACKEND_URL}/auth/reset-password?token=${resetToken}`;

    sendResetPassword(email, resetLink, user.name)
    
    res.json({ message: "Correo enviado. Revisa tu bandeja." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error enviando correo" });
  }
};


export const resetPassword = async (req:Request, res:Response ) => {
  const { token, password } = req.body;

  try {
    const decoded: any  = jwt.verify(token, process.env.JWT_SECRET!);

    const hashed = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate(decoded.id, { password: hashed });

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Token inválido o expirado" });
  }
};