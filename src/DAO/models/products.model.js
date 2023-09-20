import { ProductsMongoose } from "./mongoose/products.mongoose.js";

export default class ProductsModel {
  async create(title, description, price, thumbnail, code, stock, category, status, owner) {
    const newProduct = new ProductsMongoose({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
      owner,
    });
    await newProduct.save();
    return newProduct;
  }

  async getAll() {
    const products = await ProductsMongoose.find({});
    return products;
  }

  async getById(id) {
    const product = await ProductsMongoose.findById(id);
    return product;
  }

  async getByIdAndUpdate(id, dataToUpdate) {
    const updatedProduct = await ProductsMongoose.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true }
    );
    return updatedProduct;
  }

  async getByIdAndDelete(id) {
    const deletedProduct = await ProductsMongoose.findByIdAndDelete(id);
    return deletedProduct;
  }
}

export const productsModel = new ProductsModel();
