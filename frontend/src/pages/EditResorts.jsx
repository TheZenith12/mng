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

  const [existingImages, setExistingImages] = useState([]); // Backend-аас ирсэн зургууд
  const [existingVideos, setExistingVideos] = useState([]);
  const [newImages, setNewImages] = useState([]); // Шинэ сонгосон зургууд
  const [newVideos, setNewVideos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]); // Шинэ зургуудын preview
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Resort мэдээлэл татах
  useEffect(() => {
    const fetchResort = async () => {
      try {
        if (!id) {
          setError("❌ Resort ID олдсонгүй");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/admin/resorts/${id}`);

        const resort = res.data.resort || res.data;
        const files = res.data.files || [];

        setForm({
          name: resort?.name || "",
          description: resort?.description || "",
          price: resort?.price || "",
          location: resort?.location || "",
        });

        // Зургууд болон бичлэгүүд ялгах
        setExistingImages(files.filter((f) => f.images).flatMap((f) => f.images));
        setExistingVideos(files.filter((f) => f.videos).flatMap((f) => f.videos));
      } catch (err) {
        console.error("❌ Error loading resort:", err);
        setError(err.response?.data?.message || "Resort ачаалахад алдаа гарлаа");
      } finally {
        setInitializing(false);
      }
    };

    fetchResort();
  }, [id]);

  // 🔹 Input өөрчлөлт
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Шинэ зураг сонгох
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  // 🔹 Шинэ видео сонгох
  const handleNewVideos = (e) => setNewVideos([...newVideos, ...e.target.files]);

  // 🔹 Устгах функцийг бүх зурагт
  const removeExistingImage = (index) => setExistingImages(existingImages.filter((_, i) => i !== index));
  const removeExistingVideo = (index) => setExistingVideos(existingVideos.filter((_, i) => i !== index));
  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };
  const removeNewVideo = (index) => setNewVideos(newVideos.filter((_, i) => i !== index));

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("location", form.location);

    newImages.forEach((img) => formData.append("images", img));
    newVideos.forEach((vid) => formData.append("videos", vid));

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

  if (initializing) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">✏️ Амралтын газар засах</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        {/* 📝 Нэр, тайлбар, үнэ, байршил */}
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Нэр" className="border w-full px-3 py-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Тайлбар" className="border w-full px-3 py-2 rounded" required />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Үнэ" className="border w-full px-3 py-2 rounded" required />
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Байршил" className="border w-full px-3 py-2 rounded" required />

        {/* 🖼️ Одоо байгаа зургууд */}
        <div>
          <h3 className="font-medium mt-3 mb-1">Одоо байгаа зургууд</h3>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img src={`${API_BASE}${img}`} alt="" className="w-24 h-24 object-cover rounded" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* 🖼️ Шинэ зургууд */}
        <div>
          <h3 className="font-medium mt-3 mb-1">Шинэ зургууд</h3>
          <input type="file" multiple accept="image/*" onChange={handleNewImages} />
          <div className="flex flex-wrap gap-2 mt-2">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="w-24 h-24 object-cover rounded" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* 🎥 Бичлэгүүд */}
        <div>
          <h3 className="font-medium mt-3 mb-1">Бичлэгүүд</h3>
          <div className="flex flex-wrap gap-2">
            {existingVideos.map((vid, i) => (
              <div key={i} className="relative">
                <video width="120" height="90" controls src={`${API_BASE}${vid}`} className="rounded" />
                <button type="button" onClick={() => removeExistingVideo(i)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 mt-3">Шинэ бичлэг оруулах</label>
          <input type="file" multiple accept="video/*" onChange={handleNewVideos} />
        </div>

        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4">
          {loading ? "Хадгалж байна..." : "Шинэчлэх"}
        </button>
      </form>
    </div>
  );
}

export default EditResort;
