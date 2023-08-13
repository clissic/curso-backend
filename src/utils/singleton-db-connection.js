import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default class MongoSingleton {
  static instance;

  constructor() {
    mongoose.connect(
      `mongodb+srv://joaquinperezcoria:${process.env.MONGODB_PASSWORD}@cluster0.zye6fyd.mongodb.net/?retryWrites=true&w=majority`,
    );
    console.log("Plug to mongo!");
  }

  static getInstance() {
    if (this.instance) {
        console.log("Already connected!");
        return this.instance;
    }

    this.instance = new MongoSingleton();
    console.log("Connected!");
    return this.instance;
  }
}