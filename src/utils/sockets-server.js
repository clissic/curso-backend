import { Server } from "socket.io";
import { cartsController } from "../controllers/carts.controller.js";
import { productsController } from "../controllers/products.controller.js";
import { productsService } from "../services/products.service.js";
import { MsgMongoose } from "../DAO/models/mongoose/msgs.mongoose.js";

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("Connected to socket " + socket.id);
  });
  // TEST CHAT
  socketServer.on("connection", (socket) => {
    socket.on("msg_front_to_back", async (msg) => {
      try {
        await MsgMongoose.create(msg);
      } catch (e) {
        console.log(e);
      }
      try {
        const msgs = await MsgMongoose.find({});
        socketServer.emit("listado_de_msgs", msgs);
      } catch (e) {
        console.log(e);
      }
    });
  });
  // ELIMINAR PRODUCTO
  socketServer.on("connection", (socket) => {
    socket.on("productIdToBeRemoved", async (id) => {
      try {
        const productDeleted = await productsController.findByIdAndDelete(id);
        const deletedAndUpdatedProducts = await productsController.findAll();
        socketServer.emit(
          "productDeleted",
          deletedAndUpdatedProducts,
          productDeleted
        );
      } catch (error) {
        console.error(error);
        socketServer.emit("productDeletionError", error.message);
      }
    });
    // AGREGAR PRODUCTO
    socket.on("addProduct", async (newProduct) => {
      try {
        const createdProduct = await productsService.create(newProduct);
        const createdAndUpdatedProducts = await productsController.findAll();
        socket.emit("productAdded", createdAndUpdatedProducts, createdProduct);
      } catch (error) {
        console.error(error);
        socket.emit("productCreationError", error.message);
      }
    });
  });

  // AGREGAR PRODUCTO AL CARRITO
  socketServer.on("connection", (socket) => {
    socket.on("productIdToBeAdded", async (id) => {
      try {
        const findCart = await cartsController.findById("649b9ae2f6e9f77b88bbcd5c");
        const cid = findCart._id;
        const pid = id;
        const productToAdd = await productsController.findById(pid);
        if (!productToAdd) {
          return res
            .status(404)
            .json({
              status: "error",
              message: "Product does not exist",
              payload: {},
            });
        }
        const cart = await cartsController.findById(cid);
        if (!cart) {
          return res
            .status(404)
            .json({
              status: "error",
              message: "Cart does not exist",
              payload: {},
            });
        }
        const existingProduct = cart.products.find(
          (product) => product.product.toString() === pid
        );
        if (existingProduct) {
          await cartsController.findOneAndUpdate(cid, pid);
        } else {
          cart.products.push({ product: pid, quantity: 1 });
          await cart.save();
        }
        socket.emit("productAddedToCart", cart);
        console.log(cart);
      } catch (error) {
        console.error(error);
        socket.emit("productAddToCartError", error.message);
      }
    });
  });
}