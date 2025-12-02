import { Router } from "express";
import { getGoals, getGoal, createGoal, updateGoal, deleteGoal } from "../controllers/goal";
import { authMiddleware, authorizeRoles} from "../middelwares/auth";
import { validateBody } from "../middelwares/validate";
import { goalCreateSchema, goalUpdateSchema } from "../validation/schemas";
const router = Router();

router.use(authMiddleware)
/**
 * @openapi
 * /goals:
 *   get:
 *     tags: [Goals]
 *     summary: Listar metas 
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
 *                 - id: "6742a1c2f0a1b2c3d4e5f6a1"
 *                   title: "Meta A"
 *                   description: "Desc A"
 *                   dueDate: "2025-12-31T00:00:00.000Z"
 *                   completed: false
 */
router.get("/", getGoals);
/**
 * @openapi
 * /goals/{id}:
 *   get:
 *     tags: [Goals]
 *     summary: Obtener meta por ID 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: object }
 *             example:
 *               data:
 *                 id: "6742a1c2f0a1b2c3d4e5f6a7"
 *                 title: "Meta A"
 *                 description: "Desc A"
 *                 dueDate: "2025-12-31T00:00:00.000Z"
 *                 completed: false
 */
router.get("/:id", getGoal);
/**
 * @openapi
 * /goals:
 *   post:
 *     tags: [Goals]
 *     summary: Crear meta 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             title: "Meta Realtime"
 *             description: "Descripción de la meta"
 *             dueDate: "2025-12-31T00:00:00.000Z"
 *             completed: false
 *     responses:
 *       201:
 *         description: Creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: object }
 *             example:
 *               data:
 *                 id: "6742a1c2f0a1b2c3d4e5f6a7"
 *                 title: "Meta Realtime"
 *                 description: "Descripción de la meta"
 *                 dueDate: "2025-12-31T00:00:00.000Z"
 *                 completed: false
 */
router.post("/", validateBody(goalCreateSchema), createGoal);
/**
 * @openapi
 * /goals/{id}:
 *   put:
 *     tags: [Goals]
 *     summary: Actualizar meta 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             title: "Meta Actualizada"
 *             description: "Nueva descripción"
 *             dueDate: "2026-01-15T00:00:00.000Z"
 *             completed: true
 *     responses:
 *       200:
 *         description: Actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data: { type: object }
 *             example:
 *               data:
 *                 id: "6742a1c2f0a1b2c3d4e5f6a7"
 *                 title: "Meta Actualizada"
 *                 description: "Nueva descripción"
 *                 dueDate: "2026-01-15T00:00:00.000Z"
 *                 completed: true
 */
router.put("/:id", validateBody(goalUpdateSchema), updateGoal);
/**
 * @openapi
 * /goals/{id}:
 *   delete:
 *     tags: [Goals]
 *     summary: Eliminar meta 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Goal deleted"
 */
router.delete("/:id",authorizeRoles('admin'), deleteGoal);

export default router;
