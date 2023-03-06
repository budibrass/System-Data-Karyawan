const express = require("express");
const route = express.Router();
const InfoController = require("../controllers/InfoController");

route.get("/", InfoController.getInfo);
route.post("/", InfoController.addInfo);
route.delete("/:id", InfoController.deleteInfo);
route.put("/:id", InfoController.editInfo);
route.get("/:id", InfoController.getOneInfo);

module.exports = route;