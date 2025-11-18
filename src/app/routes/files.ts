import { Router } from "express";
import { authMiddleware } from "../middelwares/auth";
import { upload } from "../middelwares/upload"; 
import { uploadFile, getFile } from "../controllers/file"; 

const router = Router();

router.use(authMiddleware)


/**
 * @openapi
 * /files/upload:
 *   post:
 *     tags: [Files]
 *     summary: Sube un archivo a S3
 *     description: Sube un archivo (max 5MB, tipos: jpg, png, pdf). Requiere Bearer Token.
 *     security:
 *       - bearerAuth: []
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
 *       201:
 *         description: Archivo subido con éxito
 *       400:
 *         description: Error de validación (tipo, tamaño) o no se envió archivo
 */
router.post("/upload", upload.single('file'), uploadFile);

/**
 * @openapi
 * /files/{key}:
 *   get:
 *     tags: [Files]
 *     summary: Descarga o visualiza un archivo de S3
 *     description: Obtiene un archivo usando su S3 Key. Requiere Bearer Token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string }
 *         description: La S3 Key del archivo
 *     responses:
 *       200:
 *         description: Archivo obtenido
 *       404:
 *         description: Archivo no encontrado o sin permisos
 */
router.get("/:key", getFile);

export default router;