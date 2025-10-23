import mongoose from "mongoose";
import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// ============================================
// ✅ Админаас зөвхөн list харж байгаа нь шүү
// ============================================

export const getResorts = async (req, res) => {
  try {
    const resorts = await Resort.aggregate([
      {
        $lookup: {
          from: "files",           // File collection
          localField: "_id",       // Resort._id
          foreignField: "resortsId", // File.resortsId
          as: "files"
        }
      },
      {
        $addFields: {
          image: { 
            $arrayElemAt: [ "$files.images", 0 ] // эхний зураг л авна
          }
        }
      },
      {
        $project: {
          files: 0, // files array-г нуух
          __v: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: resorts.length,
      resorts
    });
  } catch (err) {
    console.error("❌ getResorts алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




// ============================================
// ✅ GET resort by ID
// ============================================
export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    // Resort-д холбогдсон файлуудыг авчрах
    const files = await File.find({ resortsId: resort._id });

    res.json({ resort, files });
  } catch (err) {
    console.error("❌ getResortById алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ✅ CREATE new resort
// ============================================

export const createResort = async (req, res) => {
  try {
    const { name, description, price, location } = req.body;
    console.log("create begin");

    // 1️⃣ Resort үүсгэх
    const newResort = new Resort({
      name,
      description,
      price,
      location,
    });

    const savedResort = await newResort.save();

    // --- newFile-ийг гадна зарлах ---
    let newFile;

    // 2️⃣ Файлууд хадгалах
    if (req.files && (req.files.images || req.files.videos)) {
      const images =
        req.files.images?.map((f) => `/uploads/resorts/${f.filename}`) || [];

      const videos =
        req.files.videos?.map((f) => `/uploads/resorts/${f.filename}`) || [];

      newFile = new File({
        resortsId: savedResort._id,
        images,
        videos,
      });

      await newFile.save();
    }

    res.status(201).json({
      success: true,
      message: "🏕️ Resort амжилттай нэмэгдлээ",
      resort: savedResort,
    });
  } catch (error) {
    console.error("❌ Resort үүсгэхэд алдаа:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ============================================
// ✅ UPDATE resort
// ============================================
export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, location } = req.body;
    console.log('req.body',req.body)
    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    // Мэдээлэл шинэчлэх
    resort.name = name || resort.name;
    resort.description = description || resort.description;
    resort.price = price || resort.price;
    resort.location = location || resort.location;
    console.log('resort',resort)
    await resort.save();

    

    // Хэрвээ шинэ файлууд ирсэн бол хадгалах
    // if (req.body.existingImages) {
    //     for (const file in req.body.existingImages) {
    //       console.log("file", file)
    //       const fileUrl = `/uploads/resorts/${file.filename}`;
    //       const newFile = new File({
    //         resortsId: resort._id,
    //         filename: file.originalname,
    //         size: file.size,
    //         mimetype: file.mimetype,
    //         image: fileUrl,
    //       });
    //       await newFile.save();
    //     }

    //бүх зурагаа хадгалаад зараагийнхан зургийг нь устгах
    const filesD = await File.find({ resortsId: id });
    for (const file of filesD) {
      const filePath = path.join("public", file.image || file.video);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log("🗑️ Файл устгасан:", filePath);
        } catch (err) {
          console.error("⚠️ Файл устгах үед алдаа:", err);
        }
      }

      await File.findByIdAndDelete(file._id);
    }

    await Resort.findByIdAndDelete(id);
    const existingImages = JSON.parse(req.body.existingImages);

    for (let i = 0; i < existingImages.length; i++) {
      console.log("Url", existingImages[i]);

      const newFile = new File({
          resortsId: resort._id,
          image: existingImages[i],
        });

        await newFile.save();
    }
    

    if (req.files.videos) {
      for (const file of req.files.videos) {
        const fileUrl = `/uploads/resorts/${file.filename}`;
        const newFile = new File({
          resortsId: resort._id,
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          video: fileUrl,
        });
        await newFile.save();
      }      
    }

    const files = await File.find({ resortsId: resort._id });

    res.json({
      success: true,
      message: "🏝️ зураг шинэчлэгдлээ",
      resort,
      files,
    });
  } catch (err) {
    console.error("❌ Resort шинэчлэхэд алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ✅ DELETE Resort + related files
// ============================================
export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Буруу ID формат байна" });
    }

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    // Холбогдсон файлууд устгах
    const files = await File.find({ resortsId: id });

    for (const file of files) {
      const filePath = path.join("public", file.image || file.video);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log("🗑️ Файл устгасан:", filePath);
        } catch (err) {
          console.error("⚠️ Файл устгах үед алдаа:", err);
        }
      }

      await File.findByIdAndDelete(file._id);
    }

    await Resort.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "🗑️ Resort болон холбогдсон файлууд устгагдлаа",
    });
  } catch (err) {
    console.error("❌ Resort устгах үед алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};
