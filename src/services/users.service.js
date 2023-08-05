import { userModel } from "../DAO/models/users.model.js";

class UserService {
  async getAll() {
    try {
      return await userModel.getAll();
    } catch (error) {
      throw new Error("Failed to find users");
    }
  }

  async findById(id) {
    try {
      return await userModel.findById(id);
    } catch (error) {
      throw new Error("Failed to find user by ID");
    }
  }

  async create({ first_name, last_name, email, avatar, age, password }) {
    try {
      return await userModel.create({
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
      return await userModel.updateOne({
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
      return await userModel.deleteOne({ _id });
    } catch (error) {
      throw new Error("Failed to delete user by ID");
    }
  }

  async findUserByEmail(email) {
    try {
      return await userModel.findUserByEmail(email);
    } catch (error) {
      throw new Error("Failed to find user by email");
    }
  }
}

export const userService = new UserService();
