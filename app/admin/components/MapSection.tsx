"use client";
import React, { useState, useEffect } from "react";

interface MapData {
  mapIframeLink?: string;
  mapLocationLink?: string;
}

export default function MapSection() {
  const [mapData, setMapData] = useState<MapData>({});

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = async () => {
    const res = await fetch("https://vil-cms.vercel.app/api/map");
    const data = await res.json();
    setMapData(data || {});
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    await fetch("https://vil-cms.vercel.app/api/map/save", {
      method: "POST",
      body: fd,
    });
    alert("Map Settings Saved!");
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-bold mb-8">Map Settings</h2>
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-8 shadow space-y-6"
      >
        <input
          name="mapIframeLink"
          defaultValue={mapData.mapIframeLink || ""}
          placeholder="Map Iframe Link"
          className="w-full border rounded-2xl px-4 py-3"
        />
        <input
          name="mapLocationLink"
          defaultValue={mapData.mapLocationLink || ""}
          placeholder="Map Location Link"
          className="w-full border rounded-2xl px-4 py-3"
        />
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-4 rounded-3xl"
        >
          Save Map Settings
        </button>
      </form>
    </div>
  );
}
