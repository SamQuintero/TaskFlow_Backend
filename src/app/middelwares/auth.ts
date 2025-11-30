import { Request, Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user";

/*declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}*/

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or invalid" });
  }
  
  const token = authHeader.split(" ")[1];
 
  try {
    console.log("Token recibido:", token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decoded);
    (req as any).user = decoded; 
    next();
  } catch (err) {
    console.error("Error al verificar token:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};