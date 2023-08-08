import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import CartDTO from "./DTO/carts.dto.js";

class CartsController {
  async deleteAllProdInCart(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Cart does not exist",
          payload: {},
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
      return res.status(500).json({
        status: "error",
        message: "Failed to delete products from cart",
        payload: {},
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
        return res.status(404).json({
          status: "error",
          message: "Cart does not exist",
          payload: {},
        });
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (productIndex === -1) {
        return res.status(404).json({
          status: "error",
          message: "Product does not exist in the cart",
          payload: {},
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
      return res.status(500).json({
        status: "error",
        message: "Failed to update product quantity in cart",
        payload: {},
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
        return res.status(404).json({
          status: "error",
          message: "Cart does not exist",
          payload: {},
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
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Failed to update products in cart",
        payload: {},
      });
    }
  }

  async productToDeleteById(req, res) {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const cart = await cartsService.getById(cid);
      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Cart does not exist",
          payload: {},
        });
      }
      const productToDeleteIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (productToDeleteIndex === -1) {
        return res.status(404).json({
          status: "error",
          message: "Product does not exist in the cart",
          payload: {},
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
      return res.status(500).json({
        status: "error",
        message: "Failed to delete product from cart",
        payload: {},
      });
    }
  }

  async getOneAndUpdate(req, res) {
    try {
      const { cid, pid } = req.params;
      const productToAdd = await productsService.getById(pid);
      if (!productToAdd) {
        return res
          .status(404)
          .render("errorPage", { msg: "Sorry, product not found." });
      }

      const cart = await cartsService.getById(cid);
      if (!cart) {
        return res
          .status(404)
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
      console.log(error);
      return res.status(500).render("errorPage", {
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
        return res.status(404).json({
          status: "error",
          message: "Cart does not exist",
          payload: {},
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Failed to get cart", payload: {} });
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
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to create cart",
        payload: {},
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
        return res.status(404).render("errorPage", { msg: "Cart not found" });
      }
      return res
        .status(200)
        .render("cart", { cart: cart.toObject(), mainTitle, user });
    } catch (error) {
      return res
        .status(500)
        .render("errorPage", { msg: "Error 500. Cart could not be rendered." });
    }
  }
}

export const cartsController = new CartsController();
