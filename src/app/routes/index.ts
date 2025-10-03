import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import taskRoutes from "./task";
import goalRoutes from "./goal";
import calendarRoutes from "./calendar";


const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/goals", goalRoutes);
router.use("/calendar", calendarRoutes);


export default router;