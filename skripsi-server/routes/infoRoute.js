const express = require("express");
const route = express.Router();
const InfoController = require("../controllers/InfoController");

// 🌟 1. IMPORT MIDDLEWARE MULTER DI SINI
// Sesuaikan '../middlewares/upload' dengan lokasi file config multermemu
const upload = require("../middlewares/upload"); 

route.get("/", InfoController.getInfo);

// 🌟 2. SISIPKAN upload.single("gambarInfo") DI TENGAH ROUTE POST INI
route.post("/", upload.single("gambarInfo"), InfoController.addInfo);

route.delete("/:id", InfoController.deleteInfo);
route.put("/:id", InfoController.editInfo);
route.get("/:id", InfoController.getOneInfo);

module.exports = route;