import { ProductsMongoose } from "../DAO/models/mongoose/products.mongoose.js";
import { productsService } from "../services/products.service.js";
import { logger } from "../utils/logger.js";
import ProductDTO from "./DTO/products.dto.js";

class ProductsController {
  async getAll(req, res) {
    try {
      const allProducts = await productsService.getAll();
      return res.status(200).json({
        status: "success",
        message: "Products found",
        payload: allProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: "error", message: "Uploading a file is mandatory" });
      }
      const { title, description, price, code, stock, category } = req.body;
      const thumbnail = req.file.filename;
      const productDTO = new ProductDTO(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
      );
      const newProduct = productsService.create(
        productDTO.title,
        productDTO.description,
        productDTO.price,
        productDTO.thumbnail,
        productDTO.code,
        productDTO.stock,
        productDTO.category
      );
      return res.status(201).json({
        status: "success",
        message: "Product created",
        payload: newProduct,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllAndPaginate(req, res) {
    try {
      const { currentPage, prodLimit, sort, query } = req.query;
      const sortOption =
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
      const filter = {};
      if (query === "tablet" || query === "celphone" || query === "notebook") {
        filter.category = query;
      }
      if (query === "available") {
        filter.stock = { $gt: 0 };
      }

      const queryResult = await ProductsMongoose.paginate(filter, {
        sort: sortOption,
        limit: prodLimit || 10,
        page: currentPage || 1,
      });
      let paginatedProd = queryResult.docs;
      const {
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = queryResult;
      paginatedProd = paginatedProd.map((prod) => ({
        _id: prod._id.toString(),
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock,
        category: prod.category,
      }));
      const prevLink = hasPrevPage
        ? `/api/products?currentPage=${queryResult.prevPage}&prodLimit=${
            prodLimit ? prodLimit : ""
          }&sort=${sort ? sort : ""}&query=${query ? query : ""}`
        : null;
      const nextLink = hasNextPage
        ? `/api/products?currentPage=${queryResult.nextPage}&prodLimit=${
            prodLimit ? prodLimit : ""
          }&sort=${sort ? sort : ""}&query=${query ? query : ""}`
        : null;
      return res.status(200).json({
        status: "success",
        msg: "Listado de productos",
        payload: {
          paginatedProd,
          totalDocs,
          limit,
          totalPages,
          prevPage,
          nextPage,
          page,
          hasPrevPage,
          hasNextPage,
          prevLink,
          nextLink,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productsService.getById(id);
      if (product) {
        return res.status(200).json({
          status: "success",
          message: "Product by ID found",
          payload: product,
        });
      } else {
        return res
          .status(404)
          .json({ status: "error", message: "Product does not exist" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getByIdAndUpdate(req, res) {
    try {
      const { id } = req.params;
      const dataToUpdate = req.body;
      const updatedProduct = await productsService.getByIdAndUpdate(
        id,
        dataToUpdate
      );
      if (updatedProduct) {
        return res.status(200).json({
          status: "success",
          message: "Product modified successfully",
          payload: updatedProduct,
        });
      } else {
        return res
          .status(404)
          .json({ status: "error", message: "Product does not exist" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getByIdAndDelete(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await productsService.getByIdAndDelete(id);
      if (deletedProduct) {
        return res
          .status(200)
          .json({ status: "success", message: "Product deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ status: "error", message: "Product does not exist" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllAndRender(req, res) {
    try {
      let user = req.session.user;
      if (!user) {
        user = {
          email: req.user ? req.user.email : req.session.email,
          first_name: req.user ? req.user.first_name : req.session.first_name,
          last_name: req.user ? req.user.last_name : req.session.last_name,
          avatar: req.user ? req.user.avatar : req.session.avatar,
          age: req.user ? req.user.age : req.session.age,
          role: req.user ? req.user.role : req.session.role,
          cartId: req.user ? req.user.cartId : req.session.cartId,
        };
      }
      const { currentPage, prodLimit, sort, query } = req.query;
      const sortOption =
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};
      const filter = {};
      if (query === "tablet" || query === "celphone" || query === "notebook") {
        filter.category = query;
      }
      if (query === "available") {
        filter.stock = { $gt: 0 };
      }
      const queryResult = await ProductsMongoose.paginate(filter, {
        sort: sortOption,
        limit: prodLimit || 10,
        page: currentPage || 1,
      });
      let paginatedProd = queryResult.docs;
      const {
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = queryResult;
      paginatedProd = paginatedProd.map((prod) => ({
        _id: prod._id.toString(),
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock,
        category: prod.category,
      }));
      const prevLink = hasPrevPage
        ? `/api/products?currentPage=${queryResult.prevPage}&prodLimit=${
            prodLimit ? prodLimit : ""
          }&sort=${sort ? sort : ""}&query=${query ? query : ""}`
        : null;
      const nextLink = hasNextPage
        ? `/api/products?currentPage=${queryResult.nextPage}&prodLimit=${
            prodLimit ? prodLimit : ""
          }&sort=${sort ? sort : ""}&query=${query ? query : ""}`
        : null;

      const mainTitle = "ALL PRODUCTS";
      return res.status(200).render("products", {
        user,
        query,
        sort,
        prodLimit,
        mainTitle,
        paginatedProd,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        prevLink,
        nextLink,
      });
    } catch (error) {
      logger.info("Failed to fetch products:", error);
      return res
        .status(500)
        .render("errorPage", { msg: "Error 500. Failed to fetch products." });
    }
  }

  async renderRealTimeProd(req, res) {
    try {
      const products = await productsService.getAll();
      const plainProducts = products.map((product) => product.toObject());
      const mainTitle = "REAL TIME PRODUCTS";
      return res
        .status(200)
        .render("real-time-products", { mainTitle, products: plainProducts });
    } catch (error) {
      logger.info("Failed to fetch products:", error);
      return res
        .status(500)
        .render("errorPage", { msg: "Error 500. Failed to fetch products." });
    }
  }
}

export const productsController = new ProductsController();
