import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task";
import { authMiddelware } from "../middelwares/auth";


const router = Router();

router.use(authMiddelware)
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;