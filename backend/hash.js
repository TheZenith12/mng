// hash.js
import bcrypt from "bcryptjs";

const createHash = async () => {
  const password = "123456"; // энд хүссэн нууц үгээ бич
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashed);
};

createHash();
