const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        path.parse(file.originalname).name +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  });
  
  const upload = multer({ storage: storage });
  
  route.post(`/`, upload.single("photo"), (req, res) => {
    // save filename nya ke database
    // return url ke user
  
    let finalImageURL =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
  
    res.json({ image: finalImageURL });
  });

module.exports = route;