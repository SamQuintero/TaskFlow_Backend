import { Router } from "express";
import { getGoals, getGoal, createGoal, updateGoal, deleteGoal } from "../controllers/goal";
import { authMiddleware, authorizeRoles} from "../middelwares/auth";
const router = Router();

router.use(authMiddleware)
/**
 * @openapi
 * /goals:
 *   get:
 *     tags: [Goals]
 *     summary: Listar metas 
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token 
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getGoals);
/**
 * @openapi
 * /goals/{id}:
 *   get:
 *     tags: [Goals]
 *     summary: Obtener meta por ID 
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token 
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id", getGoal);
/**
 * @openapi
 * /goals:
 *   post:
 *     tags: [Goals]
 *     summary: Crear meta 
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token 
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Creada
 */
router.post("/", createGoal);
/**
 * @openapi
 * /goals/{id}:
 *   put:
 *     tags: [Goals]
 *     summary: Actualizar meta 
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token 
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Actualizada
 */
router.put("/:id", updateGoal);
/**
 * @openapi
 * /goals/{id}:
 *   delete:
 *     tags: [Goals]
 *     summary: Eliminar meta 
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token 
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Eliminada
 */
router.delete("/:id",authorizeRoles('admin'), deleteGoal);

export default router;
