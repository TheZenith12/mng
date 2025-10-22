import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";
import path from "path";
import fs from "fs";

// ============================================
// ✅ GET all files
// ============================================
export const getFiles = async (req, res) => {
  try {
    const files = await File.find().populate("resort").sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("❌ getFiles алдаа:", err);
    res.status(500).json({ message: err.message });
  }z
};z

// ============================================
// ✅ Upload multiple (images/videos) for resort
// ============================================
export const uploadFile = async (req, res) => {
  try {
    const { resortId } = req.body;
    if (!resortId) {
      return res.status(400).json({ message: "resortId шаардлагатай." });
    }

    // multer -> upload.fields([{name: 'images'}, {name: 'videos'}])
    const images = (req.files?.images || []).map(f => `/uploads/resorts/${f.filename}`);
    const videos = (req.files?.videos || []).map(f => `/uploads/resorts/${f.filename}`);

    // update эсвэл шинээр үүсгэх (upsert)
    const update = {};
    if (images.length) update.$push = { ...(update.$push || {}), images: { $each: images } };
    if (videos.length) update.$push = { ...(update.$push || {}), videos: { $each: videos } };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const fileDoc = await File.findOneAndUpdate({ resort: resortId }, update, options);

    // Cover image тохируулах (эхний зураг)
    if (fileDoc && !fileDoc.coverImage && fileDoc.images?.length) {
      fileDoc.coverImage = fileDoc.images[0];
      await fileDoc.save();
    }

    res.status(201).json({
      success: true,
      message: "📸 Файлууд амжилттай хадгалагдлаа",
      file: fileDoc,
    });
  } catch (err) {
    console.error("❌ uploadFilesForResort:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ✅ Delete file document + physical files
// ============================================
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Файлын физик замуудыг устгана
    const allFiles = [...(file.images || []), ...(file.videos || [])];
    allFiles.forEach((filePath) => {
      const fullPath = path.join(process.cwd(), "public", filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // Resort-оос холбоог устгана
    await Resort.updateMany({ files: id }, { $pull: { files: id } });

    // MongoDB-оос устгана
    await File.findByIdAndDelete(id);

    res.json({ success: true, message: "🗑️ Файл амжилттай устгагдлаа" });
  } catch (err) {
    console.error("❌ deleteFile алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
