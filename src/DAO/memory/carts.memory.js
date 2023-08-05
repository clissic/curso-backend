import fs from "fs";

class CartManager {
  constructor() {
    this.carts = [];
    const cartsString = fs.readFileSync("src/DAO/memory/carts.json", "utf-8");
    const carts = JSON.parse(cartsString);
    this.carts = carts;
  }

  create(products) {
    let actualCId = 0;
    this.carts.forEach((cart) => {
      if (parseInt(cart.cid) > actualCId) {
        actualCId = cart.cid;
      }
    });
    actualCId++;

    const newCart = {
      cid: actualCId.toString(),
      products,
    };

    this.carts.push(newCart);
    const cartsString = JSON.stringify(this.carts);
    fs.writeFileSync("src/DAO/memory/carts.json", cartsString);
    return newCart;
  }

  getById(cid) {
    const cartsString = fs.readFileSync("src/DAO/memory/carts.json", "utf-8");
    const carts = JSON.parse(cartsString);
    this.carts = carts;
    const cart = carts.find((cart) => cart.cid === cid);
    if (cart) {
      return cart;
    } else {
      return console.error("Cart not found");
    }
  }

  getOneAndUpdate(cid, product) {
    const cart = this.getById(cid);
    const productIndex = cart.products.findIndex((p) => p.id === product.id);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += product.quantity;
    } else {
      cart.products.push(product);
    }
    const cartsString = JSON.stringify(this.carts);
    fs.writeFileSync("src/DAO/memory/carts.json", cartsString);
    return cart;
  }
}

export const cartsModel = new CartManager()