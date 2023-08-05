import express from "express";
import { cartsController } from "../controllers/carts.controller.js";

export const cartsRouter = express.Router();

cartsRouter.post("/", cartsController.create);

cartsRouter.get("/:cid", cartsController.getById);

cartsRouter.post("/:cid/products/:pid", cartsController.getOneAndUpdate);

cartsRouter.delete("/:cid/products/:pid", cartsController.productToDeleteById);

cartsRouter.put("/:cid", cartsController.modProdInCart);

cartsRouter.put("/:cid/products/:pid", cartsController.modQuantProdInCartById);

cartsRouter.delete("/:cid", cartsController.deleteAllProdInCart);