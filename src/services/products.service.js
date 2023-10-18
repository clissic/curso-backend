import importModels from "../DAO/factory.js";
import { logger } from "../utils/logger.js";
import { transport } from "../utils/nodemailer.js";
import env from "../config/env.config.js";

const models = await importModels();
const productsModel = models.products

class ProductsService {
  async create(title, description, price, thumbnail, code, stock, category, status, owner) {
    try {
      return await productsModel.create(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
        owner
      );
    } catch (error) {
      throw logger.info("Failed to create product: " + error);
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
      const prodToDelete = await productsModel.getById(id);
      const owner = prodToDelete.owner;
      if (owner !== "admin") {
        try {
          const API_URL = env.apiUrl;
          await transport.sendMail({
            from: env.googleEmail,
            to: owner,
            subject: "[iCommerce] Your product has been deleted!",
            html: `
              <div>
                <h1>iCommerce</h1>
                <p>Your product <strong>"${prodToDelete.title}"</strong> has been deleted:</p>
                <h3>Your product has been successfully deleted from the Data Base.</h3>
                <p>If you did not deleted your product and think this is an error, please contact us ASAP!</p>
                <strong>If you want to post a new product, please follow <a href="${API_URL}/create-product">this link</a>.</strong>
                <p>Remember that this feature is only provided to PREMIUM accounts.</p>
              </div>
            `,
          });
  
          logger.info("Deleted product (id: " + prodToDelete._id + ") email sent successfully to: " + owner);
        } catch (error) {
          logger.error("Failed to send elimination email to: " + owner + " / " + error);
        }
      }
      return await productsModel.getByIdAndDelete(id);
    } catch (error) {
      throw new Error("Failed to delete product by ID: " + error);
    }
  }

  async decreaseStock(pid, quantity) {
    try {
      const product = await productsModel.getById(pid);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < quantity) {
        throw new Error("Insufficient stock");
      }

      product.stock -= quantity;
      await product.save();

      return product;
    } catch (error) {
      throw new Error(`Failed to decrease stock: ${error.message}`);
    }
  }
}

export const productsService = new ProductsService();
