import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "./global";
function EditResort() {
  const { id } = useParams(); // URL-аас id авах
  const navigate = useNavigate();

  const [resort, setResort] = useState(null); // анхны утга null

  let url = serverUrl;
  // ✅ Resort мэдээлэл татах
  useEffect(() => {
    if (!id) return;
    axios
      .get(url + "api/resorts/${id}")
      .then((res) => {
        console.log("✅ Resort fetched:", res.data);
        setResort(res.data);
      })
      .catch((err) => {
        console.error("❌ Resort fetch error:", err);
        alert("Мэдээлэл татахад алдаа гарлаа!");
      });
  }, [id]);

  // ✅ Input өөрчлөх
  const handleChange = (e) => {
    setResort({ ...resort, [e.target.name]: e.target.value });
  };

  // ✅ Хадгалах
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(url + "api/resorts/${id}", resort);
      alert("✅ Амжилттай шинэчлэгдлээ!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Шинэчлэхэд алдаа гарлаа!");
    }
  };

  if (!resort) return <p>⏳ Мэдээлэл ачаалж байна...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>✏️ {resort.name} - Засах</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
        <input
          type="text"
          name="name"
          value={resort.name}
          onChange={handleChange}
          placeholder="Нэр"
          required
        />
        <input
          type="text"
          name="location"
          value={resort.location}
          onChange={handleChange}
          placeholder="Байршил"
          required
        />
        <textarea
          name="description"
          value={resort.description}
          onChange={handleChange}
          placeholder="Тайлбар"
          required
        />
        <input
          type="text"
          name="image"
          value={resort.image}
          onChange={handleChange}
          placeholder="Зурагны URL"
        />
        <button
          type="submit"
          style={{ background: "green", color: "white", padding: "8px", border: "none" }}
        >
          Хадгалах
        </button>
      </form>
    </div>
  );
}

export default EditResort;
