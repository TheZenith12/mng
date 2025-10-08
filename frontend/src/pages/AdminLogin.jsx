import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ⬇️ Нэвтрэх логик энд байна
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend рүү хүсэлт явуулна
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const user = res.data; // 🟢 Backend-аас ирсэн хэрэглэгчийн мэдээлэл

      if (user.isAdmin) {
        // Хэрэв админ бол localStorage-д хадгалаад dashboard руу зөөнө
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/admin/dashboard");
      } else {
        alert("Админ эрхгүй хэрэглэгч байна!");
      }
    } catch (err) {
      console.error(err);
      alert("Нэвтрэхэд алдаа гарлаа!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 to-blue-200">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
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
