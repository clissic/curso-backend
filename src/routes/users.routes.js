import express from "express";
import { usersController } from "../controllers/users.controller.js";

export const usersRouter = express.Router();

usersRouter.get("/", usersController.getAll);

usersRouter.get("/:id", usersController.findById);

usersRouter.post("/", usersController.create);

usersRouter.put("/:_id", usersController.updateOne);

usersRouter.delete("/:_id", usersController.deleteOne);