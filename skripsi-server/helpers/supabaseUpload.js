const path = require("path");

const uploadToSupabase = async (file) => {
  if (!file) return null;

  // .trim() memastikan tidak ada spasi atau enter tersembunyi dari Vercel Env
  const supabaseUrl = (process.env.SUPABASE_URL || "").trim().replace(/\/$/, "");
  const supabaseKey = (process.env.SUPABASE_SERVICE_KEY || "").trim();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL atau SUPABASE_SERVICE_KEY belum diatur");
  }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = uniqueSuffix + path.extname(file.originalname);
  const bucketName = "uploads";

  // Upload langsung ke Supabase Storage API
  const uploadEndpoint = `${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`;

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
      "Content-Type": file.mimetype || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file.buffer,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Supabase Upload Error (${response.status}): ${errText}`);
  }

  // Kembalikan URL publik yang siap disimpan ke database
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;
};

module.exports = uploadToSupabase;
