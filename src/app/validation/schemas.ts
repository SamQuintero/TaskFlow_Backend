import { z } from "zod";

// Shared primitives
const email = z.string().email();
const objectId = z.string().min(1, "must be a non-empty id");

// Auth
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "password is required"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "name is required"),
  email,
  password: z.string().min(4, "password must be at least 4 chars"),
  role: z.enum(["user", "admin"]).optional(),
});

export const forgotPasswordSchema = z.object({
  email,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "token is required"),
  password: z.string().min(4, "password must be at least 4 chars"),
});

// Users
export const userCreateSchema = z.object({
  name: z.string().min(1, "name is required"),
  email,
  password: z.string().min(4, "password must be at least 4 chars"),
  role: z.enum(["user", "admin"]).optional(),
});

export const userUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: email.optional(),
    password: z.string().min(4).optional(),
    role: z.enum(["user", "admin"]).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field must be provided",
  });

// Tasks
export const taskCreateSchema = z.object({
  title: z.string().min(1, "title is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  estimateHours: z.number().int().nonnegative().optional(),
  dueDate: z.string().datetime(),
  completed: z.boolean().optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field must be provided" }
);

// Goals
export const goalCreateSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  completed: z.boolean().optional(),
});

export const goalUpdateSchema = goalCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field must be provided" }
);
