import importModels from "../DAO/factory.js";
import { logger } from "../utils/logger.js";

const models = await importModels();
const ticketsModel = models.tickets;

class TicketsService {
  async create(code, purchase_datetime, amount, purchaser) {
    try {
      const ticket = await ticketsModel.create(code, purchase_datetime, amount, purchaser);
      logger.info("Se creo: "+ ticket)
      return ticket
    } catch (error) {
      throw logger.info("Failed to create ticket on service: " + error);
    }
  }
}

export const ticketsService = new TicketsService();
