const express = require("express");
const route = express.Router();
const KaryawanController = require("../controllers/KaryawanController");

route.get("/", KaryawanController.getKaryawan);
route.post("/", KaryawanController.addKaryawan);
route.get("/:id", KaryawanController.getOneKaryawan);
route.delete("/:id", KaryawanController.deleteKaryawan);
route.put("/:id", KaryawanController.editKaryawan);
route.get("/email/:email", KaryawanController.getOneKaryawanEmail);

module.exports = route;