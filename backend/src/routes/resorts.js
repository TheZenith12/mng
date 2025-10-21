import express from "express";
import multer from "multer";
import path from "path";
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";

const router = express.Router();

// ===== Multer Config =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/resorts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

// ===== Routes =====
router.get("/", getResorts);
router.get("/:id", getResortById);
router.post(
  "/new",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  createResort
);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  updateResort
);
router.delete("/:id", deleteResort);

export default router;
