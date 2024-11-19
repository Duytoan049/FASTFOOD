const express = require("express");
const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/authLogin");
const router = express.Router();
module.exports.setup = (app) => {
  app.use("/api/v1/users", router);

  router.post("/signup", usersController.createUser);
  router.post("/login", usersController.getUserByUsername);
  router.post("/logout", usersController.logout);
  router.get("/profile", (req, res) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
};
