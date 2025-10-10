import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../pages/global";

let url = serverUrl;

export default function ResortDetail() {
  const { id } = useParams();
  const [resort, setResort] = useState(null);

  useEffect(() => {
    fetch(url + "api/resorts/${id}")
      .then((res) => res.json())
      .then((data) => setResort(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!resort) return <p className="p-6">Ачааллаж байна...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{resort.name}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {resort.images?.map((img, idx) => (
            <img key={idx} src={img} alt={resort.name} className="rounded w-full" />
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-gray-700">{resort.description}</p>
          <p className="text-gray-600">Байршил: {resort.district}, {resort.address}</p>
          <p className="text-gray-600">Утас: {resort.phone}</p>
          <p className="text-gray-700 font-medium">
            Үнэ: {resort.priceRange?.min?.toLocaleString()} - {resort.priceRange?.max?.toLocaleString()} ₮
          </p>
          <h3 className="font-semibold text-gray-800">Өрөөнүүд:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {resort.rooms?.map((room, idx) => (
              <li key={idx}>
                {room.name} ({room.capacity} хүн) - {room.pricePerNight.toLocaleString()} ₮
              </li>
            ))}
          </ul>
          <h3 className="font-semibold text-gray-800">Үйлчилгээ:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {resort.amenities?.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
