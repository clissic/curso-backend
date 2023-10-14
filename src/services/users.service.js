import moment from "moment";
import importModels from "../DAO/factory.js";
import { UserMongoose } from "../DAO/models/mongoose/users.mongoose.js";
import env from "../config/env.config.js";
import { logger } from "../utils/logger.js";
import { transport } from "../utils/nodemailer.js";

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
      const API_URL = env.apiUrl;
      const twoDaysAgo = moment().subtract(2, 'days').toDate();
      const inactiveUsers = await UserMongoose.find({ last_login: { $lt: twoDaysAgo } });

      const result = await usersModel.deleteInactiveUsers();

      for (const user of inactiveUsers) {
        try {
          await transport.sendMail({
            from: env.googleEmail,
            to: user.email,
            subject: "[iCommerce] Your account has been deleted for inactivity!",
            html: `
              <div>
                <h1>iCommerce</h1>
                <p>Your account has been deleted for inactivity:</p>
                <h3>Your account was deleted by an ADMIN. After 48 hours of inactivity your account is tagged as inactive and can be deleted by an admin any time.</h3>
                <p>If you think this is an error, please contact us ASAP!</p>
                <strong>If you want to create a new account, please follow <a href="${API_URL}/signup">this link</a>.</strong>
              </div>
            `,
          });
  
          logger.info("Elimination for been inactive email sent successfully to: " + user.email);
        } catch (error) {
          logger.error("Failed to send elimination email to: " + user.email + "/" + error);
        }
      }
  
      return result;
    } catch (error) {
      logger.error("An error occurred while deleting inactive users: " + error);
      throw error;
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
