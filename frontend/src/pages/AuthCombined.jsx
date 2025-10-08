import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthCombined() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Нэвтрэхэд алдаа гарлаа: " + err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Админ нэвтрэх</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg"
        >
          Нэвтрэх
        </button>
      </div>
    </div>
  );
}
