const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const uploadToSupabase = async (file) => {
  if (!file) return null;

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = uniqueSuffix + path.extname(file.originalname);

  const { error } = await supabase.storage
    .from("uploads")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Ambil URL publiknya
  const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
  return data.publicUrl;
};

module.exports = uploadToSupabase;
