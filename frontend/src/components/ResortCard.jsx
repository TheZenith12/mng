import React from "react";
import { Link } from "react-router-dom";

export default function ResortCard({ resort }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-4 flex flex-col">
      <img
        src={resort.images?.[0] || "/placeholder.jpg"}
        alt={resort.name}
        className="w-full h-52 object-cover rounded-md mb-3 border-4 border-blue-300"
      />
      <h3 className="text-xl font-semibold text-purple-700">{resort.name}</h3>
      <p className="text-sm text-gray-500">{resort.district} • {resort.address}</p>
      <p className="mt-1 font-medium text-gray-700">
        Үнэ: {resort.priceRange?.min?.toLocaleString()} - {resort.priceRange?.max?.toLocaleString()} ₮
      </p>
      <p className="mt-1 text-gray-600">Утас: {resort.phone}</p>
      <Link
        to={`/resorts/${resort._id}`}
        className="mt-auto text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded hover:from-purple-500 hover:to-blue-500 transition font-semibold"
      >
        Дэлгэрэнгүй
      </Link>
    </div>
  );
}
