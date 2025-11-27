# TaskFlow Backend (API + Vistas HBS)

## Descripción
Backend en TypeScript/Express para el proyecto “TaskFlow”. Incluye:
- API REST con autenticación JWT (login/signup), CRUD de usuarios, tareas y metas
- Endpoints de calendario (dummy)
- Subida/descarga de archivos a AWS S3
- Documentación Swagger
- Vistas SSR con Handlebars (HBS) que replican el estilo de TaskFlowUI (layouts, navegación, guards y consumo de API con Bearer)

Importante: la mayoría de las rutas de la API están protegidas con Authorization: Bearer <JWT>. Primero debes registrarte e iniciar sesión para obtener un token.

## Requisitos
- Node.js 18+ (recomendado)
- npm 9+
- Conectividad a:
  - MongoDB (MONGO_URL)
  - AWS S3 (credenciales y bucket)
- Archivo `.env` válido

## Variables de entorno
La app arranca el servidor tras conectar a MongoDB. El módulo S3 valida sus variables al cargar.

- PORT: Puerto del servidor (por defecto 3000)
- MONGO_URL: URI de conexión a MongoDB
- JWT_SECRET: Secreto para firmar/validar JWT
- S3_ACCESS_KEY: Access Key de AWS
- S3_SECRET_KEY: Secret Key de AWS
- S3_REGION: Región (ej. us-east-2)
- S3_BUCKET_NAME: Nombre del bucket

Ejemplo `.env`:
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

## UI SSR (Handlebars)  (layout con Navbar/Sidebar/Footer, guards de sesión/roles en cliente y consumo de la API con fetch nativo).

Rutas SSR disponibles:
- Públicas:
  - `GET /login` → Login (guarda JWT en localStorage y redirige a /app/dashboard)
  - `GET /register` → Registro (crea usuario, login automático y redirige)
- Autenticadas (requieren JWT en localStorage):
  - `GET /app/dashboard` → Dashboard (resumen mock, accesos rápidos)
  - `GET /app/users` → Administración/Usuarios
    - Lista usuarios (GET /users)
    - Cambiar rol (PUT /users/:id)
    - Crear usuario (POST /users) y Eliminar (DELETE /users/:id) — UI visible solo si rol=admin (además de middleware del servidor)
  - `GET /app/tasks` → Tareas (CRUD vía /tasks)
    - Listado (GET /tasks)
    - Crear (POST /tasks)
    - Editar (PUT /tasks/:id)
    - Eliminar (DELETE /tasks/:id) — solo admin (UI + server)
  - `GET /app/goals` → Metas (CRUD vía /goals)
  - `GET /app/calendar` → Calendario (dummy)
    - Eventos (GET /calendar/events)
    - “Sincronizar” (POST /calendar/sync)
  - `GET /app/files` → Archivos (uploader a S3)
    - Subir (POST /files/upload) con FormData
- Vista simple adicional para archivos:
  - `GET /files/view` → Página HBS sencilla para subir un archivo (útil para pruebas rápidas)

Estructura de vistas:
- `src/app/views/`:
  - Páginas: `login.hbs`, `register.hbs`, `app-dashboard.hbs`, `app-users.hbs`, `app-tasks.hbs`, `app-goals.hbs`, `app-calendar.hbs`, `app-files.hbs`, `upload.hbs` (simple)
  - Parciales: `partials/app-navbar.hbs`, `partials/app-sidebar.hbs`, `partials/app-footer.hbs`, `partials/app-guard-scripts.hbs`

Guard de cliente y fetch autenticado:
- `app-guard-scripts.hbs`:
  - Protege todas las rutas `/app/*`: si no hay token en localStorage → redirige a `/login?returnTo=...`
  - Decodifica el JWT para mostrar el rol en UI (badge de Navbar, texto en Sidebar y visibilidad del link de Admin)
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

## Cómo probar rápidamente

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
```

## Tiempo real (WebSockets)
Integración con Socket.IO en el mismo servidor HTTP, con autenticación JWT en handshake. Se emiten eventos ante operaciones REST (tasks/goals/files) y hay una vista de prueba:

- Vista demo: `GET /socket-demo`
  - Pega tu JWT y conéctate
  - Envía “ping” y recibe “pong”
  - Observa eventos `task:*`, `goal:*`, `file:*` al usar los endpoints

Formas de enviar JWT al conectar:
- Header: `Authorization: Bearer <TOKEN>`
- query `?token=<TOKEN>` o `auth: { token }` en el cliente

## Troubleshooting (HBS/Partials)
- “The partial X could not be found”:
  - Verifica que el archivo exista en `src/app/views/partials` y que el nombre coincida con el usado en `{{> X}}`
  - En desarrollo, nodemon recarga .hbs y (re)registra parciales automáticamente
  - El servidor imprime rutas de vistas/partials y registra un fallback manual de parciales en `src/index.ts`

## Notas y seguridad
- JWT en localStorage (UI SSR) por simplicidad. En producción, considerar cookies httpOnly.
- Endpoints protegidos validan JWT (Authorization: Bearer).
- Agregar rate limiting/logs si necesitas endurecer el servicio.
- CORS no está configurado explícitamente (Swagger/Postman locales funcionan sin proxy).
- AWS SDK v2 muestra aviso de mantenimiento; recomendable migrar a v3 cuando sea posible.

## Tecnologías
- Node.js + Express 5 (TypeScript)
- MongoDB + Mongoose
- JWT (bcrypt para hashing)
- Multer + AWS S3 (aws-sdk v2)
- Swagger (swagger-jsdoc + swagger-ui-express)
- Handlebars (hbs) para vistas SSR
- Socket.IO
