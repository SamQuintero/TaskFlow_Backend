# TaskFlow Backend (API + Vistas HBS)

## Descripción
Backend en TypeScript/Express para el proyecto “TaskFlow”. Incluye:
- API REST con autenticación JWT (login/signup), CRUD de usuarios, tareas y metas
- Endpoints de calendario (dummy)
- Subida/descarga de archivos a AWS S3
- Documentación Swagger
- Vistas SSR con Handlebars (HBS) que replican el estilo de TaskFlowUI (layouts, navegación, guards y consumo de API con Bearer)
- Tiempo real con Socket.IO (autenticación por JWT en el handshake)
- Validación de entrada con Zod
- Pruebas automatizadas con Jest + ts-jest + Supertest

Importante: la mayoría de las rutas de la API están protegidas con Authorization: Bearer <JWT>. Primero debes registrarte e iniciar sesión para obtener un token.

## Requisitos
- Node.js 18+ (recomendado)
- npm 9+
- Conectividad a:
  - MongoDB (MONGO_URL)
  - AWS S3 (credenciales y bucket)
- Archivo `.env` válido

## Variables de entorno
La app arranca el servidor tras conectar a MongoDB. El módulo S3 valida sus variables al cargar. El flujo OAuth de Google y el mailer también requieren variables.

Core:
- PORT: Puerto del servidor (por defecto 3000)
- MONGO_URL: URI de conexión a MongoDB
- JWT_SECRET: Secreto para firmar/validar JWT

AWS S3:
- S3_ACCESS_KEY: Access Key de AWS
- S3_SECRET_KEY: Secret Key de AWS
- S3_REGION: Región (ej. us-east-2)
- S3_BUCKET_NAME: Nombre del bucket

Google OAuth:
- GOOGLE_ID: Client ID
- GOOGLE_SECRET: Client Secret
- GOOGLE_CB_URL: Callback URL (ej. http://localhost:3000/auth/google/callback)

Mailer (Gmail):
- GMAIL_ADRESS: Dirección de Gmail emisora
- GMAIL_PASSWORD: Password o App Password de Gmail

Otros:
- BACKEND_URL: Base URL pública del backend (para construir links en emails)

Ejemplo `.env`:
```
PORT=3000
MONGO_URL="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
JWT_SECRET="mi_super_secreto"

S3_ACCESS_KEY="AKIA..."
S3_SECRET_KEY="..."
S3_REGION="us-east-2"
S3_BUCKET_NAME="taskflow-archivos-bucket"

GOOGLE_ID="..."
GOOGLE_SECRET="..."
GOOGLE_CB_URL="http://localhost:3000/auth/google/callback"

GMAIL_ADRESS="mi-cuenta@gmail.com"
GMAIL_PASSWORD="app-password"

BACKEND_URL="http://localhost:3000"
```

## Instalación
1) Clonar el repo y entrar al directorio
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
Este script observa cambios en `src` y `src/app/views` (extensiones ts,json,hbs) para recargar el servidor y (re)registrar parciales HBS automáticamente.

- Producción (compilado a `dist`):
```
npm run build
npm start
```

Mensajes esperados al iniciar:
- “Ya se conecto!” (Mongo conectado)
- “HTTP + Socket.IO server listening on port <PORT>”
- “HBS views: …/src/app/views”
- “HBS partials: …/src/app/views/partials”
- “HBS manual partials registered” (fallback de registro de parciales)

Base URL local por defecto: `http://localhost:3000`

- Health: `GET /` → "api works"
- Swagger UI: `GET /swagger`

## UI SSR (Handlebars)
Layout con Navbar/Sidebar/Footer, guards de sesión/roles en cliente y consumo de la API con fetch nativo.

Rutas SSR disponibles:
- Públicas:
  - `GET /login` → Login (guarda JWT en localStorage y redirige a /app/dashboard)
  - `GET /register` → Registro (crea usuario, login automático y redirige)
- Autenticadas (requieren JWT en localStorage):
  - `GET /app/dashboard` → Dashboard
  - `GET /app/users` → Administración/Usuarios
  - `GET /app/tasks` → Tareas (CRUD vía /tasks)
  - `GET /app/goals` → Metas (CRUD vía /goals)
  - `GET /app/calendar` → Calendario (dummy)
  - `GET /app/files` → Archivos (uploader a S3)
- Vista simple adicional para archivos:
  - `GET /files/view` → Página HBS sencilla para subir un archivo (útil para pruebas rápidas)

Guard de cliente y fetch autenticado:
- `src/app/views/partials/app-guard-scripts.hbs`:
  - Protege todas las rutas `/app/*`: si no hay token en localStorage → redirige a `/login?returnTo=...`
  - Decodifica el JWT para mostrar el rol en UI
  - Expone `window.apiFetch(url, options)` que adjunta `Authorization: Bearer <token>` automáticamente

## Autenticación y Autorización (API)
- Login/Signup generan y usan JWT (firmado con `JWT_SECRET`).
- Rutas protegidas exigen header:
  ```
  Authorization: Bearer <tu_token>
  ```
- Control de roles (middleware):
  - `authorizeRoles('admin')` requerido en:
    - Users: crear (`POST /users`) y eliminar (`DELETE /users/:id`)
    - Tasks: eliminar (`DELETE /tasks/:id`)
    - Goals: eliminar (`DELETE /goals/:id`)

## Endpoints principales

### Auth (público)
- `POST /auth/signup` — `{ name, email, password, role? (user|admin) }`
- `POST /auth/login` — `{ email, password }` → `{ token, ... }`
- `GET /auth/login/google` — OAuth inicio
- `GET /auth/google/callback` — OAuth callback
- `GET /auth/verify?token=...` — Verificación por correo

### Users (protegido)
- `GET /users`
- `GET /users/:id`
- `POST /users` (admin)
- `PUT /users/:id`
- `DELETE /users/:id` (admin)

### Tasks (protegido)
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id` (admin)

### Goals (protegido)
- `GET /goals`
- `GET /goals/:id`
- `POST /goals`
- `PUT /goals/:id`
- `DELETE /goals/:id` (admin)

### Calendar (protegido, dummy)
- `POST /calendar/sync`
- `GET /calendar/events`

### Files (AWS S3)
- `GET /files/view` — vista HBS simple (pública) para probar upload
- `POST /files/upload` (protegido)
  - Form-data: key `file` (jpg, jpeg, png, gif, pdf; máx 5MB)
  - Sube a S3 y guarda metadatos en Mongo
- `GET /files/:key` (protegido)
  - Devuelve contenido de S3 por streaming (owner o admin)

## Validación de entrada (Zod)
Se añadió validación sistemática de `req.body` usando Zod.

- Middleware: `src/app/middelwares/validate.ts`
  - `validateBody(schema)` valida el cuerpo y responde 400 con:
    ```
    { "message": "Validation failed", "errors": [ { path, message, code } ] }
    ```
- Esquemas: `src/app/validation/schemas.ts`
  - Auth: `loginSchema`, `signupSchema`
  - Users: `userCreateSchema`, `userUpdateSchema`
  - Tasks: `taskCreateSchema`, `taskUpdateSchema`
  - Goals: `goalCreateSchema`, `goalUpdateSchema`
- Rutas con validación:
  - Auth: `POST /auth/login`, `POST /auth/signup`
  - Users: `POST /users` (admin), `PUT /users/:id`
  - Tasks: `POST /tasks`, `PUT /tasks/:id`
  - Goals: `POST /goals`, `PUT /goals/:id`

## Pruebas automatizadas
Se incorporó una suite de pruebas con Jest + ts-jest + Supertest.

- Configuración:
  - `jest.config.ts` (preset `ts-jest`, `tests/setup-env.ts` como setup)
  - `tsconfig.jest.json` (CJS para Jest)
  - `src/app/app.ts` expone `createApp()` para testear sin levantar servidor
  - En entorno de test no se inicializa OAuth de Google ni el mailer real
    - `src/app/models/mailer.ts` usa un transporter “dummy” si `NODE_ENV=test`
- Tests incluidos (en `tests/`):
  - `setup-env.ts`: define `NODE_ENV=test`, `JWT_SECRET` y silencia logs ruidosos
  - `health.test.ts`: `GET /` responde "api works"
  - `auth.validation.test.ts`: errores 400 por cuerpo inválido en login/signup
  - `tasks.validation.test.ts`: errores 400 por cuerpo inválido en POST/PUT /tasks (con JWT válido)
  - `goals.validation.test.ts`: errores 400 por cuerpo inválido en POST/PUT /goals (con JWT válido)
  - `users.authz.validation.test.ts`:
    - `GET /users` → 401 sin Authorization
    - `POST /users` → 403 si rol=user
    - `POST/PUT /users` → 400 por body inválido (aún siendo admin)
    - `DELETE /users/:id` → 403 si rol=user
- Ejecución:
  - `npm test`
  - `npm run test:watch`
  - `npm run test:ci`
- Estado actual: 5 suites, 15 pruebas en total, todas pasan.

Notas:
- Las pruebas usan JWTs firmados en memoria (mock del usuario y rol).
- No se ejercen operaciones reales de DB ni S3; foco en validación y autorización.
- Si deseas cobertura: agrega `"test:coverage": "jest --coverage"` y ejecuta `npm run test:coverage`.

## Tiempo real (WebSockets)
Integración con Socket.IO en el mismo servidor HTTP, con autenticación JWT en handshake. Se emiten eventos ante operaciones REST (tasks/goals/files) y hay una vista de prueba:

- Vista demo: `GET /socket-demo`
  - Pega tu JWT y conéctate
  - Envía “ping” y recibe “pong”
  - Observa eventos `task:*`, `goal:*`, `file:*` al usar los endpoints

Formas de enviar JWT al conectar:
- Header: `Authorization: Bearer <TOKEN>`
- query `?token=<TOKEN>` o `auth: { token }` en el cliente

## Troubleshooting
- “The partial X could not be found” (HBS):
  - Verifica archivos en `src/app/views/partials` y nombres usados en `{{> X}}`
  - nodemon recarga `.hbs` y (re)registra parciales automáticamente en dev
- Google OAuth y SSR:
  - El callback redirige a `/app/dashboard`. Para persistir token en cliente (localStorage) puedes adaptar el flujo para redirigir con `?token=...` o setear cookie httpOnly en el backend.
- Swagger:
  - UI en `/swagger`. Asegúrate de que `servers` en `swagger.config.ts` apunte al puerto correcto (`PORT`).
- AWS SDK v2:
  - El proyecto utiliza `aws-sdk` v2. Se recomienda migrar a `@aws-sdk/client-s3` v3 (ya está instalada la dependencia v3).
- Jest/ESM:
  - El mailer usa un stub en entorno de test para evitar issues con paquetes ESM en Jest.

## Tecnologías
- Node.js + Express 5 (TypeScript)
- MongoDB + Mongoose
- JWT (bcrypt para hashing)
- Multer + AWS S3 (aws-sdk v2)
- Swagger (swagger-jsdoc + swagger-ui-express)
- Handlebars (hbs) para vistas SSR
- Socket.IO
- Zod (validación)
- Jest + ts-jest + Supertest (pruebas)

## Cómo probar rápidamente (API)
1) Registrar usuario (opcionalmente admin):
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

3) UI SSR:
- Ir a `http://localhost:3000/login` → iniciar sesión → redirige a `/app/dashboard`
- Navegar a `/app/users`, `/app/tasks`, `/app/goals`, `/app/calendar`, `/app/files`
- Si no hay token y visitas `/app/*`, el guard te enviará a `/login?returnTo=/app/...`

4) Swagger:
- `http://localhost:3000/swagger`
- “Authorize” → pegar el token (sin “Bearer ”)

5) curl de ejemplo (API):
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
  -H "Authorization: Bearer <TOKEN)" \
  -F "file=@/ruta/a/archivo.png"
