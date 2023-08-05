import { cartsService } from "../../services/carts.service.js";
import { isValidPassword } from "../../utils/Bcrypt.js";
import { UserMongoose } from "../models/mongoose/users.mongoose.js";

export default class UserModel {
  async getAll() {
    const users = await UserMongoose.find(
      {},
      {
        _id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      }
    );
    return users;
  }

  async findById(id) {
    const userFound = await UserMongoose.findById(id);
    return userFound;
  }

  async findUser(email, password) {
    const user = await UserMongoose.findOne(
      { email: email },
      {
        _id: true,
        first_name: true,
        last_name: true,
        email: true,
        avatar: true,
        age: true,
        password: true,
        role: true,
        cartId: true,
      }
    );
    if (user && isValidPassword(password, user.password)) {
      return user;
    } else {
      return false;
    }
  }

  async findUser(email) {
    const user = await UserMongoose.findOne(
      { email: email },
      {
        _id: true,
        first_name: true,
        last_name: true,
        email: true,
        avatar: true,
        age: true,
        password: true,
        role: true,
        cartId: true,
      }
    );
    return user;
  }

  async create({ first_name, last_name, email, avatar, age, password, role }) {
    const userCreated = await UserMongoose.create({
      first_name,
      last_name,
      email,
      avatar,
      age,
      password,
      role,
      cartId: await cartsService.create(),
    });
    return userCreated;
  }

  async updateOne({
    _id,
    first_name,
    last_name,
    email,
    avatar,
    age,
    password,
    role,
    cartId,
  }) {
    const userUpdated = await UserMongoose.updateOne(
      {
        _id: _id,
        cartId: cartId,
      },
      {
        first_name,
        last_name,
        email,
        avatar,
        age,
        password,
        role,
      }
    );
    return userUpdated;
  }

  async deleteOne(_id) {
    const result = await UserMongoose.deleteOne({ _id: _id });
    return result;
  }
}

export const userModel = new UserModel();
