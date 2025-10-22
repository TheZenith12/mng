import multer from "multer";
import path from "path";
import fs from "fs";

// 📁 Upload хадгалах зам
const uploadPath = "public/uploads/resorts"; // ✅ 'uploads' гэж бичих нь илүү зөв, нийтлэг

// 📂 Хэрвээ хавтас байхгүй бол автоматаар үүсгэнэ
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Upload folder created:", uploadPath);
}

// ⚙️ Multer storage тохиргоо
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// ✅ Нэг файл upload хийх middleware
export const uploadSingle = multer({ storage }).single("file");

// ✅ Олон зураг, видео upload хийх middleware
export const uploadResortFiles = multer({ storage }).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 10 },
]);

// ✅ Ерөнхий upload (default export)
const upload = multer({ storage });
export default upload;
