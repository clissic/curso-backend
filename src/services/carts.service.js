/* import importModels from "../DAO/factory.js";

const models = await importModels();
const cartsModel = models.carts */

import { cartsModel } from "../DAO/models/carts.model.js";
/* import { cartsModel } from "../DAO/models/carts.memory.js"; */

class CartsService {
  async create() {
    try {
      return await cartsModel.create();
    } catch (error) {
      throw new Error("Failed to create cart");
    }
  }

  async getById(cid) {
    try {
      return await cartsModel.getById(cid);
    } catch (error) {
      throw new Error("Failed to find cart by ID");
    }
  }

  async getOneAndUpdate(cid, pid) {
    try {
      return await cartsModel.getOneAndUpdate(cid, pid);
    } catch (error) {
      throw new Error("Failed to update cart by ID and product ID");
    }
  }

  async removeProduct(cid, pid) {
    try {
      return await cartsModel.removeProduct(cid, pid);
    } catch (error) {
      throw new Error("Failed to remove product from cart");
    }
  }

  async getAllProducts(cid) {
    try {
      const cartProducts = await cartsModel.getAllProducts(cid);
      return cartProducts;
    } catch (error) {
      throw new Error("Failed to get all products from cart");
    }
  }
}

export const cartsService = new CartsService();
