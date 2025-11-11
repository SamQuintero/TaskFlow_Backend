import { Router, json } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/users";
import { authMiddelware } from "../middelwares/auth";

const router = Router();


router.use(json());

router.use(authMiddelware)
/**
 * @openapi
 * /user:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios (dummy)
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
 *                 data:
 *                   type: array
 *                   items: { type: object }
 */
router.get("", getUsers);
/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID (dummy)
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
 *         description: OK
 */
router.get("/:id", getUser);
/**
 * @openapi
 * /user:
 *   post:
 *     tags: [Users]
 *     summary: Crear usuario (dummy)
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
 *         description: Creado
 */
router.post("", createUser);
/**
 * @openapi
 * /user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario (dummy)
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
 *         description: Actualizado
 */
router.put("/:id", updateUser);
/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario (dummy)
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
 *         description: Eliminado
 */
router.delete("/:id", deleteUser);

export default router;
