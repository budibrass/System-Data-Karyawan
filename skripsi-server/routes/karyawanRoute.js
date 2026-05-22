const express = require("express");
const route = express.Router();
const KaryawanController = require("../controllers/KaryawanController");

// 🌟 1. Import middleware upload.js yang sudah Anda buat
const upload = require("../middlewares/upload");

route.get("/", KaryawanController.getKaryawan);

// 🌟 2. Tambahkan upload.single("fotoProfile") pada method POST
route.post("/", upload.single("fotoProfile"), KaryawanController.addKaryawan);

route.get("/:id", KaryawanController.getOneKaryawan);
route.delete("/:id", KaryawanController.deleteKaryawan);

// 🌟 3. Tambahkan upload.single("fotoProfile") pada method PUT
route.put("/:id", upload.single("fotoProfile"), KaryawanController.editKaryawan);

route.get("/email/:email", KaryawanController.getOneKaryawanEmail);

module.exports = route;