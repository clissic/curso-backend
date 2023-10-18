import express from "express";
import { loggerTestController } from "../controllers/logger.test.controller.js";
import { checkAdmin } from "../middlewares/auth.js";

export const loggerTest = express.Router();

loggerTest.get("/", checkAdmin, loggerTestController.loggerTest);