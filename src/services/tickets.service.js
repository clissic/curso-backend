import importModels from "../DAO/factory.js";

const models = await importModels();
const ticketsModel = models.tickets;

/* import { ticketsModel } from "../DAO/models/tickets.model.js"; */

class TicketsService {
  async create(code, purchase_datetime, amount, purchaser) {
    try {
      const ticket = await ticketsModel.create(code, purchase_datetime, amount, purchaser);
      console.log("Se creo: "+ ticket)
      return ticket
    } catch (error) {
      throw console.error("Failed to create ticket on service: " + error);
    }
  }
}

export const ticketsService = new TicketsService();
