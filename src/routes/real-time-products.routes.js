import express from "express";
import { productsController } from "../controllers/products.controller.js";

export const realTimeProducts = express.Router();

realTimeProducts.get("/", productsController.renderRealTimeProd);