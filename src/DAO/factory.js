import config from "../config.js";
import { logger } from "../utils/logger.js";
import MongoSingleton from "../utils/singleton-db-connection.js";

switch (config.persistence) {
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

	switch (config.persistence) {
		case "MONGO":
      const { productsModel } = await import("../DAO/models/products.model.js");
      const { usersModel } = await import("../DAO/models/users.model.js");
      const { cartsModel } = await import("../DAO/models/carts.model.js");
      const { ticketsModel } = await import("../DAO/models/tickets.model.js");
			models = {
				products: productsModel,
				users: usersModel,
				carts: cartsModel,
				tickets: ticketsModel,
			};
			break;

		case "MEMORY":
      const { productsMemory } = await import("../DAO/memory/products.memory.js");
      const { usersMemory } = await import("../DAO/memory/users.memory.js");
      const { cartsMemory } = await import("../DAO/memory/carts.memory.js");
      const { ticketsMemory } = await import("../DAO/memory/tickets.memory.js");
			models = {
				products: productsMemory,
				users: usersMemory,
				carts: cartsMemory,
				tickets: ticketsMemory,
			};
			break;

		default:
			throw new Error(`El tipo de persistencia "${config.persistence}" no es válido.`);
	}

	return models;
}

export default importModels;