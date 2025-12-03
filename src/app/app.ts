import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import hbs from "hbs";
import passport from "passport";
import swaggerJsDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import swaggerOptions from "../../swagger.config.js";
import routes from "./routes/index.js";
import { initGoogleAuth } from "./middelwares/googleAuth.js";

export function createApp() {
  const app = express();

  // Views (HBS)
  const viewsDir = path.join(__dirname, "views");
  const partialsDir = path.join(__dirname, "views/partials");

  app.engine("hbs", (hbs as any).__express);
  app.set("view engine", "hbs");
  app.set("views", viewsDir);
  hbs.registerPartials(partialsDir);

  console.log("HBS views:", viewsDir);
  console.log("HBS partials:", partialsDir);

  // Fallback manual registration of partials
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

  // Auth (Google OAuth) + JSON parsing
  if (process.env.NODE_ENV !== "test") {
    initGoogleAuth();
  }
  app.use(passport.initialize());
  app.use(express.json());

  // Health
  app.get("", (_req: Request, res: Response) => {
    res.send("api works");
  });

  // Swagger
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/swagger", serve, setup(swaggerDocs));

  // Routes
  app.use(routes);

  return app;
}
