import mongoose from "mongoose";
import env from "../config/env.config.js";
import { logger } from "./logger.js";

const MONGO_PASSWORD = env.mongoPassword
const dbName = "test"

export default class MongoSingleton {
  static instance;

  constructor() {
    mongoose.connect(
      `mongodb+srv://joaquinperezcoria:${MONGO_PASSWORD}@cluster0.zye6fyd.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    );
  }

  static getInstance() {
    if (this.instance) {
        logger.info("Already connected!");
        return this.instance;
    }

    this.instance = new MongoSingleton();
    logger.info("Connected!");
    return this.instance;
  }
}