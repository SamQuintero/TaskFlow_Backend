import { Router, json } from "express";
import { getUsers } from "../controllers/users";
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
router.get('',authMiddelware ,getUsers);

export default router;