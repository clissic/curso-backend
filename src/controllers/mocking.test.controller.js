import { generateProduct } from "../config.js";
import { logger } from "../utils/logger.js";

class MockingTestController {
  async generateProducts(req, res) {
    try {
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push(generateProduct());
      }
        return res.status(200).json({
          status: "success",
          message: "Products generated",
          payload: products,
        });
      } catch (error) {
        logger.error("Error in moking.test.controller (generateProducts): " + error)
      return res.status(500).json({ error: "Could not generate products" });
    }
  }
}

export const mockingTestController = new MockingTestController();
