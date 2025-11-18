import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

// Validación de Tipo de Archivo (MimeType / Extensión)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  
    // Lista de tipos de archivo permitidos
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    // Si es válido, continuamos
    cb(null, true);
  } else {
    // Si no es válido, rechazamos el archivo
    const error = new Error('Error: Tipo de archivo no soportado. Solo se permiten imágenes (jpeg, png, gif) o PDF.');
    cb(error);
  }
};


// unimos la configuracion y exportamos
export const upload = multer({
    storage: storage, // Usamos el almacenamiento en memoria
    limits: {
      fileSize: 1024 * 1024 * 5 // Límite de 5MB (1024 * 1024 = 1MB)
    },
    fileFilter: fileFilter // Usamos nuestra función de validación
  });


// NOTA: la validacion de tamaño se va a hacer en el controller con sharp