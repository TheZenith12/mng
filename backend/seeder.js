// backend/seeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Resort = require("./models/Resort");
const sampleData = require("./sampleData.json");

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Resort.deleteMany({});
    await Resort.insertMany(sampleData);
    console.log("Sample data imported!");
    process.exit();
  })
  .catch(err => console.error(err));
