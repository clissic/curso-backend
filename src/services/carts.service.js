import importModels from "../DAO/factory.js";
import { logger } from "../utils/logger.js";

class CartsService {
  async create() {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.create();
    } catch (error) {
      logger.error("Failed to create cart at cart.service (create): " + error);
    }
  }

  async getById(cid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.getById(cid);
    } catch (error) {
      logger.error("Failed to find cart by ID at cart.service (getById): " + error);
    }
  }

  async getOneAndUpdate(cid, pid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.getOneAndUpdate(cid, pid);
    } catch (error) {
      logger.error("Failed to update cart by ID and product ID at carts.service (getOneAndUpdate): " + error)
    }
  }

  async removeProduct(cid, pid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.removeProduct(cid, pid);
    } catch (error) {
      logger.error("Failed to remove product from cart at carts.service (removeProduct): " + error)
    }
  }

  async getAllProducts(cid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      const cartProducts = await cartsModel.getAllProducts(cid);
      return cartProducts;
    } catch (error) {
      logger.error("Failed to get all products from cart at carts.service (getAllProducts): " + error)
    }
  }

  async getByIdAndDelete(cid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      const deletedCart = await cartsModel.getByIdAndDelete(cid)
      return deletedCart;
    } catch (error) {
      logger.error("Failed to delete cart by ID: " + error)
    }
  }
}

export const cartsService = new CartsService();
