import express from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { checkUser } from "../middlewares/auth.js";

export const cartsRouter = express.Router();

cartsRouter.post("/", cartsController.create);

cartsRouter.get("/:cid", /* checkUser, */ cartsController.getById);

cartsRouter.delete("/:cid", cartsController.deleteAllProdInCart);

cartsRouter.post("/:cid/products/:pid", /* checkUser, */ cartsController.getOneAndUpdate);

cartsRouter.delete("/:cid/products/:pid", /* checkUser, */ cartsController.productToDeleteById);

cartsRouter.put("/:cid/products/:pid", /* checkUser, */ cartsController.modQuantProdInCartById);

cartsRouter.post("/:cid/purchase", cartsController.purchase);

cartsRouter.delete("/:cid/delete", cartsController.getByIdAndDelete);