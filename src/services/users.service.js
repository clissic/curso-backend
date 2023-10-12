import importModels from "../DAO/factory.js";

const models = await importModels();
const usersModel = models.users

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

  async create({ first_name, last_name, email, avatar, age, password, role, last_login }) {
    try {
      return await usersModel.create({
        first_name,
        last_name,
        email,
        avatar,
        age,
        password,
        role,
        last_login
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

  async findByEmail(email) {
    try {
      return await usersModel.findByEmail(email);
    } catch (error) {
      throw new Error("Failed to find user by email");
    }
  }

  async updatePassword(email, newPassword) {
    try {
      return await usersModel.updatePassword({ email, newPassword });
    } catch(error) {
      throw new Error("Failed to update password");
    }
  }

  async deleteInactiveUsers() {
    try {
      return await usersModel.deleteInactiveUsers();
    } catch(error) {
      throw new Error("Failed to delete inactive users");
    }
  }

  async toggleRole(user) {
    try {
      if (user.role == "user") {
        const updatedUser = await usersModel.toggleRole(user.email, "premium");
        return updatedUser;
      } else if (user.role == "premium") {
        const updatedUser = await usersModel.toggleRole(user.email, "user");
        return updatedUser;
      }
    } catch (e) {
      throw new Error("Failed to toggle roles");
    }
  }
}

export const userService = new UserService();
