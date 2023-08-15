import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { fakerES as faker } from "@faker-js/faker";

dotenv.config();

export default {
  persistence: process.env.PERSISTENCE,
};

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.urlLoremFlickr(),
    code: faker.number.int(),
    stock: faker.number.int(200),
    category: faker.commerce.department(),
  };
};
