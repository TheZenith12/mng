import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "./global";
import { AuthContext } from "../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // 👈 Context-оос setUser авах

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Имэйл болон нууц үг хоёул байх ёстой!");
      return;
    }

    try {
      const url = serverUrl + "/api/auth/login";
      const res = await axios.post(
        url,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const user = res.data;

      if (user.isAdmin) {
        // ✅ Context-д хадгална
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/admin/dashboard");
      } else {
        alert("Админ эрхгүй хэрэглэгч байна!");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Нэвтрэхэд алдаа гарлаа!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Админ нэвтрэх</h2>
        <input
          type="email"
          placeholder="Имэйл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-5 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Нэвтрэх
        </button>
      </form>
    </div>
  );
}
