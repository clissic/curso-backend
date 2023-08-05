import { Schema, model } from "mongoose";

const schema = new Schema({
  message: { type: String, required: true, max: 100 },
  user: { type: String, required: true, max: 100 },
});

export const MsgMongoose = model("msgs", schema);
