import { cartsService } from '../../services/carts.service.js';
import { isValidPassword } from '../../utils/Bcrypt.js';
import { UserMongoose } from '../models/mongoose/users.mongoose.js';
import moment from 'moment';

export default class UsersModel {
  async getAll() {
    const users = await UserMongoose.find(
      {},
      {
        _id: true,
        first_name: true,
        last_name: true,
        email: true,
        avatar: true,
        role: true,
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
      user.last_login = new Date();
      await user.save();
      return user;
    } else {
      return false;
    }
  }

  async findByEmail(email) {
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
        last_login: true,
      }
    );
    if (user) {
      user.last_login = new Date();
      await user.save();
    }
    return user;
  }

  async create({ first_name, last_name, email, avatar, age, password, role, last_login }) {
    const userCreated = await UserMongoose.create({
      first_name,
      last_name,
      email,
      avatar,
      age,
      password,
      role,
      cartId: await cartsService.create(),
      last_login,
    });
    return userCreated;
  }

  async updateOne({ _id, first_name, last_name, email, avatar, age, password, role, cartId }) {
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

  async deleteInactiveUsers() {
    const twoDaysAgo = moment().subtract(2, 'days').toDate();
    const result = await UserMongoose.deleteMany({ last_login: { $lt: twoDaysAgo } });
    return { result };
  }

  async updatePassword(email, newPassword) {
    const userUpdated = await UserMongoose.updateOne(
      { email: email },
      {
        password: newPassword,
      }
    );
    return userUpdated;
  }

  async toggleRole(email, newRole) {
    const userUpdated = await UserMongoose.updateOne(
      { email: email },
      {
        role: newRole,
      }
    );
    return userUpdated;
  }
}

export const usersModel = new UsersModel();
