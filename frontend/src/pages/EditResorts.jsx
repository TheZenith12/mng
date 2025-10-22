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
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // 🟢 Resort мэдээлэл татах
  useEffect(() => {
    const fetchResort = async () => {
      try {
        if (!id) {
          setError("❌ Resort ID олдсонгүй");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/admin/resorts/${id}`);

        // Backend-аас ирэх бүтэц: { resort, files } гэж үзье
        const resort = res.data.resort || res.data;
        const files = res.data.files || [];

        setForm({
          name: resort?.name || "",
          description: resort?.description || "",
          price: resort?.price || "",
          location: resort?.location || "",
        });

        // зураг, бичлэг ялгах
        setExistingImages(files.filter((f) => f.image).map((f) => f.image));
        setExistingVideos(files.filter((f) => f.video).map((f) => f.video));
      } catch (err) {
        console.error("❌ Error loading resort:", err);
        setError(err.response?.data?.message || "Resort ачаалахад алдаа гарлаа");
      } finally {
        setInitializing(false);
      }
    };

    fetchResort();
  }, [id]);

  // 🟢 Input өөрчлөлт
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 Зураг/видео сонгох
  const handleImages = (e) => setImages(e.target.files);
  const handleVideos = (e) => setVideos(e.target.files);

  // 🗑 Одоо байгаа зураг/видео устгах
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

  // 🟢 Resort шинэчлэх
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("location", form.location);

    // шинэ зураг/видео нэмэх
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    for (let i = 0; i < videos.length; i++) {
      formData.append("videos", videos[i]);
    }

    // байгаа файлууд хадгалах
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("existingVideos", JSON.stringify(existingVideos));

    try {
      await axios.put(`${API_BASE}/api/admin/resorts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Амжилттай шинэчлэгдлээ!");
      navigate("/resorts");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Амралтын газар шинэчлэхэд алдаа гарлаа!");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Ачаалж байгаа үед
  if (initializing) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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

        {/* 🖼️ Одоо байгаа зурагнууд */}
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

        {/* 🆕 Шинээр upload хийх */}
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
          disabled={loading}
        >
          {loading ? "Хадгалж байна..." : "Шинэчлэх"}
        </button>
      </form>
    </div>
  );
}

export default EditResort;
    