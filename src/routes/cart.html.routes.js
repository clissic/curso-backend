import express from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { checkLogin, checkUser } from "../middlewares/auth.js";

export const cartRouter = express.Router();

cartRouter.get("/:cid", checkLogin, cartsController.getByIdAndRender);
