import express from "express";
import { userController } from "../controllers/users.controller.js";

export const usersRouter = express.Router();

usersRouter.get("/", userController.getAll);

usersRouter.get("/:id", userController.findById);

usersRouter.post("/", userController.create);

usersRouter.put("/:_id", userController.updateOne);

usersRouter.delete("/:_id", userController.deleteOne);