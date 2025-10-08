import mongoose from "mongoose";

const ResortSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  title: { type: String }, // товч танилцуулга / subtitle
  description: { type: String }, // дэлгэрэнгүй мэдээлэл
  images: [{ type: String }], // зурагнуудын URL жагсаалт
}, { timestamps: true }); // createdAt, updatedAt автоматаар үүсгэнэ

const Resort = mongoose.model("Resort", ResortSchema);
export default Resort;
