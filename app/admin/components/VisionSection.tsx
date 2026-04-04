"use client";

import React, { useState, useEffect } from "react";

// --- Types ---
interface VisionMissionData {
  sectionTitle: string;
  visionStatement: string;
  missionStatement: string;
  backgroundImage: string;
}

const VisionMissionAdmin: React.FC = () => {
  const [formData, setFormData] = useState<VisionMissionData>({
    sectionTitle: "",
    visionStatement: "",
    missionStatement: "",
    backgroundImage: "",
  });

  const API_URL = "https://vil-cms.vercel.app/api/vision-mission";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        // Handling both direct objects and Strapi's { data: { attributes: ... } } format
        const result = data.data?.attributes || data.attributes || data;
        setFormData({
          sectionTitle: result.sectionTitle || "",
          visionStatement: result.visionStatement || "",
          missionStatement: result.missionStatement || "",
          backgroundImage: result.backgroundImage || "",
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Updated successfully!");
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating data");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-3xl mt-10 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800">
        Edit Vision & Mission
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Section Title
          </label>
          <input
            name="sectionTitle"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. Our Purpose"
            value={formData.sectionTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Vision Statement
          </label>
          <textarea
            name="visionStatement"
            className="w-full border border-gray-300 p-3 rounded-xl h-28 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Describe your long-term vision..."
            value={formData.visionStatement}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Mission Statement
          </label>
          <textarea
            name="missionStatement"
            className="w-full border border-gray-300 p-3 rounded-xl h-28 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Describe your daily mission..."
            value={formData.missionStatement}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 ml-1">
            Background Image URL
          </label>
          <input
            name="backgroundImage"
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="https://example.com/image.jpg"
            value={formData.backgroundImage}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-100 active:scale-[0.98]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default VisionMissionAdmin;
