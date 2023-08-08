import express from "express";
import { __dirname } from "../config.js"
import { uploader } from "../utils/multer.js";
import { productsController } from "../controllers/products.controller.js";
import { checkAdmin } from "../middlewares/auth.js";

export const productsRouter = express.Router();

productsRouter.get("/", productsController.getAllAndPaginate);

productsRouter.get("/:id", productsController.getById);

productsRouter.post("/", checkAdmin, uploader.single("file"), productsController.create);

productsRouter.put("/:id", checkAdmin, productsController.getByIdAndUpdate);

productsRouter.delete("/:id", checkAdmin, productsController.getByIdAndDelete);