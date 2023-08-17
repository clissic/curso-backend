import { cartsService } from "../services/carts.service.js";
import CustomError from "../services/errors/custom-error.js";
import EErros from "../services/errors/enums.js";
import { productsService } from "../services/products.service.js";
import { ticketsService } from "../services/tickets.service.js";
import { generateRandomCode } from "../utils/random-code.js";
import CartDTO from "./DTO/carts.dto.js";

class CartsController {
  async deleteAllProdInCart(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        CustomError.createError({
          name: "Cart search error",
          cause: "No cart found",
          message: "Error trying to find a cart",
          code: EErros.CART_NOT_FOUND,
        });
        return res.render("errorPage", {
          msg: "Error 404. No cart found.",
        });
      }
      cart.products = [];
      await cart.save();
      return res.status(200).json({
        status: "success",
        message: "All products deleted from cart",
        payload: cart,
      });
    } catch (error) {
      CustomError.createError({
        name: "Cart product delete error",
        cause: "Could not delete the product",
        message: "Error trying to delete a product for cart",
        code: EErros.CART_PRODUCT_DELETE,
      });
      return res.render("errorPage", {
        msg: "Error 500. Could not delete the product.",
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
        CustomError.createError({
          name: "Cart search error",
          cause: "No cart found",
          message: "Error trying to find a cart",
          code: EErros.CART_NOT_FOUND,
        });
        return res.render("errorPage", {
          msg: "Error 404. No cart found.",
        });
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (productIndex === -1) {
        CustomError.createError({
          name: "Product search error",
          cause: "No product found",
          message: "Error trying to find a product",
          code: EErros.PRODUCT_NOT_FOUND,
        });
        return res.render("errorPage", {
          msg: "Error 404. No product found.",
        });
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();

      return res.status(200).json({
        status: "success",
        message: "Product quantity updated in cart",
        payload: cart,
      });
    } catch (error) {
      CustomError.createError({
        name: "Product update error",
        cause: "Error updating product",
        message: "Error trying to update the quantity of a product",
        code: EErros.UPDATE_PRODUCT_QUANTITY,
      });
      return res.render("errorPage", {
        msg: "Error 500. Error updating product.",
      });
    }
  }

  async modProdInCart(req, res) {
    try {
      const cid = req.params.cid;
      const productsToUpdate = req.body.products;

      const cartDTO = new CartDTO(productsToUpdate);

      const cart = await cartsService.getById(cid);
      if (!cart) {
        CustomError.createError({
          name: "Cart search error",
          cause: "No cart found",
          message: "Error trying to find a cart",
          code: EErros.CART_NOT_FOUND,
        });
        return res.render("errorPage", {
          msg: "Error 404. No cart found.",
        });
      }
      cart.products = cartDTO.products;
      await cart.save();
      return res.status(200).json({
        status: "success",
        message: "Products updated in cart",
        payload: cart,
      });
    } catch (error) {
      CustomError.createError({
        name: "Product update error",
        cause: "Error updating product",
        message: "Error trying to update the quantity of a product",
        code: EErros.UPDATE_PRODUCT_QUANTITY,
      });
      return res.render("errorPage", {
        msg: "Error 500. Error updating product.",
      });
    }
  }

  async productToDeleteById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        CustomError.createError({
          name: "Cart search error",
          cause: "No cart found",
          message: "Error trying to find a cart",
          code: EErros.CART_NOT_FOUND,
        });
        return res.render("errorPage", {
          msg: "Error 404. No cart found.",
        });
      }
      const productToDeleteIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (productToDeleteIndex === -1) {
        CustomError.createError({
          name: "Product search error",
          cause: "No product found",
          message: "Error trying to find a product",
          code: EErros.PRODUCT_NOT_FOUND,
        });
        return res.render("errorPage", {
          msg: "Error 404. No product found.",
        });
      }
      cart.products.splice(productToDeleteIndex, 1);
      await cart.save();
      return res.status(200).json({
        status: "success",
        message: "Product deleted from cart",
        payload: cart,
      });
    } catch (error) {
      CustomError.createError({
        name: "Cart product delete error",
        cause: "Could not delete the product",
        message: "Error trying to delete a product for cart",
        code: EErros.CART_PRODUCT_DELETE,
      });
      return res.render("errorPage", { msg: "Cart not found" });
    }
  }

  async getOneAndUpdate(req, res) {
    try {
      const { cid, pid } = req.params;
      const productToAdd = await productsService.getById(pid);
      if (!productToAdd) {
        CustomError.createError({
          name: "Product search error",
          cause: "No product found",
          message: "Error trying to find a product",
          code: EErros.PRODUCT_NOT_FOUND,
        });
        return res.render("errorPage", { msg: "Sorry, product not found." });
      }

      const cart = await cartsService.getById(cid);
      if (!cart) {
        CustomError.createError({
          name: "Cart search error",
          cause: "No cart found",
          message: "Error trying to find a cart",
          code: EErros.CART_NOT_FOUND,
        });
        return res
          .render("errorPage", { msg: "Sorry, cart does not exist." });
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

      return res.status(201).redirect("/cart/" + cid);
    } catch (error) {
      CustomError.createError({
        name: "Add product error",
        cause: "Could not add product",
        message: "Error trying to add a product to cart",
        code: EErros.CART_NOT_FOUND,
      });
      return res.render("errorPage", {
        msg: "Error 500. Failed to add product to cart.",
      });
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
        CustomError.createError({
          name: "Cart search error",
          cause: "No cart found",
          message: "Error trying to find a cart",
          code: EErros.CART_NOT_FOUND,
        });
        return res.render("errorPage", { msg: "Cart not found" });
      }
    } catch {
      CustomError.createError({
        name: "Cart search error",
        cause: "Failed to get cart",
        message: "Error trying to get a cart",
        code: EErros.CART_GET_ERROR,
      });
      return res.render("errorPage", { msg: "Failed to get cart" });
    }
  }

  async create(req, res) {
    try {
      const cart = await cartsService.create();
      return res.status(200).json({
        status: "success",
        message: "Cart created successfully",
        payload: cart,
      });
    } catch {
      CustomError.createError({
        name: "Cart create error",
        cause: "Failed to create cart",
        message: "Error trying to create a cart",
        code: EErros.CART_CREATE_ERROR,
      });
      return res.render("errorPage", { msg: "Failed to create cart" });
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
      console.log(user);
      const cid = req.params.cid;
      const mainTitle = "CART";
      const cart = await cartsService.getById(cid);
      if (!cart) {
        return res.status(404).render("errorPage", { msg: "Cart not found" });
      }
      return res
        .status(200)
        .render("cart", { cart: cart.toObject(), mainTitle, user });
    } catch {
        CustomError.createError({
          name: "Cart render error",
          cause: "Cart could not be rendered",
          message: "Error trying to render a cart",
          code: EErros.CART_RENDER_ERROR,
        });
        return res.render("errorPage", { msg: "Failed to render cart" });
    }
  }

  async purchase(req, res) {
    try {
      const cid = req.params.cid;
      const userEmail = req.body.email;
  
      const cart = await cartsService.getById(cid);
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Cart does not exist",
          payload: {},
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
        const ticket = await ticketsService.create(code, purchase_datetime, totalPrice, purchaser);
  
        return res.status(200).json({
          status: "success",
          message: "Purchase successfully processed",
          payload: ticket,
          noStock: cart.products,
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "All selected products have insufficient stock",
          payload: {},
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to process purchase",
        payload: {},
      });
    }
  }
}

export const cartsController = new CartsController();
