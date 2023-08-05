import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
}

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);