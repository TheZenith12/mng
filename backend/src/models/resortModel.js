import mongoose from 'mongoose';

const resortSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: '', // зургийн URL эсвэл path
    },
  },
  { timestamps: true }
);

const Resort = mongoose.model('Resort', resortSchema);
export default Resort;
