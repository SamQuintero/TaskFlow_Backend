import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodIssue } from "zod";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.issues.map((e: ZodIssue) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
      });
    }
    // replace body with parsed data to ensure correct types
    (req as any).body = parsed.data;
    next();
  };
}
