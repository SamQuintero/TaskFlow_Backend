import { Router } from "express";
import { syncCalendar, getEvents } from "../controllers/calendar";
import { authMiddelware } from "../middelwares/auth";

const router = Router();

router.use(authMiddelware)
/**
 * @openapi
 * /calendar/sync:
 *   post:
 *     tags: [Calendar]
 *     summary: Sincronizar calendario (dummy)
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token dummy (?token=12345)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/sync", syncCalendar);
/**
 * @openapi
 * /calendar/events:
 *   get:
 *     tags: [Calendar]
 *     summary: Obtener eventos del calendario (dummy)
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token dummy (?token=12345)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/events", getEvents);

export default router;