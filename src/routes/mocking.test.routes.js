import express from "express";
import { mockingTestController } from "../controllers/mocking.test.controller.js";
import { checkAdmin } from "../middlewares/auth.js";

export const mockingTest = express.Router();

mockingTest.get("/", checkAdmin, mockingTestController.generateProducts);