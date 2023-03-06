const express = require("express");
const route = express.Router();
const GajiController = require("../controllers/GajiController");

route.get("/", GajiController.getGaji);
route.post("/", GajiController.addGaji);
route.get("/:id", GajiController.getOneGaji);
route.delete("/:id", GajiController.deleteGaji);
route.put("/:id", GajiController.editGaji);

module.exports = route;