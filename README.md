# TaskFlow Backend (API Dummy)

## Descripción  
API dummy en TypeScript/Express para el proyecto integrador “TaskFlow”. Proporciona endpoints CRUD mínimos para usuarios, tareas, metas y calendario, con respuestas de prueba (dummy). La documentación interactiva está disponible con Swagger.  

## Requisitos  
- Node.js 18+ (recomendado)  
- npm 9+ o yarn  
- Variables de entorno (.env)  

## Instalación  
1. Clonar el repositorio  
   git clone <URL_DE_TU_REPO>  
   cd TaskFlow_Backend  

2. Crear archivo de entorno  
   cp .env.example .env  
   Edita .env si quieres cambiar el puerto.  

3. Instalar dependencias  
   npm install  

## Ejecución  
- Desarrollo (TS sin compilar)  
  npm run dev  
  Se levanta en el puerto definido en .env (por defecto 3001).  

- Producción (compilado a dist)  
  npm run build  
  npm start  

## Variables de entorno  
- PORT: Puerto de escucha de la API (por defecto 3001)  

Ejemplo .env:  
PORT=3001  

## Estructura del proyecto  
dist/ (build compilado)  
node_modules/  
src/  
  app/  
    controllers/  
      auth.ts  
      calendar.ts  
      goal.ts  
      task.ts  
      users.ts  
    interfaces/  
      user.ts  
    middelwares/ (nota: nombre de carpeta actual)  
      auth.ts  
    models/  
      auth.ts  
      calendar.ts  
      goal.ts  
      index.ts  
      task.ts  
      users.ts  
    routes/  
      auth.ts  
      calendar.ts  
      goal.ts  
      index.ts  
      task.ts  
      users.ts  
  index.ts (punto de entrada de la app)  
.gitignore  
package.json  
package-lock.json  
swagger.config.ts  
tsconfig.json  

## Base URL y salud  
- Base URL local: http://localhost:PORT  
- Health (simple): GET / → "api works"  
- Swagger UI: GET /swagger  

## Autenticación (dummy)  
- Middleware: src/app/middelwares/auth.ts  
- Autorización requerida en la mayoría de rutas (incluida /auth actualmente).  
- Proveer token en query string: ?token=12345  
  Ejemplo: GET /users?token=12345  

## Endpoints principales  
Nota: Respuestas dummy (no hay persistencia). Todas las rutas requieren ?token=12345 (incluyendo /auth).  

### Auth  
POST /auth/login?token=12345  
Body: { email, password } (cualquier payload)  
Respuesta: { token: "jasfhj1234hk989778" }  

POST /auth/signup?token=12345  
Body: { name, email, password }  
Respuesta: 200 OK sin cuerpo  

### Users  
GET /user?token=12345  
Respuesta: { data: [] }  

### Tasks  
GET /tasks?token=12345  
POST /tasks?token=12345  
PUT /tasks/:id?token=12345  
DELETE /tasks/:id?token=12345  

### Goals  
GET /goals?token=12345  
POST /goals?token=12345  
PUT /goals/:id?token=12345  
DELETE /goals/:id?token=12345  

### Calendar  
POST /calendar/sync?token=12345  
GET /calendar/events?token=12345  

## Ejemplos con curl  
- Login (dummy)  
  curl -X POST "http://localhost:3001/auth/login?token=12345" -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"secret"}'  

- Listar tareas (dummy)  
  curl "http://localhost:3001/tasks?token=12345"  

## Swagger  
- UI: http://localhost:3001/swagger  
- Generación: swagger-jsdoc usando swagger.config.ts  
- Los endpoints son interactivos desde Swagger UI.  

## Scripts disponibles  
- npm run dev → Desarrollo (ts-node/nodemon)  
- npm run build → Compilar a dist  
- npm start → Ejecutar dist/index.js  

## Tecnologías  
- Node.js + Express (TypeScript)  
- Swagger (swagger-jsdoc + swagger-ui-express)  
- dotenv para variables de entorno  

## Notas para la entrega  
- Documentación API: disponible en /swagger  
- Repositorio: adjunta la URL en la plataforma del curso. Si es privado, invita a fsevilla@gmail.com  
- Este backend es una versión dummy (controladores con respuestas simuladas) para cumplir la fase de diseño y documentación.  

## Créditos  
Proyecto académico “TaskFlow” – Backend API Dummy.
