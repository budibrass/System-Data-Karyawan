const multer = require("multer");

// Gunakan memoryStorage agar file disimpan sementara di RAM (buffer)
// sebelum dikirim langsung ke Supabase Storage
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;