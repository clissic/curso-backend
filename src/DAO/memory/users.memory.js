import fs from "fs";
import { isValidPassword } from "../../utils/Bcrypt.js";
import { cartsService } from "../../services/carts.service.js";
import { logger } from "../../utils/logger.js";

class UserManager {
  constructor() {
    this.users = [];
    const usersString = fs.readFileSync("src/DAO/memory/users.json", "utf-8");
    const users = JSON.parse(usersString);
    this.users = users;
  }

  getAll() {
    return this.users;
  }

  findById(id) {
    return this.users.find((user) => user.id === id);
  }

  findUser(email, password) {
    const user = this.users.find((user) => user.email === email);
    if (user && isValidPassword(password, user.password)) {
      return user;
    } else {
      return logger.info("No user found");
    }
  }

  findByEmail(email) {
    const user = this.users.find((user) => user.email === email);
    if (user) {
      return user;
    } else {
      return logger.info("No user found");
    }
  }

  create(first_name, last_name, email, age, password) {
    if (!first_name) {
      return logger.info("A first_name is required");
    }
    if (!last_name) {
      return logger.info("A last_name is required");
    }
    if (!email) {
      return logger.info("An email is required");
    }
    if (!age && !isNaN(age)) {
      return logger.info("An age is required (in number)");
    }
    if (!password) {
      return logger.info("A password is required");
    }

    const notNewProductEmail = this.users.find((user) => user.email === email);
    if (notNewProductEmail) {
      return logger.info("This email is already in use");
    }

    let actualId = 0;
    this.users.forEach((user) => {
      if (parseInt(user.id) > actualId) {
        actualId = user.id;
      }
    });
    actualId++;

    const addedUser = {
      id: actualId.toString(),
      first_name,
      last_name,
      email,
      avatar:
        "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
      age,
      password,
      role: "user",
      cartId: cartsService.create(),
    };

    this.users.push(addedUser);
    const usersString = JSON.stringify(this.users);
    fs.writeFileSync("src/DAO/memory/users.json", usersString);
    return usersString;
  }

  updateOne(id, dataToUpdate) {
    const userToUpdate = this.users.findIndex((user) => user.id === id);
    const updatedUser = {
      ...this.users[userToUpdate],
      ...dataToUpdate,
      id,
    };
    this.users[userToUpdate] = updatedUser;
    const updatedUsersString = JSON.stringify(this.users);
    fs.writeFileSync("src/DAO/memory/users.json", updatedUsersString);
    return updatedUsersString;
  }

  deleteOne(id) {
    const userToDelete = this.users.findIndex((user) => user.id === id);
    if (userToDelete === -1) {
      return logger.info("Product does not exist");
    }
    this.users.splice(userToDelete, 1);
    const usersString = JSON.stringify(this.users);
    fs.writeFileSync("src/DAO/memory/users.json", usersString);
    return usersString;
  }
}

export const userModel = new UserManager();
