import env from "../config/env.config.js"
import fetch from "node-fetch";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { UserMongoose } from "../DAO/models/mongoose/users.mongoose.js";
import { cartsService } from "../services/carts.service.js";
import { userService } from "../services/users.service.js";
import { createHash, isValidPassword } from "../utils/Bcrypt.js";
import { logger } from "../utils/logger.js";

const GITHUB_LOGIN_SECRET = env.githubSecret;
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserMongoose.findOne({ email: username });
          if (!user) {
            logger.info("User not found with username (email) " + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            logger.info("Invalid password");
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;

          let user = await userService.findByEmail(username);

          if (user) {
            logger.info("User already exists");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cartId: await cartsService.create(),
          };
          logger.info(newUser)
          let userCreated = await userService.create(newUser);
          logger.info(userCreated);
          logger.info("User registration succesful");
          return done(null, userCreated);
        } catch (e) {
          console.error("Error in register:", e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.5e0a43f2fd32b3ee",
        clientSecret: GITHUB_LOGIN_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: "Bearer " + accesToken,
              "X-Github-Api-Version": "2022-11-28",
            },
          });

          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error("cannot get a valid email for this user"));
          }
          profile.email = emailDetail.email;
          const email = profile.email;
          let user = await userService.findByEmail(email);
          if (!user) {
            const newUser = {
              first_name: profile._json.name || profile._json.login || "noname",
              last_name: "noLast",
              email: profile.email,
              avatar: profile._json.avatar_url,
              age: 0,
              password: "noPass",
              role: "user",
              cartId: await cartsService.create(),
            };
            let userCreated = await userService.create(newUser);
            logger.info("User Registration succesful");
            return done(null, userCreated);
          } else {
            logger.info("User already exists");
            return done(null, user);
          }
        } catch (e) {
          logger.info("Error en auth github");
          logger.info(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.findById(id);

    done(null, user);
  });
}
