import { Router } from "express";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goal";
import { authMiddelware } from "../middelwares/auth";
const router = Router();

router.use(authMiddelware)
router.get("/", getGoals);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
