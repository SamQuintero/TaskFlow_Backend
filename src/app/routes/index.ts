import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import taskRoutes from "./task";
import goalRoutes from "./goal";
import calendarRoutes from "./calendar";
import fileRoutes from "./files";


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/goals", goalRoutes);
router.use("/calendar", calendarRoutes);
router.use("/files", fileRoutes);

router.get("/socket-demo", (req, res) => {
  res.render("socket-demo");
});

export default router;
