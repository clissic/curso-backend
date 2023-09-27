import env from "../config/env.config.js";
import { logger } from "../utils/logger.js";
import MongoSingleton from "../utils/singleton-db-connection.js";

export const PERSISTENCE = env.persistence;

switch (PERSISTENCE) {
  case "MONGO":
    logger.info("Database: MongoDB");
    MongoSingleton.getInstance();
    break;

  case "MEMORY":
    logger.info("Database: Persistencia en memoria");
    break;

  default:
    break;
}

async function importModels() {
  let models;

  switch (PERSISTENCE) {
    case "MONGO":
      const { productsModel } = await import("../DAO/models/products.model.js");
      const { usersModel } = await import("../DAO/models/users.model.js");
      const { cartsModel } = await import("../DAO/models/carts.model.js");
      const { ticketsModel } = await import("../DAO/models/tickets.model.js");
      const { recoverTokensModel } = await import("../DAO/models/tokens.model.js")
      models = {
        products: productsModel,
        users: usersModel,
        carts: cartsModel,
        tickets: ticketsModel,
        tokens: recoverTokensModel,
      };
      break;

    case "MEMORY":
      const { productsMemory } = await import("../DAO/memory/products.memory.js");
      const { usersMemory } = await import("../DAO/memory/users.memory.js");
      const { cartsMemory } = await import("../DAO/memory/carts.memory.js");
      const { ticketsMemory } = await import("../DAO/memory/tickets.memory.js");
      const { recoverTokensMemory } = await import("../DAO/memory/tokens.memory.js")
      models = {
        products: productsMemory,
        users: usersMemory,
        carts: cartsMemory,
        tickets: ticketsMemory,
        tokens: recoverTokensMemory,
      };
      break;

    default:
      throw new Error(
        `El tipo de persistencia "${env.persistence}" no es válido.`
      );
  }

  return models;
}

export default importModels;
