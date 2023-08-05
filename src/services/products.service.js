import { productsModel } from "../DAO/models/products.model.js";
/* import { productsModel } from "../DAO/memory/products.memory.js"; */

class ProductsService {
  async create(title, description, price, thumbnail, code, stock, category) {
    try {
      return await productsModel.create(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
      );
    } catch (error) {
      throw console.error("Failed to create product: " + error);
    }
  }

  async getAll() {
    try {
      return await productsModel.getAll();
    } catch (error) {
      throw new Error("Failed to find products");
    }
  }

  async getById(id) {
    try {
      return await productsModel.getById(id);
    } catch (error) {
      throw new Error("Failed to find product by ID");
    }
  }

  async getByIdAndUpdate(id, dataToUpdate) {
    try {
      return await productsModel.getByIdAndUpdate(id, dataToUpdate);
    } catch (error) {
      throw new Error("Failed to update product by ID");
    }
  }

  async getByIdAndDelete(id) {
    try {
      return await productsModel.getByIdAndDelete(id);
    } catch (error) {
      throw new Error("Failed to delete product by ID");
    }
  }

/*   async paginate(filter, options) {
    try {
      const queryResult = await productsModel.paginate(filter, options);
      console.log(queryResult)
      return queryResult
    } catch (error) {
      throw new Error("Failed to paginate products");
    }
  } */
}

export const productsService = new ProductsService();
