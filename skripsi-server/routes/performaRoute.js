const express = require("express");
const route = express.Router();
const PerformaController = require("../controllers/PerformaController");

route.get("/", PerformaController.getPerforma);
route.post("/", PerformaController.addPerforma);
route.delete("/:id", PerformaController.deletePerforma);
route.put("/:id", PerformaController.editPerforma);
route.get("/:id", PerformaController.getOnePerforma);

module.exports = route;