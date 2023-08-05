import config from "../config.js";
import dotenv from "dotenv";
import { connect } from "mongoose";

export let productsModel;
export let usersModel;

switch (config.persistence) {
  case "MONGO":
    dotenv.config();
    console.log("Mongo connect");

    async function connectMongo() {
      try {
        await connect(
          `mongodb+srv://joaquinperezcoria:${process.env.MONGODB_PASSWORD}@cluster0.zye6fyd.mongodb.net/?retryWrites=true&w=majority`
        );
        console.log("Plug to mongo!");
      } catch (e) {
        console.log(e);
        throw "Can not connect to the db";
      }
    }
    connectMongo();

    const { default: ProductsMongo } = await import(
      "../DAO/models/products.model.js"
    );
    productsModel = ProductsMongo;

    const { default: UsersMongo } = await import(
      "../DAO/models/products.model.js"
    );
    usersModel = UsersMongo;

    break;
  case "MEMORY":
    console.log("Persistence with Memory");
    const { default: ProductsMemory } = await import(
      "../DAO/memory/products.memory.js"
    );
    productsModel = ProductsMemory;

    break;
  default:
    break;
}
