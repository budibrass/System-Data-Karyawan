const express = require("express");
const route = express.Router();
const authentication = require("../middlewares/authentication");

const karyawanRoute = require("./karyawanRoute");
const presensiRoute = require("./presensiRoute");
const gajiRoute = require("./gajiRoute");
const userRoute = require("./userRoute");
const lemburRoute = require("./lemburRoute");
const cutiRoute = require("./cutiRoute");
const reimbursementRoute = require("./reimbursementRoute");
const golongaRoute = require("./golongaRoute");
const uploadRoute = require("./uploadRoute");
const projectRoute = require("./projectRoute");
const performaRoute = require("./performaRoute");
const infoRoute = require("./infoRoute");

route.use("/user", userRoute);

// SEMUA ROUTE YANG ADA DI BAWAH INI HARUS MENGGUNAKAN AUTHENTICATION
route.use(authentication);
route.use("/karyawan", karyawanRoute);
route.use("/presensi", presensiRoute);
route.use("/gaji", gajiRoute);
route.use("/lembur", lemburRoute);
route.use("/cuti", cutiRoute);
route.use("/reimbursement", reimbursementRoute);
route.use("/golongan", golongaRoute);
route.use("/upload", uploadRoute);
route.use("/project", projectRoute);
route.use("/info", infoRoute);
route.use("/performa", performaRoute);

module.exports = route;