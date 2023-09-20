import importModels from "../DAO/factory.js";

class CartsService {
  async create() {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.create();
    } catch (error) {
      throw new Error("Failed to create cart");
    }
  }

  async getById(cid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.getById(cid);
    } catch (error) {
      throw new Error("Failed to find cart by ID");
    }
  }

  async getOneAndUpdate(cid, pid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.getOneAndUpdate(cid, pid);
    } catch (error) {
      throw new Error("Failed to update cart by ID and product ID");
    }
  }

  async removeProduct(cid, pid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      return await cartsModel.removeProduct(cid, pid);
    } catch (error) {
      throw new Error("Failed to remove product from cart");
    }
  }

  async getAllProducts(cid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      const cartProducts = await cartsModel.getAllProducts(cid);
      return cartProducts;
    } catch (error) {
      throw new Error("Failed to get all products from cart");
    }
  }

  async getByIdAndDelete(cid) {
    const models = await importModels();
    const cartsModel = models.carts
    try {
      const deletedCart = await cartsModel.getByIdAndDelete(cid)
      return deletedCart;
    } catch (error) {
      throw new Error("Failed to delete cart by ID");
    }
  }
}

export const cartsService = new CartsService();
