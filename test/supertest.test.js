import chai from "chai";
import supertest from "supertest";

// CHAI CONFIG
const expect = chai.expect;

// SUPERTEST CONFIG
const requester = supertest("http://127.0.0.1:8080");

describe("Starting SUPERTEST API process:", function () {
  this.timeout(5000);
  let productId;
  let cartId;
  // ENDPOINT PRODUCTS
  describe("Endpoint PRODUCTS:", () => {
    it("POST: CREATE PRODUCT", async () => {
      const newProduct = {
        title: "testTitle",
        description: "testDescription",
        price: 9999,
        thumbnail: "testThumbnail",
        code: "ABC12345",
        stock: 9999,
        category: "testCategory",
        status: true,
        owner: "testOwner",
      };
      const response = await requester.post("/api/products").send(newProduct);
      const { status, ok, _body } = response;
      productId = _body.payload._id;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.property("_id");
    });

    it("GET: READ ALL PRODUCTS", async () => {
      const response = await requester.get("/api/products");
      const { status, ok, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload.paginatedProd).to.be.an("array");
      expect(_body).to.have.property("msg", "Products list");
    });

    it("PUT: UPDATE PRODUCT", async () => {
      if (!productId) {
        throw new Error("Product was never created");
      }
      const dataToUpdate = { price: 404 };
      const response = await requester
        .put(`/api/products/${productId}`)
        .send(dataToUpdate);
      const { status, ok, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.have.property(
        "message",
        "Product modified successfully"
      );
    });

    it("DELETE: DELETE PRODUCT", async () => {
      if (!productId) {
        throw new Error("Product was never created");
      }
      const response = await requester.delete(`/api/products/${productId}`);
      const { status, ok, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.have.property("message", "Product deleted successfully");
    });
  });

  // ENDPOINT CARTS
  describe("Endpoint carts", () => {
    it("POST: CREATE CART", async () => {
      const response = await requester.post("/api/carts");
      const { status, ok, _body } = response;
      cartId = _body.payload._id;
      expect(status).to.equal(201);
      expect(_body).to.have.property("message", "Cart created successfully");
    });

    it("GET: READ PRODUCTS IN CART", async () => {
      if (!cartId) {
        throw new Error("Cart was never created");
      }
      const response = await requester.get(`/api/carts/${cartId}`);
      const { status, ok, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.have.property("message", "Cart found");
    });

    it("PUT: ADD PRODUCT AND UPDATE", async () => {
      if (!cartId) {
        throw new Error("Cart was never created");
      }
      const dataToUpdate = { quantity: 22 };
      const prodToUpdateId = "648145085014bca309a7e405";
      await requester.post(`/api/carts/${cartId}/products/${prodToUpdateId}`);
      const response = await requester
        .put(`/api/carts/${cartId}/products/${prodToUpdateId}`)
        .send(dataToUpdate);
      const { status, ok, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.have.property(
        "message",
        "Product quantity updated in cart"
      );
    });

    it("DELETE: DELETE CART", async () => {
      if (!cartId) {
        throw new Error("Cart was never created");
      }
      const response = await requester.delete(`/api/carts/${cartId}/delete`);
      const { status, ok, _body } = response;
      expect(status).to.equal(200);
      expect(_body).to.have.property("message", "Cart deleted successfully");
    });
  });

  // ENDPOINT SESSIONS
  describe("Endpoint sessions", () => {});
});
