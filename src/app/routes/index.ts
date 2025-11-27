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

// Vistas SSR (HBS)
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/app/dashboard", (req, res) => {
  res.render("app-dashboard");
});

router.get("/app/users", (req, res) => {
  res.render("app-users");
});

router.get("/app/tasks", (req, res) => {
  res.render("app-tasks");
});

router.get("/app/goals", (req, res) => {
  res.render("app-goals");
});

router.get("/app/calendar", (req, res) => {
  res.render("app-calendar");
});

router.get("/app/files", (req, res) => {
  res.render("app-files");
});

export default router;
