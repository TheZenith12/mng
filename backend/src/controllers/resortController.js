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
    const { name, description, price, location, removedImages } = req.body;
    const newImages = req.body.newImages || [];
    const newVideos = req.body.newVideos || [];

    // 🧩 removedImages parse хийх
    const parsedRemovedImages = removedImages ? JSON.parse(removedImages) : [];
    console.log("🗑️ removedImages:", removedImages);
    console.log("🗑️ parsedRemovedImages:", parsedRemovedImages);

    // 🧩 Resort олж авах
    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ message: "Resort олдсонгүй" });
    }

    // 🧩 Resort үндсэн мэдээлэл шинэчлэх
    resort.name = name || resort.name;
    resort.description = description || resort.description;
    resort.price = price || resort.price;
    resort.location = location || resort.location;
    await resort.save();

    // 🧩 Сервер дээрх устгасан зургуудыг устгах
    parsedRemovedImages.forEach((imgPath) => {
      const fullPath = path.join(process.cwd(), "public", imgPath.replace(/^\/+/, "")); // замыг зөв холбох
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("🧹 Deleted file:", fullPath);
      }
    });

    // 🧩 DB дотор images array-аас устгах
    if (parsedRemovedImages.length > 0) {
      await File.updateMany(
        { resortsId: id },
        { $pull: { images: { $in: parsedRemovedImages } } }
      );
      console.log("🗑️ Files collection-аас устгалаа");
    }

    // 2️⃣ Хоосон images үлдсэн File бичлэгүүдийг бүр мөсөн устгах
  await File.deleteMany({
    resortsId: id,
    $or: [
      { images: { $exists: true, $size: 0 } }, // хоосон images
      { images: { $exists: false } }, // images талбар байхгүй
    ],
  });
  console.log("🧹 Хоосон images-тэй File бичлэгүүдийг устгалаа");

    // 🧩 Шинэ зургууд DB-д хадгалах (шинээр нэмэгдсэн)
    // if (newImages.length > 0) {
    //   for (const imgUrl of newImages) {
    //     const newFile = new File({
    //       resortsId: resort._id,
    //       image: imgUrl,
    //     });
    //     await newFile.save();
    //   }
    // }
    
    console.log("req.files:", req.files)
    // 2️⃣ Файлууд хадгалах
    if (req.files && req.files.images) {
      const images =
      req.files.images?.map((f) => `/uploads/resorts/${f.filename}`) || [];
      console.log('images:',images)

      await File.updateOne(
        { resortsId: resort._id },
        { $push: { images: { $each: images } } } // array-д олон зураг нэмэх
      );

    }      

    // 🧩 Хэрвээ видео файл байвал DB-д хадгалах
    
    const files = await File.find({ resortsId: resort._id });

    res.json({
      success: true,
      message: "✅ Resort зураг болон мэдээлэл амжилттай шинэчлэгдлээ!",
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

    // 1️⃣ Resort байгаа эсэхийг шалгах
    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ success: false, message: "Resort олдсонгүй" });
    }

    // 2️⃣ Холбогдсон File бичлэгүүдийг олох
    const files = await File.find({ resortsId: id });

    // 3️⃣ File бүрийн images болон videos устгах
    for (const file of files) {
      if (file.images && file.images.length > 0) {
        for (const imgPath of file.images) {
          const fullPath = path.join(process.cwd(), "public", imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("🗑️ Устгасан зураг:", imgPath);
          }
        }
      }

      if (file.videos && file.videos.length > 0) {
        for (const vidPath of file.videos) {
          const fullPath = path.join(process.cwd(), "public", vidPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("🗑️ Устгасан бичлэг:", vidPath);
          }
        }
      }
    }

    // 4️⃣ File бичлэгүүдийг DB-ээс устгах
    await File.deleteMany({ resortsId: id });
    console.log("🧹 File хүснэгтээс холбогдсон бичлэгүүдийг устгалаа");

    // 5️⃣ Resort-г устгах
    await Resort.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "🏕️ Resort болон холбогдсон файлууд амжилттай устлаа",
    });
  } catch (err) {
    console.error("❌ Resort устгахад алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};