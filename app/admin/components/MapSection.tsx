"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

interface MapData {
  mapIframeLink?: string;
  mapLocationLink?: string;
}

export default function MapSection() {
  const [mapData, setMapData] = useState<MapData>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMap();
  }, []);

  // --- GET MAP DATA (Using Axios) ---
  const fetchMap = async () => {
    try {
      setLoading(true);
      const res = await api.get("/map");
      setMapData(res.data || {});
    } catch (error) {
      console.error("Error fetching map data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE MAP SETTINGS (Using Axios) ---
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      mapIframeLink: formData.get("mapIframeLink"),
      mapLocationLink: formData.get("mapLocationLink"),
    };

    try {
      await api.post("/map/save", payload);
      toast.success("📍 Map Settings Saved Successfully!");
      fetchMap(); // Refresh data
    } catch (error) {
      console.error("Save error:", error);
      // Global interceptor toast handle karega
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="p-10 flex items-center gap-3">
      <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full"></div>
      <p className="text-gray-500 font-medium">Loading Map Settings...</p>
    </div>
  );

  return (
    <div className="max-w-xl animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Map Settings</h2>
      
      <form
        onSubmit={handleSave}
        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">Google Map Iframe Link</label>
          <input
            name="mapIframeLink"
            defaultValue={mapData.mapIframeLink || ""}
            placeholder="Paste <iframe src='...'> link here"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 ml-1">Google Maps Location URL</label>
          <input
            name="mapLocationLink"
            defaultValue={mapData.mapLocationLink || ""}
            placeholder="https://goo.gl/maps/..."
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`w-full font-bold py-4 rounded-3xl transition-all shadow-lg active:scale-95
            ${isSaving ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100'}`}
        >
          {isSaving ? "Saving..." : "Save Map Settings"}
        </button>
      </form>

      {/* Preview Section (Optional) */}
      {mapData.mapIframeLink && (
        <div className="mt-8 bg-gray-100 rounded-3xl overflow-hidden h-48 relative border-4 border-white shadow-inner">
           <p className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium">Map Preview</p>
           {/* You can dangerouslySetInnerHTML here if you want to see the real map */}
        </div>
      )}
    </div>
  );
}