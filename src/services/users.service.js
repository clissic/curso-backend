import importModels from "../DAO/factory.js";

const models = await importModels();
const usersModel = models.users

/* import { usersModel } from "../DAO/models/users.model.js"; */
/* import { userModel } from "../DAO/models/users.memory.js"; */

class UserService {
  async getAll() {
    try {
      return await usersModel.getAll();
    } catch (error) {
      throw new Error("Failed to find users");
    }
  }

  async findById(id) {
    try {
      return await usersModel.findById(id);
    } catch (error) {
      throw new Error("Failed to find user by ID");
    }
  }

  async create({ first_name, last_name, email, avatar, age, password }) {
    try {
      return await usersModel.create({
        first_name,
        last_name,
        email,
        avatar,
        age,
        password,
      });
    } catch {
      throw new Error("Failed to create a user");
    }
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
    try {
      return await usersModel.updateOne({
        _id,
        first_name,
        last_name,
        email,
        avatar,
        age,
        password,
        role,
        cartId,
      });
    } catch (error) {
      throw new Error("Failed to update user by ID");
    }
  }

  async deletOne({ _id }) {
    try {
      return await usersModel.deleteOne({ _id });
    } catch (error) {
      throw new Error("Failed to delete user by ID");
    }
  }

  async findUserByEmail(email) {
    try {
      return await usersModel.findUserByEmail(email);
    } catch (error) {
      throw new Error("Failed to find user by email");
    }
  }
}

export const userService = new UserService();
