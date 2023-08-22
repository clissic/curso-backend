import express from "express";
import { loggerTestController } from "../controllers/logger.test.controller.js";

export const loggerTest = express.Router();

loggerTest.get("/prodLoggerTest", loggerTestController.prodLoggerTest);

loggerTest.get("/devLoggerTest", loggerTestController.devLoggerTest);