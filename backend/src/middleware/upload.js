import multer from "multer";
import path from "path";
import fs from "fs";

// Хадгалах зам
const uploadPath = "public/uploads/resorts";

// Хавтас байхгүй бол автоматаар үүсгэнэ
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer тохиргоо
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // жишээ: 1729491023123.jpg
  },
});

export const upload = multer({ storage });
