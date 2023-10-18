import moment from "moment";
import importModels from "../DAO/factory.js";
import { UserMongoose } from "../DAO/models/mongoose/users.mongoose.js";
import env from "../config/env.config.js";
import { logger } from "../utils/logger.js";
import { transport } from "../utils/nodemailer.js";
import error from "../middlewares/error.js";

const models = await importModels();
const usersModel = models.users

class UserService {
  async getAll() {
    try {
      return await usersModel.getAll();
    } catch (error) {
      logger.error("Failed to find users at users.service (getAll): " + error)
    }
  }

  async findById(id) {
    try {
      return await usersModel.findById(id);
    } catch (error) {
      logger.error("Failed to find user by ID at users.service (findById): " + error)
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
    } catch (error) {
      logger.error("Failed to create an user at users.service (create): " + error)
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
      logger.error("Failed to update user by ID at users.service (updateOne): " + error)
    }
  }

  async deletOne({ _id }) {
    try {
      return await usersModel.deleteOne({ _id });
    } catch (error) {
      logger.error("Failed to delete user by ID at users.service (deletOne): " + error)
    }
  }

  async findByEmail(email) {
    try {
      return await usersModel.findByEmail(email);
    } catch (error) {
      logger.error("Failed to find user by email at users.service (findByEmail): " + error)
    }
  }

  async updatePassword(email, newPassword) {
    try {
      return await usersModel.updatePassword({ email, newPassword });
    } catch(error) {
      logger.error("Failed to update password at users.service (updatePassword): " + error)
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
      logger.error("An error occurred while deleting inactive users at users.service (deleteInactiveUsers): " + error);
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
    } catch (error) {
      logger.error("Failed to toggle roles at users.service (toggleRole): " + error)
    }
  }
}

export const userService = new UserService();
