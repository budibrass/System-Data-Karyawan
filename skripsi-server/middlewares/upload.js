// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Deteksi apakah aplikasi berjalan di Railway
// // Railway otomatis memberikan variable 'RAILWAY_SERVICE_NAME'
// const isRailway = process.env.RAILWAY_SERVICE_NAME;

// // Jika di lokal, gunakan folder 'public/uploads' di proyek Anda
// const uploadDir = isRailway ? "/app/uploads" : "public/uploads";

// // Pastikan foldernya ada (untuk mencegah error folder tidak ditemukan)
// if (!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Gunakan '/tmp/uploads' jika di Vercel, dan 'public/uploads' jika di laptop (lokal)
const uploadDir = process.env.VERCEL ? "/tmp/uploads" : "public/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
