import { expect } from "chai";
// PRODUCT MODEL TESTING:
import importModels from "../src/DAO/factory.js";

const models = await importModels();
const productsModel = models.products;

// TESTING GROUPS:

describe("PRODUCTS model test:", function () {
  this.timeout(5000);
  let productCreatedId;

  it("Creating a NEW PRODUCT test", async () => {
    const productCreated = await productsModel.create(
      "testName",
      "testDescription",
      9999,
      "testThumbnail",
      "testCode",
      9999,
      "testCategory",
      true,
      "testOwner"
    );
    productCreatedId = productCreated._id;
    expect(productCreated._id).to.exist;
  });

  it("Reading ALL PRODUCTS test", async () => {
    const productsFound = await productsModel.getAll();
    expect(productsFound).to.be.an("array");
  });

  it("Updating a PRODUCT test", async () => {
    if (!productCreatedId) {
      throw new Error("Product was never created");
    }
    const productId = productCreatedId;
    const productModified = await productsModel.getByIdAndUpdate(productId, {
      price: 200,
    });
    expect(productModified).to.be.an("object");
  });

  it("Deleting a PRODUCT test", async () => {
    if (!productCreatedId) {
      throw new Error("Product was never created");
    }
    const productId = productCreatedId;
    const productDeleted = await productsModel.getByIdAndDelete(productId);
    expect(productDeleted).to.be.an("object");
  });

  after(function () {
    process.exit();
  });
});
