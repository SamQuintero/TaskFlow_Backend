# TaskFlow Backend (API)

## Descripción
API en TypeScript/Express para el proyecto “TaskFlow”. Incluye autenticación con JWT, CRUD de usuarios/tareas/metas, endpoints de calendario (dummy), subida y descarga de archivos a AWS S3, y documentación interactiva con Swagger.

Importante: la mayoría de las rutas están protegidas con Authorization: Bearer <JWT>. Primero debes registrarte e iniciar sesión para obtener un token.

## Requisitos
- Node.js 18+ (recomendado)
- npm 9+
- Conectividad a:
  - MongoDB Atlas (MONGO_URL)
  - AWS S3 (credenciales y bucket)
- Archivo `.env` válido

## Variables de entorno
Se requieren las siguientes variables. La app arranca el servidor únicamente si logra conectar a MongoDB; además, el módulo S3 valida sus variables en el arranque y lanza error si faltan.

- PORT: Puerto de la API (por defecto 3000 si no se define)
- MONGO_URL: URI de conexión a MongoDB Atlas
- JWT_SECRET: Secreto para firmar/validar JWT
- S3_ACCESS_KEY: Access Key de AWS
- S3_SECRET_KEY: Secret Key de AWS
- S3_REGION: Región (ej. us-east-2)
- S3_BUCKET_NAME: Nombre del bucket

Ejemplo `.env` (no uses credenciales reales en el repo):
```
PORT=3000
MONGO_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
JWT_SECRET="mi_super_secreto"
S3_ACCESS_KEY="AKIA..."
S3_SECRET_KEY="..."
S3_REGION="us-east-2"
S3_BUCKET_NAME="taskflow-archivos-bucket"
```

## Instalación
1) Clonar el repositorio
```
git clone <URL_DEL_REPO>
cd TaskFlow_Backend
```

2) Crear `.env` con las variables anteriores

3) Instalar dependencias
```
npm install
```

## Ejecución
- Desarrollo (TypeScript sin compilar):
```
npm run dev
```
Si tu entorno no corre `.ts` directamente, usa:
```
npx ts-node src/index.ts
```

- Producción (compilado a `dist`):
```
npm run build
npm start
```

Mensajes esperados al iniciar:
- “Ya se conecto!” (Mongo conectado)
- “App is running in port <PORT>”

Base URL local por defecto: `http://localhost:3000`

- Health: `GET /` → "api works"
- Swagger UI: `GET /swagger`

## Autenticación y Autorización
- Login/Signup generan y usan JWT (firmado con `JWT_SECRET`).
- Rutas protegidas exigen header:
  ```
  Authorization: Bearer <tu_token>
  ```
- Control de roles:
  - `authorizeRoles('admin')` requerido en:
    - Users: crear (`POST /users`) y eliminar (`DELETE /users/:id`)
    - Tasks: eliminar (`DELETE /tasks/:id`)
    - Goals: eliminar (`DELETE /goals/:id`)

## Endpoints

### Auth (público)
- `POST /auth/signup`
  - Body JSON: `{ name, email, password, role? (user|admin) }`
- `POST /auth/login`
  - Body JSON: `{ email, password }`
  - Respuesta: `{ token, ... }` (usa este token para el resto de endpoints)

### Users (protegido)
- `GET /users` — listar
- `GET /users/:id` — obtener por id
- `POST /users` — crear (admin)
- `PUT /users/:id` — actualizar
- `DELETE /users/:id` — eliminar (admin)

### Tasks (protegido)
- `GET /tasks` — listar
- `GET /tasks/:id` — obtener por id
- `POST /tasks` — crear
- `PUT /tasks/:id` — actualizar
- `DELETE /tasks/:id` — eliminar (admin)

### Goals (protegido)
- `GET /goals` — listar
- `GET /goals/:id` — obtener por id
- `POST /goals` — crear
- `PUT /goals/:id` — actualizar
- `DELETE /goals/:id` — eliminar (admin)

### Calendar (protegido, dummy)
- `POST /calendar/sync`
- `GET /calendar/events`

### Files (AWS S3) 
- `GET /files/view` — vista HBS simple (pública) para probar upload
- `POST /files/upload` (protegido)
  - Form-data: key `file` (tipo `File`), soporta: jpg, jpeg, png, gif, pdf; máx 5MB
  - Sube a S3 y guarda metadatos en Mongo (dueño = usuario autenticado)
  - Respuesta incluye `s3Key` y `location`
- `GET /files/:key` (protegido)
  - Devuelve el contenido desde S3 por streaming
  - Solo dueño o rol `admin` pueden acceder

## Cómo probar rápidamente

1) Registrar usuario (puede ser admin):
```
POST http://localhost:3000/auth/signup
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "secret",
  "role": "admin"
}
```

2) Login para obtener token:
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "secret"
}
```
Guarda el valor `token` de la respuesta.

3) Autorizar en Swagger:
- Ir a `http://localhost:3000/swagger`
- Click en “Authorize”
- Pegar el token (sin el prefijo “Bearer ”). Swagger aplica el esquema Bearer.

4) Probar endpoints protegidos (Swagger o Postman):
- Agregar header `Authorization: Bearer <token>` en cada request

Ejemplos (curl):
- Listar usuarios:
```
curl "http://localhost:3000/users" -H "Authorization: Bearer <TOKEN>"
```
- Crear tarea:
```
curl -X POST "http://localhost:3000/tasks" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Tarea A","priority":"HIGH","estimateHours":4}'
```
- Subir archivo a S3:
```
curl -X POST "http://localhost:3000/files/upload" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/ruta/a/archivo.png"
```
- Descargar archivo por key (si eres owner o admin):
```
curl "http://localhost:3000/files/<S3_KEY>" \
  -H "Authorization: Bearer <TOKEN>" \
  -o salida.bin
```

## Notas y troubleshooting
- Si el servidor “no arranca”: valida `MONGO_URL` y tu red; el `app.listen` ocurre solo tras conectar a MongoDB.
- S3: si faltan variables o el bucket/credenciales son inválidas, el módulo lanzará error al cargar.
- CORS: no está configurado explícitamente; para pruebas locales usa Postman o Swagger.
- Puerto: por defecto `3000` (o el definido en `.env`).
- Express 5 + TypeScript: si `npm run dev` no levanta `.ts` directamente, usa `npx ts-node src/index.ts` o corre en modo producción tras compilar.

## Tecnologías
- Node.js + Express 5 (TypeScript)
- MongoDB + Mongoose
- JWT (bcrypt para hashing)
- Multer + AWS S3 (aws-sdk v2)
- Swagger (swagger-jsdoc + swagger-ui-express)
- dotenv, hbs
