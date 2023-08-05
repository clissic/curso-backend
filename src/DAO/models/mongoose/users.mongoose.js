import { Schema, model } from "mongoose";

const schema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique: true },
  avatar: { type: String, default: "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg"},
  age: { type: Number, required: true},
  password: { type: String, required: true, max: 100 },
  role: { type: String, default: "user"},
  cartId: { type: Object },
});

export const UserMongoose = model("users", schema);