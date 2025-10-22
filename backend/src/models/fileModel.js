import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    resortsId: { type: mongoose.Schema.Types.ObjectId, ref: "Resort", required: true },
    filename: String,
    size: Number,
    mimetype: String,
    image: { type: String, default: "" },
    video: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
