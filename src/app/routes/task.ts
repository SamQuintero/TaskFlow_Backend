import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task";
import { authMiddelware } from "../middelwares/auth";


const router = Router();

router.use(authMiddelware)
/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Listar tareas (dummy)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 */
router.get("/", getTasks);
/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Crear tarea (dummy)
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token dummy (?token=12345)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH, CRITICAL] }
 *               estimateHours: { type: number }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 */
router.post("/", createTask);
/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Actualizar tarea (dummy)
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token dummy (?token=12345)
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 */
router.put("/:id", updateTask);
/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Eliminar tarea (dummy)
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token dummy (?token=12345)
 *         schema:
 *           type: string
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
 */
router.delete("/:id", deleteTask);

export default router;