import { Router } from "express";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/task";
import { authMiddleware , authorizeRoles} from "../middelwares/auth";
import { validateBody } from "../middelwares/validate";
import { taskCreateSchema, taskUpdateSchema } from "../validation/schemas";


const router = Router();

router.use(authMiddleware)
/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Listar tareas 
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
 *                   title: "Tarea A"
 *                   priority: "HIGH"
 *                   estimateHours: 4
 *                   dueDate: "2025-12-31T00:00:00.000Z"
 *                   completed: false
 */
router.get("/", getTasks);
/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Obtener tarea por ID 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "6742a1c2f0a1b2c3d4e5f6a7"
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
 *                 title: "Tarea A"
 *                 priority: "HIGH"
 *                 estimateHours: 4
 *                 dueDate: "2025-12-31T00:00:00.000Z"
 *                 completed: false
 */
router.get("/:id", getTask);
/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Crear tarea 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH, CRITICAL] }
 *               estimateHours: { type: number }
 *               dueDate: { type: string, format: date-time }
 *           example:
 *             title: "Tarea Realtime"
 *             priority: "HIGH"
 *             estimateHours: 4
 *             dueDate: "2025-12-31T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *             example:
 *               data:
 *                 id: "6742a1c2f0a1b2c3d4e5f6a7"
 *                 title: "Tarea Realtime"
 *                 priority: "HIGH"
 *                 estimateHours: 4
 *                 dueDate: "2025-12-31T00:00:00.000Z"
 *                 completed: false
 */
router.post("/", validateBody(taskCreateSchema), createTask);
/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Actualizar tarea 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "6742a1c2f0a1b2c3d4e5f6a7"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             title: "Tarea Actualizada"
 *             priority: "MEDIUM"
 *             estimateHours: 6
 *             dueDate: "2026-01-15T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *             example:
 *               data:
 *                 id: "6742a1c2f0a1b2c3d4e5f6a7"
 *                 title: "Tarea Actualizada"
 *                 priority: "MEDIUM"
 *                 estimateHours: 6
 *                 dueDate: "2026-01-15T00:00:00.000Z"
 *                 completed: false
 */
router.put("/:id", validateBody(taskUpdateSchema), updateTask);
/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Eliminar tarea 
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
 *               properties:
 *                 message: { type: string }
 *             example:
 *               message: "Task deleted"
 */
router.delete("/:id", authorizeRoles('admin'), deleteTask);

export default router;
