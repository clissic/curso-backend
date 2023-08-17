import EErros from "../services/errors/enums.js";

export default (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EErros.CART_NOT_FOUND:
      res
        .status(404)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.CART_GET_ERROR:
      res
        .status(500)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.CART_PRODUCT_DELETE:
      res
        .status(500)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.PRODUCT_NOT_FOUND:
      res
        .status(404)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.UPDATE_PRODUCT_QUANTITY:
      res
        .status(500)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.CART_ADD_PRODUCT:
      res
        .status(500)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.CART_CREATE_ERROR:
      res
        .status(500)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.CART_RENDER_ERROR:
      res
        .status(500)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    case EErros.PRODUCT_INSUFICIENT_STOCK:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;

    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
