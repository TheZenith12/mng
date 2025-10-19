import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Local imports (ESM хувилбар)
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import resortRoutes from './src/routes/resorts.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload фолдер үүсгэх
const uploadDir = path.join(__dirname, 'public', 'uploads', 'resorts');
fs.mkdirSync(uploadDir, { recursive: true });

// Static файлуудыг serve хийх
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/resorts', resortRoutes);
app.use("/api/admin", authRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
