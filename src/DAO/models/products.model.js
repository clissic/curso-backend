import { ProductsMongoose } from "./mongoose/products.mongoose.js";

export default class ProductsModel {
  async create(title, description, price, thumbnail, code, stock, category) {
    const newProduct = new ProductsMongoose({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
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
  
/*   async paginate(filter, options) {
    const queryResult = await ProductsMongoose.paginate(filter, options);
    return queryResult;
  } */
}

export const productsModel = new ProductsModel();
