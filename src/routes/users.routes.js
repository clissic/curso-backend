import express from "express";
import { usersController } from "../controllers/users.controller.js";
import { checkAdmin } from "../middlewares/auth.js";

export const usersRouter = express.Router();

usersRouter.get("/", checkAdmin, usersController.getAll);

usersRouter.get("/:id", checkAdmin, usersController.findById);

usersRouter.post("/", usersController.create);

usersRouter.put("/:_id", checkAdmin, usersController.updateOne);

usersRouter.get("/d/deleteinactiveusers", checkAdmin, usersController.deleteInactiveUsers);

usersRouter.delete("/:_id", checkAdmin, usersController.deleteOne);

usersRouter.get("/toggle-role/:email", checkAdmin, usersController.toggleRole);