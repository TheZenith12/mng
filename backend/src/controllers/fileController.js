import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";
import path from "path";
import fs from "fs";

// ============================================
// ✅ GET all files
// ============================================
export const getFiles = async (req, res) => {
  try {
    const files = await File.find()
      .populate("resortsId") // ✅ resortsId гэж populate хийх ёстой
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("❌ getFiles алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ✅ Upload one image or video file
// ============================================
export const uploadFile = async (req, res) => {
  try {
    const { resortId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Файл илгээгээгүй байна." });
    }

    if (!resortId) {
      return res.status(400).json({ message: "resortId шаардлагатай." });
    }

    // ✅ Resort байгаа эсэхийг шалгах
    const resort = await Resort.findById(resortId);
    if (!resort) {
      return res.status(404).json({ message: "Resort олдсонгүй." });
    }

    // ✅ Файлын URL үүсгэнэ
    const fileUrl = `/uploads/resorts/${file.filename}`;

    // ✅ MongoDB-д хадгална
    const newFile = new File({
      resortsId: resortId,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      image: file.mimetype.startsWith("image") ? fileUrl : "",
      video: file.mimetype.startsWith("video") ? fileUrl : "",
    });

    await newFile.save();

    // ✅ Resort дотор file холбоно
    await Resort.findByIdAndUpdate(resortId, { $push: { files: newFile._id } });

    res.status(201).json({
      success: true,
      message: "📸 Файл амжилттай хадгалагдлаа",
      file: newFile,
    });
  } catch (err) {
    console.error("❌ Upload file error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ✅ Delete file
// ============================================
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "Файл олдсонгүй." });

    // ✅ Устгах замыг тодорхойлох
    const filePath = path.join(
      process.cwd(),
      "public",
      file.image || file.video
    );

    // ✅ Файлыг устгах
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("🗑️ Файл устгасан:", filePath);
    }

    // ✅ Resort-оос холбоог устгана
    await Resort.updateMany({ files: id }, { $pull: { files: id } });

    // ✅ MongoDB-оос устгана
    await File.findByIdAndDelete(id);

    res.json({ success: true, message: "🗑️ Файл амжилттай устгагдлаа" });
  } catch (err) {
    console.error("❌ deleteFile алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createResort = async (req, res) => {
  try {
    // Resort үүсгэх логик энд бич
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
