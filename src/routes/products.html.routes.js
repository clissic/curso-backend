import express from "express";
import { productsController } from "../controllers/products.controller.js";
import { checkAdmin, checkAdminOrPremium } from "../middlewares/auth.js";

export const products = express.Router();

products.get("/", productsController.getAllAndRender);

products.get("/create-product", checkAdminOrPremium, productsController.renderCreateProduct);

products.get("/real-time-products", checkAdmin, productsController.renderRealTimeProd);
