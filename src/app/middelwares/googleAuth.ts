import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

export const initGoogleAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        callbackURL: process.env.GOOGLE_CB_URL!,
        passReqToCallback: true,
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          // En el callback no creamos usuario aquí
          // Solo mandamos el perfil para que tu controlador lo maneje
          return done(null, profile);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
};
