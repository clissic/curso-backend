import express from "express";
import { mockingTestController } from "../controllers/mocking.test.controller.js";

export const mockingTest = express.Router();

mockingTest.get("/", mockingTestController.generateProducts);