class ProductDTO {
  constructor(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status,
    owner
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.category = category;
    this.status = status;
    this.owner = owner;
  }
}

export default ProductDTO;
