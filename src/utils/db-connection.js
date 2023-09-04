import { connect } from "mongoose";
import env from "../config/env.config.js";
import { logger } from "./logger.js";

const MONGO_PASSWORD = env.mongoPassword;

export async function connectMongo() {
  try {
    await connect(
      `mongodb+srv://joaquinperezcoria:${MONGO_PASSWORD}@cluster0.zye6fyd.mongodb.net/?retryWrites=true&w=majority`
    );
    logger.info("Plug to mongo!");
  } catch (e) {
    logger.info(e);
    throw "Can not connect to the db";
  }
}