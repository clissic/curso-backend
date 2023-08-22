import express from "express";
import { loggerTestController } from "../controllers/logger.test.controller.js";

export const loggerTest = express.Router();

loggerTest.get("/loggerTest", loggerTestController.loggerTest);