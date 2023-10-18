import express from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { checkAdmin, checkAdminOrPremium, checkLogin, checkUser } from "../middlewares/auth.js";

export const cartsRouter = express.Router();

cartsRouter.post("/", cartsController.create);

cartsRouter.get("/:cid", checkLogin, cartsController.getById);

cartsRouter.delete("/:cid", checkLogin, cartsController.deleteAllProdInCart);

cartsRouter.post("/:cid/products/:pid", checkLogin, cartsController.getOneAndUpdate);

cartsRouter.delete("/:cid/products/:pid", checkAdminOrPremium, cartsController.productToDeleteById);

cartsRouter.put("/:cid/products/:pid", checkAdminOrPremium, cartsController.modQuantProdInCartById);

cartsRouter.post("/:cid/purchase", checkLogin, cartsController.purchase);

cartsRouter.delete("/:cid/delete", checkAdmin, cartsController.getByIdAndDelete);