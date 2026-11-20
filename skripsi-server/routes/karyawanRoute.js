const express = require("express");
const route = express.Router();
const KaryawanController = require("../controllers/KaryawanController");

const upload = require("../middlewares/upload");

route.get("/", KaryawanController.getKaryawan);

route.post("/", upload.single("fotoProfile"), KaryawanController.addKaryawan);

route.get("/email/:email", KaryawanController.getOneKaryawanEmail);

// Gambar QR code karyawan
route.get("/:id/qrcode", KaryawanController.getQrcode);

route.get("/:id", KaryawanController.getOneKaryawan);
route.delete("/:id", KaryawanController.deleteKaryawan);

route.put("/:id", upload.single("fotoProfile"), KaryawanController.editKaryawan);

module.exports = route;