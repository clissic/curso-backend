import { Schema, model } from "mongoose";

const schema = new Schema({
  code: { type: String, required: true, unique: true},
  purchase_datetime: { type: Number, default: Date.now },
  amount: { type: Number, required: true},
  purchaser: { type: String, required: true},
});

export const TicketsMongoose = model("tickets", schema);