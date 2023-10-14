import express from "express";
import { __dirname } from "../config.js"
import { uploader } from "../utils/multer.js";
import { productsController } from "../controllers/products.controller.js";
import { checkAdminOrPremium } from "../middlewares/auth.js";

export const productsRouter = express.Router();

productsRouter.get("/", checkAdminOrPremium, productsController.getAllAndPaginate);

productsRouter.get("/:id", productsController.getById);

productsRouter.post("/", /* uploader.single("file"), */ productsController.create);

productsRouter.put("/:id", /* checkAdminOrPremium, */ productsController.getByIdAndUpdate);

productsRouter.delete("/:id", /* checkAdminOrPremium, */ productsController.getByIdAndDelete);

productsRouter.get("/update-stock/:id/:stock", productsController.getByIdAndUpdateStock);

productsRouter.get("/update-price/:id/:price", productsController.getByIdAndUpdatePrice);