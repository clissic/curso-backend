import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { ticketsService } from "../services/tickets.service.js";
import { logger } from "../utils/logger.js";
import { generateRandomCode } from "../utils/random-code.js";
import CartDTO from "./DTO/carts.dto.js";

class CartsController {
  async deleteAllProdInCart(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        logger.error(
          "Error trying to find a cart in carts.controller (deleteAllProdInCart)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a cart" });
      }
      cart.products = [];
      await cart.save();
      return res.status(200).json({
        status: "success",
        message: "All products deleted from cart",
        payload: cart,
      });
    } catch (error) {
      logger.error(
        "Error trying to delete all products from cart in carts.controller: " +
          error
      );
      return res.status(500).render("errorPage", {
        msg: "Error trying to delete all products from cart",
      });
    }
  }

  async modQuantProdInCartById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const quantity = req.body.quantity;

      const cart = await cartsService.getById(cid);
      if (!cart) {
        logger.error(
          "Error trying to find a cart in carts.controller (modQuantProdInCartById)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a cart" });
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (productIndex === -1) {
        logger.error(
          "Error trying to find a product in carts.controller (modQuantProdInCartById)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a product" });
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();

      return res.status(200).json({
        status: "success",
        message: "Product quantity updated in cart",
        payload: cart,
      });
    } catch (error) {
      logger.error(
        "Error trying to update the quantity of a product in carts.controller (modProdInCartById): " +
          error
      );
      return res.status(500).render("errorPage", {
        msg: "Error trying to update the quantity of a product.",
      });
    }
  }

  async productToDeleteById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        logger.error(
          "Error trying to find a cart in carts.controller (productToDeleteById)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a cart" });
      }
      const productToDeleteIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (productToDeleteIndex === -1) {
        logger.error(
          "Error trying to find a product in carts.controller (productToDeleteById)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a product" });
      }
      cart.products.splice(productToDeleteIndex, 1);
      await cart.save();
      return res.status(200).json({
        status: "success",
        message: "Product deleted from cart",
        payload: cart,
      });
    } catch (error) {
      logger.error(
        "Error trying to delete a product from cart in carts.controller (productToDeleteById): " +
          error
      );
      return res.status(500).render("errorPage", {
        msg: "Error trying to delete a product in cart",
      });
    }
  }

  async getOneAndUpdate(req, res) {
    try {
      const { cid, pid } = req.params;
      const productToAdd = await productsService.getById(pid);
      if (!productToAdd) {
        logger.error(
          "Error trying to find a product in carts.controller (getOneAndUpdate)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a product" });
      }

      const cart = await cartsService.getById(cid);
      if (!cart) {
        logger.error(
          "Error trying to find a cart in carts.controller (getOneAndUpdate)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a cart" });
      }
      const existingProduct = cart.products.find(
        (product) => product.product._id.toString() == pid
      );

      if (existingProduct) {
        await cartsService.getOneAndUpdate(cid, pid);
      } else {
        cart.products.push({ product: pid, quantity: 1 });
        await cart.save();
      }
      return res.status(200).redirect("/cart/" + cid);
    } catch (error) {
      logger.error(
        "Error trying to add a product to cart in carts.controller: " + error
      );
      return res
        .status(500)
        .render("errorPage", { msg: "Error trying to add a product to cart" });
    }
  }

  async getById(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await cartsService.getById(cid);
      if (cart) {
        return res.status(200).json({
          status: "success",
          message: "Cart found",
          payload: cart.products,
        });
      } else {
        logger.error("Error finding a cart for the user in carts.controller");
        res.status(404).render("errorPage", {
          msg: "Cart not found.",
        });
      }
    } catch (error) {
      logger.error("Error trying to get a cart in carts.controller: " + error);
      return res.status(500).render("errorPage", {
        msg: "Error trying to get a cart.",
      });
    }
  }

  async create(req, res) {
    try {
      const products = [];
      const cartDTO = new CartDTO(products);
      const newCart = await cartsService.create(cartDTO.products);
      return res.status(201).json({
        status: "success",
        message: "Cart created successfully",
        payload: newCart,
      });
    } catch (error) {
      logger.error(
        "Error creating cart for the user in carts.controller: " + error
      );
      return res.status(500).render("errorPage", {
        msg: "Error creating cart for the user.",
      });
    }
  }

  async getByIdAndRender(req, res) {
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
      const cid = req.params.cid;
      const mainTitle = "CART";
      const cart = await cartsService.getById(cid);
      if (!cart) {
        logger.error(
          "Error trying to find a cart in carts.controller (getByIdAndRender)"
        );
        return res
          .status(404)
          .render("errorPage", { msg: "Error trying to find a cart" });
      }
      return res
        .status(200)
        .render("cart", { cart: cart.toObject(), mainTitle, user });
    } catch (error) {
      logger.error(
        "Error trying to get a cart and rendering it in carts.controller: " +
          error
      );
      res.status(500).render("errorPage", {
        msg: "Error trying to get a cart and rendering it.",
      });
    }
  }

  async purchase(req, res) {
    try {
      const cid = req.params.cid;
      const userEmail = req.body.email;

      const cart = await cartsService.getById(cid);
      if (!cart) {
        logger.error("Error trying to get a cart in carts.controller");
        return res.status(404).render("errorPage", {
          msg: "Error trying to find a cart.",
        });
      }

      const productsWithInsufficientStock = [];

      let totalPrice = 0;
      for (const product of cart.products) {
        const { product: pid, quantity } = product;
        const dbProduct = await productsService.getById(pid);
        if (dbProduct && dbProduct.stock >= quantity) {
          totalPrice += dbProduct.price * quantity;
          await productsService.decreaseStock(pid, quantity);
        } else {
          productsWithInsufficientStock.push(product);
        }
      }

      cart.products = productsWithInsufficientStock;
      await cart.save();

      if (totalPrice > 0) {
        const purchase_datetime = Date.now();
        const code = generateRandomCode();
        const purchaser = userEmail;
        const ticket = await ticketsService.create(
          code,
          purchase_datetime,
          totalPrice,
          purchaser
        );
        return res.status(200).json({
          status: "success",
          message: "Purchase successfully processed",
          payload: ticket,
          noStock: cart.products,
        });
      } else {
        logger.error(
          "All selected products have insufficient stock in carts.controller"
        );
        return res.status(406).render("errorPage", {
          msg: "All selected products have insufficient stock.",
        });
      }
    } catch (error) {
      logger.error("Error processing purchase in carts.controller: " + error);
      res.status(500).render("errorPage", {
        msg: "Error processing purchase.",
      });
    }
  }

  async getByIdAndDelete(req, res) {
    try {
      const { cid } = req.params;
      const deletedCart = await cartsService.getByIdAndDelete(cid);
      if (deletedCart) {
        return res.status(200).json({
          status: "success",
          message: "Cart deleted successfully",
          payload: [],
        });
      } else {
        logger.error(
          "Cart by ID not found in carts.controller (getByIdAndDelete)"
        );
        return res.status(404).render("errorPage", {
          msg: "Cart by ID not found.",
        });
      }
    } catch (error) {
      logger.error(
        "Error deleting cart by ID in carts.controller (getByIdAndDelete): " +
          error
      );
      return res.status(500).render("errorPage", {
        msg: "Error deleting cart by ID.",
      });
    }
  }
}

export const cartsController = new CartsController();
