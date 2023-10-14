import importModels from "../DAO/factory.js";
import { UserMongoose } from "../DAO/models/mongoose/users.mongoose.js";
import env from "../config/env.config.js";
import { createHash } from "../utils/Bcrypt.js";
import { logger } from "../utils/logger.js";
import { transport } from "../utils/nodemailer.js";
import { generateRandomCode } from "../utils/random-code.js";
import moment from 'moment';

const models = await importModels();
const recoverTokensModel = models.tokens;
const usersModel = models.users;

class RecoverTokensService {
  async create({token, email, expire}) {
    try {
      await recoverTokensModel.create({token, email, expire});
    } catch (error) {
      logger.error("Error creating recover token in tokens.service: " + error);
    }
  }

  async findOne({token, email}) {
    try {
      const recoverTokenFound = await recoverTokensModel.findOne({token, email});
      return recoverTokenFound;
    } catch (error) {
      logger.error("Error finding recover token in tokens.service: " + error);
    }
  }

  async recoverPass(email, newPassword) {
    try {
      await usersModel.updatePassword(email, createHash(newPassword));
    } catch (error) {
      logger.error("Error recovering password in login.service: " + error);
    }
  }

  async sendRecoveryToken(email) {
    const user = await usersModel.findByEmail(email);
    const token = generateRandomCode();
    const expire = Date.now() + 3600000;
    const savedToken = await recoverTokensModel.create({
      token: token,
      email: email,
      expire: expire,
    });
    const API_URL = env.apiUrl;
    if (user) {
      const result = await transport.sendMail({
        from: env.googleEmail,
        to: email,
        subject: "[iCommerce] Your password recovery token!",
        html: `
                <div>
                    <h1>iCommerce</h1>
                    <p>Your password recovery token is:</p>
                    <h3>${token}</h3>
                    <p>Be aware that this token will only last for 1 hour!</p>
                    <strong>To continue to the recovery page, please follow <a href="${API_URL}/recover-password?token=${token}&email=${email}">this link</a>.</strong>
                </div>
            `,
      });
    } else {
      logger.error(`Email ${email} does not exist in DB`);
    }
  }
}

export const recoverTokensService = new RecoverTokensService();
