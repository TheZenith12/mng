// routes/fileRoutes.js
import express from "express";
import { uploadFile, getFiles, deleteFile } from "../controllers/fileController.js";
import { upload } from "../middleware/upload.js"; // зөв import

const router = express.Router();

router.get("/", getFiles);
router.post("/upload", upload.single("file"), uploadFile);
router.delete("/:id", deleteFile);

export default router;
