const express = require("express");
const route = express.Router();
const GolongaController = require("../controllers/GolongaController");

route.get("/", GolongaController.getGolongan);
route.post("/", GolongaController.addGolongan);
route.delete("/:id", GolongaController.deleteGolongan);
route.put("/:id", GolongaController.editGolongan);
route.get("/:id", GolongaController.getOneGolongan);

module.exports = route;