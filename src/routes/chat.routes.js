import express from "express";
import { chatController } from "../controllers/chat.controller.js";
import { checkLogin } from "../middlewares/auth.js";

export const chatRouter = express.Router();

chatRouter.get("/", checkLogin, chatController.renderChat);