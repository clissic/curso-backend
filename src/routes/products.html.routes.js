import express from "express";
import { productsController } from "../controllers/products.controller.js";

export const products = express.Router();

products.get("/", productsController.getAllAndRender);
