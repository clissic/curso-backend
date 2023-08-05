import express from "express";
import { cartsController } from "../controllers/carts.controller.js";

export const cartRouter = express.Router();

cartRouter.get("/:cid", cartsController.getByIdAndRender);
