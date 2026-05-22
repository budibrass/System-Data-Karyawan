const express = require("express");
const route = express.Router();
const UserController = require("../controllers/UserController");

route.get("/", UserController.getUsers);
route.post("/register", UserController.register);
route.post("/login", UserController.login);
route.get("/:email", UserController.getOneUser);
route.put("/:email", UserController.editPassword);
// route.delete("/:id", UserController.deleteUser);

module.exports = route;