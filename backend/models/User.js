import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);
export default User;  // default export