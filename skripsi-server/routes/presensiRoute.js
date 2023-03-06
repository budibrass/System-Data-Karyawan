const express = require("express");
const route = express.Router();
const presensiRoute = require("../controllers/PresensiController");

route.get("/", presensiRoute.getPresensi)
route.post("/", presensiRoute.pushClock);
route.get("/:id", presensiRoute.getOnePresensi)
route.put("/:id", presensiRoute.editPushClock)

module.exports = route;