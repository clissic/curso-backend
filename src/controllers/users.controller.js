import { userService } from '../services/users.service.js';
import { createHash } from '../utils/Bcrypt.js';
import { logger } from '../utils/logger.js';
import UserDTO from './DTO/users.dto.js';

class UsersController {
  async getAll(req, res) {
    try {
      const users = await userService.getAll();
      return res.status(200).json({
        status: 'success',
        msg: 'All users found',
        payload: users,
      });
    } catch (e) {
      logger.info(e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong',
        payload: {},
      });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.findById(id);
      if (user) {
        return res.status(200).json({
          status: 'success',
          message: 'User by ID found',
          payload: user,
        });
      } else {
        return res.status(404).json({ status: 'error', message: 'User does not exist' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      const userDTO = new UserDTO(first_name, last_name, email, age, createHash(password));
      if (!userDTO.first_name || !userDTO.last_name || !userDTO.email) {
        logger.info('Validation error: please complete First Name, Last Name and Email.');
        return res.status(400).json({
          status: 'error',
          msg: 'Please complete First Name, Last Name and Email.',
          payload: {},
        });
      }
      const userCreated = await userService.create(userDTO);
      return res.status(201).json({
        status: 'success',
        msg: 'User created',
        payload: userCreated,
      });
    } catch (e) {
      logger.error("Error: " + e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong',
        payload: {},
      });
    }
  }

  async updateOne(req, res) {
    try {
      const { _id } = req.params;
      const { first_name, last_name, email } = req.body;
      if (!first_name || !last_name || !email || !_id) {
        logger.info('Validation error: please complete firstName, lastName and email.');
        return res.status(400).json({
          status: 'error',
          msg: 'Please complete first_name, last_name and email.',
          payload: {},
        });
      }
      try {
        const userUpdated = await userService.updateOne({
          _id,
          first_name,
          last_name,
          email,
        });
        logger.info(JSON.stringify(userUpdated));
        if (userUpdated.matchedCount > 0) {
          return res.status(201).json({
            status: 'success',
            msg: 'User updated',
            payload: {},
          });
        } else {
          return res.status(404).json({
            status: 'error',
            msg: 'User not found',
            payload: {},
          });
        }
      } catch (e) {
        return res.status(500).json({
          status: 'error',
          msg: 'db server error while updating user',
          payload: {},
        });
      }
    } catch (e) {
      logger.info(e);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong',
        payload: {},
      });
    }
  }

  async deleteOne(req, res) {
    try {
      const { _id } = req.params;

      const result = await userService.deleteOne({ _id });

      if (result?.deletedCount > 0) {
        return res.status(200).json({
          status: 'success',
          msg: 'User deleted',
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: 'error',
          msg: 'User not found',
          payload: {},
        });
      }
    } catch (e) {
      logger.info(e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong',
        payload: {},
      });
    }
  }

  async deleteInactiveUsers(req, res) {
    try {
      const inactUsers = await userService.deleteInactiveUsers();
      if (inactUsers) {
        return res.status(200).json({
          status: 'success',
          msg: 'All inactive users deleted',
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: 'failed',
          msg: 'Inactive users not found',
          payload: {},
        });
      }
    } catch (e) {
      logger.info("ERROR: " + e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong',
        payload: {},
      });
    }
  }

  async toggleRole(req, res) {
    const {email} = req.params
    const user = await userService.findByEmail(email)
    try {
      const updatedUser = await userService.toggleRole(user)
      res.status(200).json({
        status: 'success',
        msg: 'Role toggled successfully',
        payload: updatedUser,
      })
    } catch (e) {
      logger.error("Something went wrong: " + e);
      return res.status(500).json({
        status: 'error',
        msg: 'Something went wrong',
        payload: {},
      });
    }
  }
}

export const usersController = new UsersController();
