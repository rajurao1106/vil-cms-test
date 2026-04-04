"use client";
import React, { useState, useEffect } from "react";

interface MediaItem {
  _id?: string;
  id?: string;
  filePath: string;
  category?: string;
}

export default function MediaSection() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  // 1. GET: Fetch existing media
  const fetchMedia = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/documents");
      const data = await res.json();
      // Ensure data is an array based on your API response structure
      setMedia(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // 2. POST: Upload new media
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    // If your API requires a category or other fields, append them here:
    // formData.append("category", "General");

    setUploading(true);

    try {
      const res = await fetch("https://vil-cms.vercel.app/api/media/upload", {
        method: "POST",
        body: formData, // No headers needed, browser sets Multipart/Form-Data automatically
      });

      if (res.ok) {
        alert("Upload successful!");
        fetchMedia(); // Refresh the gallery
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Media Gallery</h2>

        {/* Upload Button */}
        <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept="image/*"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {media.map((item) => (
          <div
            key={item._id || item.id}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            <img
              src={
                item.filePath.startsWith("http")
                  ? item.filePath
                  : `https://vil-cms.vercel.app${item.filePath}`
              }
              alt={item.category || "Media"}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {item.category || "Uncategorized"}
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && !uploading && (
        <p className="text-center text-gray-400 mt-10">No media found.</p>
      )}
    </div>
  );
}
