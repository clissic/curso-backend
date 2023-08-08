import { CartsMongoose } from "./mongoose/carts.mongoose.js";

class CartModel {
    async create() {
        const cart = await CartsMongoose.create({products: []});
        return cart
    }

    async getById(cid) {
        const cart = await CartsMongoose.findById(cid).populate("products.product");
        return cart
    }

    async getOneAndUpdate(cid, pid) {
        await CartsMongoose.findOneAndUpdate(
            { _id: cid, "products.product": pid },
            { $inc: { "products.$.quantity": 1 } }
        );
    }

    async removeProduct(cid, pid) {
        await CartsMongoose.findOneAndUpdate(
            { _id: cid },
            { $pull: { products: { product: pid } } }
        );
    }

    async getAllProducts(cid) {
        const cart = await CartsMongoose.findById(cid).populate("products.product");
        if (cart) {
            return cart.products;
        }
        return [];
    }
}

export const cartsModel = new CartModel();