import { Router, json } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser, uploadAvatar } from "../controllers/users.js";
import { authMiddleware, authorizeRoles} from "../middelwares/auth.js";
import { validateBody } from "../middelwares/validate.js";
import { userCreateSchema, userUpdateSchema } from "../validation/schemas.js";
import { upload } from "../middelwares/upload.js";

const router = Router();

router.use(authMiddleware)
/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios 
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
 *                   name: "Alice"
 *                   email: "alice@example.com"
 *                 - id: "6742a1c2f0a1b2c3d4e5f6a2"
 *                   name: "Bob"
 *                   email: "bob@example.com"
 */
router.get("", getUsers);
/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID 
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
 *             example:
 *               id: "6742a1c2f0a1b2c3d4e5f6a1"
 *               name: "Alice"
 *               email: "alice@example.com"
 */
router.get("/:id", getUser);
/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Crear usuario 
 *     security:
 *       - bearerAuth: []
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
router.post("", authorizeRoles('admin'), validateBody(userCreateSchema), createUser);
/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar usuario
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
router.put("/:id", validateBody(userUpdateSchema), updateUser);
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar usuario 
 *     security:
 *       - bearerAuth: []
 *     parameters:
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

/**
 * @openapi
 * /users/{id}/avatar:
 *   post:
 *     tags: [Users]
 *     summary: Subir foto de perfil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar actualizado
 */
router.post("/:id/avatar", upload.single('file'), uploadAvatar);

export default router;
