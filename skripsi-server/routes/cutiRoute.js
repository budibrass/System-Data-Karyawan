const express = require("express");
const route = express.Router();
const CutiController = require("../controllers/CutiController");
const upload = require("../middlewares/upload");

route.post("/", upload.single("berkas"), CutiController.addCuti); 
route.get("/", CutiController.getCuti);
route.post("/", CutiController.addCuti);
route.get("/:id", CutiController.getOneCuti);
route.put("/:id", CutiController.editGaji);

module.exports = route;