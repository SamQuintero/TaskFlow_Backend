import { Router } from "express";
import { syncCalendar, getEvents } from "../controllers/calendar";
import { authMiddelware } from "../middelwares/auth";

const router = Router();

router.use(authMiddelware)
router.post("/sync", syncCalendar);
router.get("/events", getEvents);

export default router;