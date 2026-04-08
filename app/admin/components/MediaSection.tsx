"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";
import axios from "axios"; // Import axios for type checking

interface MediaItem {
  _id?: string;
  id?: string;
  filePath: string;
  category?: string;
}

export default function MediaSection() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  // --- 1. GET: Fetch existing media ---
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get("/media"); 
      const data = res.data;
      setMedia(Array.isArray(data) ? data : data.data || []);
    } catch (error: unknown) {
      console.error("Error fetching media:", error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. POST: Upload new media ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await api.post("/media/upload", formData);
      
      toast.success("Image uploaded successfully!");
      fetchMedia(); // Gallery refresh karein
    } catch (error: unknown) {
      console.error("Error uploading:", error);
      
      // Fix: Type-safe error handling for Axios
      let errorMessage = "Upload failed.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      event.target.value = ""; // Input clear karein
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Media Gallery</h2>

        <label 
          className={`cursor-pointer px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg
          ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100 active:scale-95"}`}
        >
          {uploading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Uploading...
            </>
          ) : (
            "+ Upload Image"
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept="image/*"
          />
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-48 bg-gray-100 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {media.map((item) => {
            const key = item._id || item.id || Math.random().toString();
            
            // Safe URL Logic
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
            const fullUrl = item.filePath.startsWith("http") 
              ? item.filePath 
              : `${baseUrl}${item.filePath}`;

            return (
              <div
                key={key}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={fullUrl}
                    alt={item.category || "Media"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {item.category || "General"}
                  </span>
                  <button className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {media.length === 0 && !loading && !uploading && (
        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 mt-10">
          <p className="text-gray-400 font-medium text-lg">No media found in gallery.</p>
        </div>
      )}
    </div>
  );
}