import mongoose from "mongoose";

const resortSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: Number,
    location: String,
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Resort", resortSchema);
