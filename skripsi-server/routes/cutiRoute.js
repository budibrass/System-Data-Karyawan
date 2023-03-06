const express = require("express");
const route = express.Router();
const CutiController = require("../controllers/CutiController");

route.get("/", CutiController.getCuti);
route.post("/", CutiController.addCuti);
route.get("/:id", CutiController.getOneCuti);
route.put("/:id", CutiController.editGaji);

module.exports = route;