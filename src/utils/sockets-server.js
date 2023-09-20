import { Server } from "socket.io";
import { MsgMongoose } from "../DAO/models/mongoose/msgs.mongoose.js";
import { cartsController } from "../controllers/carts.controller.js";
import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { logger } from "./logger.js";

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    logger.info("Connected to socket " + socket.id);
    
    // TEST CHAT
    socket.on("msg_front_to_back", async (msg) => {
      try {
        await MsgMongoose.create(msg);
      } catch (e) {
        logger.info(e);
      }
      try {
        const msgs = await MsgMongoose.find({});
        socketServer.emit("listado_de_msgs", msgs);
      } catch (e) {
        logger.info(e);
      }
    });

    // ELIMINAR PRODUCTO
    socket.on("productIdToBeRemoved", async (id) => {
      try {
        const productDeleted = await productsService.getByIdAndDelete(id);
        const deletedAndUpdatedProducts = await productsService.getAll();
        socketServer.emit(
          "productDeleted",
          deletedAndUpdatedProducts,
          productDeleted
        );
      } catch (error) {
        logger.info(error);
        socketServer.emit("productDeletionError", error.message);
      }
    });

    // AGREGAR PRODUCTO AL CARRITO
    socket.on("productIdToBeAdded", async (id) => {
      try {
        const findCart = await cartsController.getById(
          "649b9ae2f6e9f77b88bbcd5c"
        );
        const cid = findCart._id;
        const pid = id;
        const productToAdd = await productsService.getById(pid);
        if (!productToAdd) {
          return res.status(404).json({
            status: "error",
            message: "Product does not exist",
            payload: {},
          });
        }
        const cart = await cartsController.getById(cid);
        if (!cart) {
          return res.status(404).json({
            status: "error",
            message: "Cart does not exist",
            payload: {},
          });
        }
        const existingProduct = cart.products.find(
          (product) => product.product.toString() === pid
        );
        if (existingProduct) {
          await cartsController.getOneAndUpdate(cid, pid);
        } else {
          cart.products.push({ product: pid, quantity: 1 });
          await cart.save();
        }
        logger.info(JSON.stringify(cart));
        socket.emit("productAddedToCart", cart);
      } catch (error) {
        logger.info(error);
        socket.emit("productAddToCartError", error.message);
      }
    });

    // ELIMINA UN PRODUCTO DEL CARRITO
    socket.on("productIdToBeRemovedFromCart", async (pid, cid) => {
      try {
        const productDeleted = await cartsService.removeProduct(cid, pid);
        const deletedAndUpdatedProducts = await cartsService.getAllProducts(cid);
        socketServer.emit(
          "productDeletedFromCart",
          deletedAndUpdatedProducts,
          productDeleted
        );
      } catch (error) {
        logger.info(error);
        socketServer.emit("productDeletionError", error.message);
      }
    });
  });
}
