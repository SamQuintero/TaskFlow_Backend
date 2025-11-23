import { Router, json } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/users";
import { authMiddleware, authorizeRoles} from "../middelwares/auth";

const router = Router();

router.use(authMiddleware)
/**
 * @openapi
 * /user:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios 
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
 *                   name: "Alice"
 *                   email: "alice@example.com"
 *                 - id: "6742a1c2f0a1b2c3d4e5f6a2"
 *                   name: "Bob"
 *                   email: "bob@example.com"
 */
router.get("", getUsers);
/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID 
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id: "6742a1c2f0a1b2c3d4e5f6a1"
 *               name: "Alice"
 *               email: "alice@example.com"
 */
router.get("/:id", getUser);
/**
 * @openapi
 * /user:
 *   post:
 *     tags: [Users]
 *     summary: Crear usuario 
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
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *           example:
 *             name: "Carlos"
 *             email: "carlos@example.com"
 *             password: "secret"
 *     responses:
 *       201:
 *         description: Creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id: "6742a1c2f0a1b2c3d4e5f6b1"
 *               name: "Carlos"
 *               email: "carlos@example.com"
 */
router.post("", authorizeRoles('admin'), createUser);
/**
 * @openapi
 * /user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario
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
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *           example:
 *             name: "Carlos Editado"
 *             email: "carlos.edit@example.com"
 *     responses:
 *       200:
 *         description: Actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               id: "6742a1c2f0a1b2c3d4e5f6b1"
 *               name: "Carlos Editado"
 *               email: "carlos.edit@example.com"
 */
router.put("/:id", updateUser);
/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario 
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
 *         description: Eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Usuario eliminado correctamente"
 */
router.delete("/:id",authorizeRoles('admin'), deleteUser);

export default router;
