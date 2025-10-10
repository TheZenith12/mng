import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../pages/global";
function ResortList() {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);

  let url = serverUrl;
  useEffect(() => {
    // 🔹 API-аас resort жагсаалт татах
    axios.get(url +"/api/resorts")
      .then(res => {
        setResorts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching resorts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading resorts...</p>;

  return (
    <div className="p-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
      {resorts.map((resort) => (
        <div key={resort._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden">
          <img
            src={resort.images?.[0] || "https://via.placeholder.com/400x250?text=No+Image"}
            alt={resort.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{resort.name}</h2>
            <p className="text-gray-500 text-sm">{resort.location}</p>
            <p className="text-gray-700 mt-2 line-clamp-2">{resort.description}</p>
            <p className="mt-3 font-semibold text-blue-600">{resort.price}₮ / night</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResortList;
