import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    resort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resort",
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    size: Number,
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
