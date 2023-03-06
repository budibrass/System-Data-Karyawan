const express = require("express");
const route = express.Router();
const LemburController = require("../controllers/LemburController");

route.get("/", LemburController.getLembur);
route.post("/", LemburController.addLembur);
route.get("/:id", LemburController.getOneLembur);
route.put("/:id", LemburController.editLembur);

module.exports = route;