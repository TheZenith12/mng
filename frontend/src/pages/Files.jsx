import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Files() {
  const [files, setFiles] = useState([]);

  // --- Файлуудыг татах ---
  async function fetchFiles() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // --- Upload хийх функц ---
  async function uploadFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/admin/files`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const newFile = await res.json();
      setFiles([newFile, ...files]);
    } catch (err) {
      alert(err.message);
    }
  }

  {files.map((file) => (
  <div key={file._id} className="file-card">
    {file.image && file.image.startsWith("/uploads") ? (
      <img
        src={`http://localhost:5000${file.image}`}
        alt={file.filename}
        className="w-48 h-32 object-cover"
      />
    ) : file.video && file.video.startsWith("/uploads") ? (
      <video
        src={`http://localhost:5000${file.video}`}
        controls
        className="w-48 h-32 object-cover"
      />
    ) : (
      <p>📁 {file.filename}</p>
    )}
  </div>
))}


  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-4">
      {/* Толгой хэсэг */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📂 File Manager</h2>
        <label className="px-3 py-1 border rounded cursor-pointer bg-blue-50 hover:bg-blue-100">
          Upload
          <input type="file" className="hidden" onChange={uploadFile} />
        </label>
      </div>

      {/* Файлуудыг харуулах хэсэг */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((f) => {
          const fileUrl = f.url.startsWith("http")
            ? f.url
            : `${API_BASE}${f.url}`;
          const isVideo =
            fileUrl.endsWith(".mp4") ||
            fileUrl.endsWith(".mov") ||
            fileUrl.endsWith(".avi");

          return (
            <div
              key={f._id}
              className="bg-white p-2 rounded shadow hover:shadow-lg transition"
            >

              {isVideo ? (
                <video
                  src={fileUrl}
                  className="w-full h-40 object-cover rounded"
                  controls
                />
              ) : (
                <img
                  src={fileUrl}
                  alt={f.filename}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <div className="text-sm text-gray-600 truncate mt-1">
                {f.filename}
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Open
              </a>
            </div>
          );
        })}

        {files.length === 0 && (
          <div className="text-gray-500 col-span-full">
            No files uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
