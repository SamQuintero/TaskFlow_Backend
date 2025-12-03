import { Router } from "express";
import { syncCalendar, getEvents } from "../controllers/calendar.js";
import { authMiddleware } from "../middelwares/auth.js";

const router = Router();

router.use(authMiddleware)
/**
 * @openapi
 * /calendar/sync:
 *   post:
 *     tags: [Calendar]
 *     summary: Sincronizar calendario (dummy)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Calendar synced"
 */
router.post("/sync", syncCalendar);
/**
 * @openapi
 * /calendar/events:
 *   get:
 *     tags: [Calendar]
 *     summary: Obtener eventos del calendario (dummy)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { type: object }
 *             example:
 *               data:
 *                 - id: "evt-1"
 *                   title: "Evento 1"
 *                   start: "2025-12-01T09:00:00.000Z"
 *                   end: "2025-12-01T10:00:00.000Z"
 */
router.get("/events", getEvents);

export default router;
