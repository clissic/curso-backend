import { cartsModel } from "../DAO/models/carts.model.js";

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
}

export const cartsService = new CartsService();
