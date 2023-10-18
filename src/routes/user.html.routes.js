import express from "express";
import { userController } from "../controllers/user.controller.js";
import { checkAdmin } from "../middlewares/auth.js";

export const userRouter = express.Router();

userRouter.get("/dashboard", checkAdmin, userController.renderDashboard);
