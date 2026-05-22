const express = require("express");
const route = express.Router();
const ReimbursementController = require("../controllers/ReimbursementController");

// 🌟 1. IMPORT MIDDLEWARE MULTER DI SINI
const upload = require("../middlewares/upload"); 

route.get("/", ReimbursementController.getReimbursement);

// 🌟 2. SISIPIKAN upload.single("berkas") DI TENGAH ROUTE POST INI
route.post("/", upload.single("berkas"), ReimbursementController.addReimbursement);

route.get("/:id", ReimbursementController.getOneReimbursement);
route.put("/:id", ReimbursementController.editReimbursement);
route.delete("/:id", ReimbursementController.deleteReimbursement);

module.exports = route;