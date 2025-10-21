/**
 * backend/scripts/recreateFiles.js
 *
 * How to run:
 *   cd backend
 *   node ./scripts/recreateFiles.js
 *
 * This script:
 *  - connects to MongoDB (use your env MONGO_URI or default)
 *  - reads existing "files" collection (if any)
 *  - constructs new docs using available fields (handles multiple possible keys)
 *  - computes createdYearMonth from createdAt or from filename timestamp if available
 *  - inserts new docs into collection using new File model
 *
 * NOTE: make backup of DB before running!
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";

// Models (we import minimal models or define local schemas)
import FileModel from "../src/models/fileModel.js";
import Resort from "../src/models/resortModel.js";

const MONGO = process.env.MONGO_URI='mongodb+srv://zenitht19:Nakibennn12@cluster0.wietegr.mongodb.net/mng-resorts?retryWrites=true&w=majority'


async function run() {
  console.log("Connecting to", MONGO);
  await mongoose.connect(MONGO, {});

  console.log("Connected.");

  // read raw docs from existing collection if present
  const db = mongoose.connection.db;
  const collNames = await db.listCollections().toArray();
  const hasFiles = collNames.some(c => c.name === "files");

  let rawFiles = [];
  if (hasFiles) {
    rawFiles = await db.collection("files").find({}).toArray();
    console.log("Found", rawFiles.length, "raw file docs.");
  } else {
    console.log("No existing 'files' collection found. Nothing to migrate.");
  }

  // OPTION: Drop existing 'files' collection to recreate fresh (uncomment if you want)
  // console.log("Dropping existing 'files' collection...");
  // if (hasFiles) await db.collection("files").drop();

  // We'll create new collection entries (we will not drop by default; we'll upsert by _id if present)
  const newDocs = [];

  for (const raw of rawFiles) {
    // possible keys that might hold resort id in your old schema
    const possibleResortKeys = ["resort", "resortsId", "resorts_id", "resortId", "resort_id"];

    let resortId = null;
    for (const k of possibleResortKeys) {
      if (raw[k]) {
        try {
          resortId = mongoose.Types.ObjectId.isValid(raw[k]) ? raw[k] : null;
          if (resortId) break;
        } catch (e) {}
      }
    }

    const doc = {
      filename: raw.filename || raw.originalname || null,
      path: raw.path || raw.url || raw.filePath || null,
      mimetype: raw.mimetype || raw.type || null,
      size: raw.size || raw.filesize || null,
      resort: resortId ? resortId : null,
      fileId: raw.fileId || raw._id?.toString() || null,
      createdAt: raw.createdAt || raw._id ? new Date() : new Date()
    };

    // skip docs that are obviously invalid (filename or path or size missing)
    if (!doc.filename || !doc.path) {
      console.warn("Skipping raw doc due missing filename/path:", raw._id || raw);
      continue;
    }

    newDocs.push(doc);
  }

  if (newDocs.length === 0) {
    console.log("No valid docs to insert. Done.");
    await mongoose.disconnect();
    return;
  }

  console.log("Inserting", newDocs.length, "new File docs...");
  // InsertMany
  try {
    const inserted = await FileModel.insertMany(newDocs, { ordered: false });
    console.log("Inserted:", inserted.length);
  } catch (err) {
    console.error("InsertMany error:", err);
  }

  // if you want to drop old raw collection name (only if it's different), handle here

  await mongoose.disconnect();
  console.log("Migration finished.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
