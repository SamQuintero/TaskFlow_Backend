import { Router } from "express";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goal";
import { authMiddelware } from "../middelwares/auth";
const router = Router();

router.use(authMiddelware)
/**
 * @openapi
 * /goals:
 *   get:
 *     tags: [Goals]
 *     summary: Listar metas (dummy)
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
router.get("/", getGoals);
/**
 * @openapi
 * /goals:
 *   post:
 *     tags: [Goals]
 *     summary: Crear meta (dummy)
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
 *     summary: Actualizar meta (dummy)
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
 *         description: Actualizada
 */
router.put("/:id", updateGoal);
/**
 * @openapi
 * /goals/{id}:
 *   delete:
 *     tags: [Goals]
 *     summary: Eliminar meta (dummy)
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
 */
router.delete("/:id", deleteGoal);

export default router;
