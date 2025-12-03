import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { login, signup, resetPassword, forgotPassword} from "../controllers/auth";
import {UserModel} from "../models/users";
import { validateBody } from "../middelwares/validate";
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema } from "../validation/schemas";

const router = Router();


/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *             example:
 *               email: "user@example.com"
 *               password: "secret"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post('/login', validateBody(loginSchema), login);
/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Registro 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               role: { type: string, enum: [user, admin] }
 *             example:
 *               name: "Juan Pérez"
 *               email: "juan@example.com"
 *               password: "secret"
 *               role: "user"
 *     responses:
 *       200:
 *         description: OK (sin cuerpo)
 */
router.post('/signup', validateBody(signupSchema), signup);

// iniciar login con Google
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: any, res) => {
        try {
      const profile = req.user;

      const email = profile.emails[0].value;
      const name = profile.displayName;
      const googleId = profile.id;
      const avatar = profile.photos?.[0]?.value;

      let user = await UserModel.findOne({ email });

      if (!user) {
        user = await UserModel.create({
          email,
          name,
          googleId,
          avatar,
          password: null, 
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

        // Redirigir con el token como parámetro para que el cliente lo guarde
      res.redirect(`/app/dashboard?token=${token}`);
    } catch (error) {
      console.error(error);
      res.redirect("/login?error=google-auth");
    }
  }
);

router.get("/verify", async (req, res) => {
  const token = req.query.token as string;

  if (!token) return res.status(400).send("Token inválido");

  const user = await UserModel.findOne({ verificationToken: token });

  if (!user) return res.status(400).send("Token no válido o expirado");

  user.verified = true;

  await user.save();


    // Generar JWT token
  const jwtToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // Redirigir con el token como parámetro para que el cliente lo guarde
  res.redirect(`/app/dashboard?token=${jwtToken}`);
});


router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

router.get("/reset-password/", (req, res) => {
  res.render("resetPassword", { token: req.query.token });
});

router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);

router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);

export default router;
