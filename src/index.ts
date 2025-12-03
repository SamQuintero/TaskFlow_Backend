import express, { Request, Response } from "express";
import dotenv from "dotenv"
import { connectDB } from "./database/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import hbs from "hbs";
dotenv.config()
import swaggerJsDoc from "swagger-jsdoc"
import { setup, serve} from "swagger-ui-express"
import * as SwaggerConfigModule from "./../swagger.config.js";
import passport from "passport";
import { initGoogleAuth } from "./app/middelwares/googleAuth.js";


import routes from "./app/routes/index.js";
import http from "http";
import { initRealtime } from "./realtime/index.js";

const swaggerOptions = SwaggerConfigModule.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000; 
const dbUrl = process.env.MONGO_URL;
const app = express();

const viewsDir = path.join(__dirname, "app/views");
const partialsDir = path.join(__dirname, "app/views/partials");

app.engine("hbs", (hbs as any).__express);
app.set("view engine", "hbs");
app.set("views", viewsDir);
hbs.registerPartials(partialsDir);

console.log("HBS views:", viewsDir);
console.log("HBS partials:", partialsDir);

initGoogleAuth();

app.use(passport.initialize());

// Manual partials registration as a fallback
try {
  const partialNames = ["app-navbar", "app-sidebar", "app-footer", "app-guard-scripts"];
  for (const name of partialNames) {
    const filePath = path.join(partialsDir, name + ".hbs");
    if (fs.existsSync(filePath)) {
      const source = fs.readFileSync(filePath, "utf8");
      hbs.registerPartial(name, source);
    }
  }
  console.log("HBS manual partials registered");
} catch (e) {
  console.warn("HBS manual partials registration failed:", e);
}

app.use(express.json());

const server = http.createServer(app);
initRealtime(server);


app.use(routes);


app.get('', (req: Request, res: Response) =>{
    res.send('api works');
})

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', serve, setup(swaggerDocs));

connectDB().then(res => {
    console.log('Ya se conecto!');
    server.listen(port, () => {
        console.log(`HTTP + Socket.IO server listening on port ${port}`);
    })
}).catch(err => {
    console.log('Ocurrio un error');
});
