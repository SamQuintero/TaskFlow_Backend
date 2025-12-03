import AWS from 'aws-sdk';
import { File } from 'buffer';

const { S3 } = AWS;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
const bucketName = process.env.S3_BUCKET_NAME || 'taskflow-archivos-bucket';

// Verificación de que las variables existan
if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("Faltan variables de entorno de AWS S3");
}

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  });

// funcion para subir un archivo a S3
export function uploadFileToS3(file: Express.Multer.File) {
    // 'file.buffer' contiene los datos del archivo en la RAM
    
    const uploadParams = {
      Bucket: bucketName,
      Body: file.buffer, 
      Key: `${Date.now()}-${file.originalname}` // Genera un nombre de archivo único
    };
  
    // .promise() hace que la función devuelva una promesa,
    // permitiéndonos usar 'await' en el controlador
    return s3.upload(uploadParams).promise();
  }

// Función para descargar un archivo de S3 
export function getFileStreamFromS3(fileKey: string) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    };
  
    
    return s3.getObject(downloadParams).createReadStream();
  }
