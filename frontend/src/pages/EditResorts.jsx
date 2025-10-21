import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function EditResort() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Resort мэдээлэл авах
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/admin/resorts/${id}`)
      .then((res) => {
        setForm({
          name: res.data.name || "",
          description: res.data.description || "",
          price: res.data.price || "",
          location: res.data.location || "",
        });
        setExistingImages(res.data.images || []);
        setExistingVideos(res.data.videos || []);
      })
      .catch((err) => console.error("Error loading resort:", err));
  }, [id]);

  // 🟢 Input өөрчлөлт
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟢 Шинэ зураг/видео оруулах
  const handleImages = (e) => setImages(e.target.files);
  const handleVideos = (e) => setVideos(e.target.files);

  // 🟢 Update хийх
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("location", form.location);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    for (let i = 0; i < videos.length; i++) {
      formData.append("videos", videos[i]);
    }

    try {
      await axios.put(`${API_BASE}/api/admin/resorts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Амжилттай шинэчлэгдлээ!");
      navigate("/resorts");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Алдаа гарлаа: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Одоо байгаа зураг устгах (frontend дээрээс)
  const handleRemoveImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleRemoveVideo = (index) => {
    const updated = [...existingVideos];
    updated.splice(index, 1);
    setExistingVideos(updated);
  };

  if (loading) return <p>Updating...</p>;
  if (!form.name && existingImages.length === 0) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">✏️ Амралтын газар засах</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
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

        {/* Одоо байгаа зураг, бичлэг */}
        <div>
          <h3 className="font-medium mt-3 mb-1">Одоо байгаа зургууд</h3>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={`${API_BASE}${img}`}
                  alt=""
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <h3 className="font-medium mt-3 mb-1">Одоо байгаа бичлэгүүд</h3>
          <div className="flex flex-wrap gap-2">
            {existingVideos.map((vid, i) => (
              <div key={i} className="relative">
                <video
                  width="120"
                  height="90"
                  controls
                  src={`${API_BASE}${vid}`}
                  className="rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Шинээр upload хийх */}
        <div className="mt-3">
          <label className="block font-medium mb-1">Шинэ зураг оруулах</label>
          <input type="file" multiple accept="image/*" onChange={handleImages} />
          <label className="block font-medium mb-1 mt-2">
            Шинэ бичлэг оруулах
          </label>
          <input type="file" multiple accept="video/*" onChange={handleVideos} />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
        >
          {loading ? "Хадгалж байна..." : "Шинэчлэх"}
        </button>
      </form>
    </div>
  );
}

export default EditResort;
