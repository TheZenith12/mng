import express from "express";
import Resort from "../models/Resort.js";
import { adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Resort мэдээлэл авах
router.get("/", async (req, res) => {
  const resorts = await Resort.find();
  res.json(resorts);
});

// Admin-аар шинэ resort нэмэх
router.post("/", adminOnly, async (req, res) => {
  const newResort = new Resort(req.body);
  await newResort.save();
  res.json(newResort);
});

// Admin-аар edit хийх
router.put("/resorts/:id", adminOnly, async (req, res) => {
  const updatedResort = await Resort.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedResort);
});

// Admin-аар устгах
router.delete("/resorts/:id", adminOnly, async (req, res) => {
  await Resort.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

export default router;
