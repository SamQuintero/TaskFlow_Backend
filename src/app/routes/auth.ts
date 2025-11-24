import { Router } from "express";
import { login, signup} from "../controllers/auth";
import { authMiddleware } from "../middelwares/auth";

const router = Router();


/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *             example:
 *               email: "user@example.com"
 *               password: "secret"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post('/login', login);
/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Registro 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               role: { type: string, enum: [user, admin] }
 *             example:
 *               name: "Juan Pérez"
 *               email: "juan@example.com"
 *               password: "secret"
 *               role: "user"
 *     responses:
 *       200:
 *         description: OK (sin cuerpo)
 */
router.post('/signup', signup);

export default router;
