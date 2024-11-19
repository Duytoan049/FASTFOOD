const express = require("express");
const cors = require("cors");

const JSend = require("./jsend");
const contactsRouter = require("./routes/customers.router");
const productsRouter = require("./routes/products.router");
// const ordersRouter = require("./routes/orders.router");
// const orderDetail = require("./routes/ordersdetail.router");
const usersRouter = require("./routes/users.router");
const orderRouter = require("./routes/orders.router");
const session = require("express-session");

const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
const { specs, swaggerUi } = require("./docs/swagger");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "mySuperSecretKey12345",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/public", express.static("public"));

contactsRouter.setup(app);
productsRouter.setup(app);
// ordersRouter.setup(app);
// orderDetail.setup(app);
usersRouter.setup(app);
orderRouter.setup(app);

app.use(resourceNotFound);
app.use(handleError);

module.exports = app;
