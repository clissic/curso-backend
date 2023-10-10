import express from "express";
import { userController } from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.get("/dashboard", userController.renderDashboard);
