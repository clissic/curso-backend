import compression from "compression";
import MongoStore from "connect-mongo";
import cors from "cors";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import passport from "passport";
import path from "path";
import { __dirname } from "./config.js";
import env from "./config/env.config.js";
import { iniPassport } from "./config/passport.config.js";
import errorHandler from "./middlewares/error.js";
import { cartRouter } from "./routes/cart.html.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { loggerTest } from "./routes/logger.test.routes.js";
import { loginRouter } from "./routes/login.html.routes.js";
import { mockingTest } from "./routes/mocking.test.routes.js";
import { products } from "./routes/products.html.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProducts } from "./routes/real-time-products.routes.js";
import { sessionsRouter } from "./routes/session.routes.js";
import { signupRouter } from "./routes/signup.html.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { logger } from "./utils/logger.js";
import { connectSocketServer } from "./utils/sockets-server.js";

const app = express();
const PORT = env.port;
const MONGO_PASSWORD = env.mongoPassword;

const httpServer = app.listen(PORT, () => {
  logger.info(
    `App running on ${__dirname} - server http://localhost:${PORT}`
  );
});

connectSocketServer(httpServer);

app.use(session({
  secret: "A98dB973kWpfAF099Kmo",
  resave: true, 
  saveUninitialized: true, 
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://joaquinperezcoria:${MONGO_PASSWORD}@cluster0.zye6fyd.mongodb.net/?retryWrites=true&w=majority`,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 15000
  })
}));

app.use(cors());
app.use(compression());

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// CONFIG PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

// PLANTILLAS
app.use("/", loginRouter)
app.use("/signup", signupRouter)
app.use("/products", products);
app.use("/chat", chatRouter);
app.use("/realtimeproducts", realTimeProducts);
app.use("/cart", cartRouter);
app.get("/error-auth", (req, res) => {
  return res
    .status(400)
    .render("errorPage", {msg: "Authorization error."})
});

// TESTING
app.use("/mockingproducts", mockingTest)
app.use("/loggerTest", loggerTest)

app.get("*", (req, res) => {
  return res
    .status(404)
    .render("errorPage", {msg: "Error 404, page not found."})
});

app.use(errorHandler)