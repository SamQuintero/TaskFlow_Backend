import { Router } from "express";
import { authMiddleware } from "../middelwares/auth.js";
import { upload } from "../middelwares/upload.js"; 
import { uploadFile, getFile } from "../controllers/file.js";
import { getFileStreamFromS3 } from "../services/s3.js"; 

const router = Router();

router.get("/view", (req, res) => {
    res.render("upload"); // Buscará un archivo 'upload.hbs'
  });

// Ruta pública para avatares
router.get("/avatar/:userId/:filename", async (req, res) => {
  const { userId, filename } = req.params;
  const key = `avatars/${userId}/${filename}`;
  console.log('Getting avatar:', key);
  
  try {
    const readStream = getFileStreamFromS3(key);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error al obtener avatar:", error);
    res.status(404).json({ message: "Avatar no encontrado" });
  }
});

router.use(authMiddleware)


/**
 * @openapi
 * /files/upload:
 *   post:
 *     tags: [Files]
 *     summary: Sube un archivo a S3
 *     description: >
 *       Sube un archivo (max 5MB, tipos: jpg, png, pdf). 
 *       Requiere Bearer Token.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Archivo subido con éxito"
 *               s3Key: "uploads/2025/11/imagen.png"
 *               location: "https://s3.amazonaws.com/mi-bucket/uploads/2025/11/imagen.png"
 *               dbId: "6742a1c2f0a1b2c3d4e5f6aa"
 *       400:
 *         description: Error de validación (tipo, tamaño) o no se envió archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "No se envió ningún archivo"
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
 *         example: "uploads/2025/11/imagen.png"
 *         description: La S3 Key del archivo
 *     responses:
 *       200:
 *         description: Archivo obtenido
 *       404:
 *         description: Archivo no encontrado o sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Archivo no encontrado"
 */
router.get("/:key", getFile);

export default router;
