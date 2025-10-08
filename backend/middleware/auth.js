import User from "../models/User.js";
// backend/middleware/auth.js
export const authMiddleware = (req, res, next) => {
  // Зүгээр туршихад бүх request-г pass хийж байна
  console.log("✅ authMiddleware passed");
  next();
};

export const adminOnly = (req, res, next) => {
  const user = req.body.user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Admin зөвхөн ашиглах боломжтой" });
  }
  next();
};
