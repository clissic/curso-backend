import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    const productsString = fs.readFileSync("src/DAO/memory/products.json", "utf-8");
    const products = JSON.parse(productsString);
    this.products = products;
  }

  getAll() {
    return this.products;
  }

  create(title, description, price, thumbnail, code, stock, category) {
    if (!title) {
      return console.error("A title is required");
    }
    if (!description) {
      return console.error("A description is required");
    }
    if (!price) {
      return console.error("A price is required");
    }
    if (!category) {
      return console.error("A category is required");
    }
    if (!code) {
      return console.error("A code is required");
    }
    if (!stock) {
      return console.error("A number of stock is required");
    }

    const notNewProductCode = this.products.find((prod) => prod.code === code);
    if (notNewProductCode) {
      return console.error("This code already exist");
    }

    let actualId = 0;
    this.products.forEach((prod) => {
      if (parseInt(prod.id) > actualId) {
        actualId = prod.id;
      }
    });
    actualId++;

    const addedProduct = {
      id: actualId.toString(),
      title,
      description,
      price: parseInt(price),
      thumbnail,
      code,
      stock: parseInt(stock),
      status: true,
      category
    };

    this.products.push(addedProduct);
    const productsString = JSON.stringify(this.products);
    fs.writeFileSync("src/DAO/memory/products.json", productsString);
    return productsString
  }

  getById(id) {
    const productsString = fs.readFileSync("src/DAO/memory/products.json", "utf-8");
    const products = JSON.parse(productsString);
    this.products = products;
    const product = products.find((prod) => prod.id === id);
    if (product) {
      return product;
    } else {
      return console.error("Not found");
    }
  }

  getByIdAndUpdate(id, dataToUpdate) {
    const productToUpdate = this.products.findIndex((prod) => prod.id === id);
    const updatedProduct = {
      ...this.products[productToUpdate],
      ...dataToUpdate,
      id
    };
    this.products[productToUpdate] = updatedProduct;
    const updatedProductsString = JSON.stringify(this.products);
    fs.writeFileSync("src/DAO/memory/products.json", updatedProductsString);
    return updatedProductsString
  }

  getByIdAndDelete(id) {
    const productToDelete = this.products.findIndex((prod) => prod.id === id);
    if (productToDelete === -1) {
        return console.error("Product does not exist")
    }
    this.products.splice(productToDelete, 1);
    const productsString = JSON.stringify(this.products);
    fs.writeFileSync("src/DAO/memory/products.json", productsString);
    return productsString
  }
}

export const productsModel = new ProductManager("src/DAO/memory/products.json");