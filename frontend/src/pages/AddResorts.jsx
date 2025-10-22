import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AddResort() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
  });

  const [images, setImages] = useState([]); // олон зураг
  const [videos, setVideos] = useState([]); // олон бичлэг
  const [imageUrl, setImageUrl] = useState(""); // upload хийсэн нэг зураг URL
  const [loading, setLoading] = useState(false);

  // 🧾 Input өөрчлөгдөхөд
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼️ Олон зураг сонгох
  const handleImages = (e) => setImages([...e.target.files]);

  // 🎥 Олон видео сонгох
  const handleVideos = (e) => setVideos([...e.target.files]);

  // 🖼️ Нэг зураг upload хийх (жишээ upload API руу илгээж байна)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/api/admin/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.path || res.data.image || ""); // backend юу буцааж байгаагаас хамаарна
    } catch (err) {
      console.error("❌ Зураг upload хийхэд алдаа гарлаа:", err);
      alert("Зураг upload хийхэд алдаа гарлаа!");
    }
  };

  // 📨 Resort нэмэх
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("location", form.location);

      images.forEach((img) => formData.append("images", img));
      videos.forEach((vid) => formData.append("videos", vid));

      if (imageUrl) formData.append("imageUrl", imageUrl);

      const res = await axios.post(`${API_BASE}/api/admin/resorts/new`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Амралтын газар амжилттай нэмэгдлээ!");
      console.log("✅ SERVER RESPONSE:", res.data);

      // талбар цэвэрлэх
      setForm({ name: "", description: "", price: "", location: "" });
      setImages([]);
      setVideos([]);
      setImageUrl("");
    } catch (err) {
      console.error("❌ Амралтын газар нэмэхэд алдаа гарлаа:", err);
      alert("Амралтын газар нэмэхэд алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🏕️ Амралтын газар нэмэх</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Нэр</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Тайлбар</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded"
            rows="3"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Үнэ (₮)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Байршил</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="border w-full px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">🖼️ Олон зураг</label>
          <input type="file" multiple accept="image/*" onChange={handleImages} />
        </div>

        <div>
          <label className="block font-medium mb-1">📤 Нэг зураг upload (туршилтаар)</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imageUrl && (
            <img
              src={`${API_BASE}${imageUrl}`}
              alt="Uploaded"
              className="mt-2 w-32 rounded border"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">🎥 Бичлэгүүд</label>
          <input type="file" multiple accept="video/*" onChange={handleVideos} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Хадгалж байна..." : "Нэмэх"}
        </button>
      </form>
    </div>
  );
}

export default AddResort;
