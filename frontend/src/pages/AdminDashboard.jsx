import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { serverUrl } from './global';

let url = serverUrl;

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [resorts, setResorts] = useState([]);

  // Resort жагсаалтаа татах
  useEffect(() => {
    axios.get(url +"/api/resorts")
      .then(res => setResorts(res.data))
      .catch(err => console.error("Resort татах үед алдаа:", err));
  }, []);

  // Resort устгах функц
  const deleteResort = async (id) => {
    if (!confirm('Устгах уу?')) return;
    try {
      await axios.delete(url+"api/resorts/${id}");
      setResorts(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert('Устгах үед алдаа гарлаа: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Толгой хэсэг */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Админ самбар</h1>
        <div>
          <span className="mr-4">Сайн байна уу, {user?.name || "Админ"}</span>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={logout}
          >
            Гарах
          </button>
        </div>
      </div>

      {/* Resort жагсаалт */}
      <div className="grid md:grid-cols-2 gap-6">
        {resorts.map(r => (
          <div key={r._id} className="bg-white p-4 rounded shadow flex">
            <img
              src={r.images?.[0] || '/placeholder.jpg'}
              alt={r.name}
              className="w-36 h-24 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{r.name}</h3>
              <p className="text-sm text-gray-500">{r.location}</p>
              <p className="text-sm mt-1">{r.title}</p>
              <div className="mt-2 flex gap-2">
                <Link
                  to={`/admin/edit/${r._id}`}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Засах
                </Link>
                <button
                  onClick={() => deleteResort(r._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Устгах
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Хоосон үед */}
      {resorts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">Одоогоор амралтын газар байхгүй байна.</p>
      )}
    </div>
  );
}
