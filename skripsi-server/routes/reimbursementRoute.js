const express = require("express");
const route = express.Router();
const ReimbursementController = require("../controllers/ReimbursementController");

route.get("/", ReimbursementController.getReimbursement);
route.post("/", ReimbursementController.addReimbursement);
route.get("/:id", ReimbursementController.getOneReimbursement);
route.put("/:id", ReimbursementController.editReimbursement);
route.delete("/:id", ReimbursementController.deleteReimbursement);

module.exports = route;