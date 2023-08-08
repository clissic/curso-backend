import express from "express";
import { productsController } from "../controllers/products.controller.js";
import { checkAdmin } from "../middlewares/auth.js";

export const realTimeProducts = express.Router();

realTimeProducts.get("/", checkAdmin, productsController.renderRealTimeProd);