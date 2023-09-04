import express from "express";
import { loginController } from "../controllers/login.controller.js";

export const loginRouter = express.Router();

loginRouter.get("/", loginController.loginRender);

loginRouter.get("/recover-form", loginController.recoverRender)

loginRouter.post("/recover-form", loginController.recoverPass)

loginRouter.get("/recover-password", loginController.recoverForm)

loginRouter.post("/recover-password", loginController.recoverByEmail)