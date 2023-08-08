import express from "express";
import passport from "passport";
import { checkLogin } from "../middlewares/auth.js";
import { sessionsController } from "../controllers/session.controller.js";

export const sessionsRouter = express.Router();

sessionsRouter.post("/signup", passport.authenticate('register', { failureRedirect: '/error-auth' }), sessionsController.signup);

sessionsRouter.post("/login", passport.authenticate('login', { failureRedirect: '/error-auth' }), sessionsController.login);

sessionsRouter.get("/logout", sessionsController.logout)

sessionsRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/error-auth" }), sessionsController.githubCallback);

sessionsRouter.get("/current", checkLogin, sessionsController.current)