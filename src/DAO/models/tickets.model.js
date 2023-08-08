import { TicketsMongoose } from "./mongoose/tickets.mongoose.js";

class TicketsModel {
  async create(code, purchase_datetime, amount, purchaser) {
    const newTicket = new TicketsMongoose({
      code,
      purchase_datetime,
      amount,
      purchaser,
    });
    await newTicket.save();
    return newTicket;
  }
}

export const ticketsModel = new TicketsModel();
