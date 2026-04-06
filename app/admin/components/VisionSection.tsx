"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // --- GET DATA (Using Axios) ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vision-mission");
      const data = response.data;
      
      // Handling both direct objects and Strapi's { data: { attributes: ... } } format
      const result = data.data?.attributes || data.attributes || data;
      
      setFormData({
        sectionTitle: result.sectionTitle || "",
        visionStatement: result.visionStatement || "",
        missionStatement: result.missionStatement || "",
        backgroundImage: result.backgroundImage || "",
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- SAVE DATA (Using Axios) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Axios directly JSON handle karta hai
      await api.post("/vision-mission/save", formData);
      toast.success("🚀 Vision & Mission updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating data");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      <p className="text-gray-400 font-medium">Loading content...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-sm rounded-[2.5rem] mt-10 border border-gray-100 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
        Edit Vision & Mission
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1">
            Section Title
          </label>
          <input
            name="sectionTitle"
            className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
            placeholder="e.g. Our Purpose"
            value={formData.sectionTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1">
            Vision Statement
          </label>
          <textarea
            name="visionStatement"
            className="w-full border border-gray-200 p-4 rounded-2xl h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 resize-none"
            placeholder="Describe your long-term vision..."
            value={formData.visionStatement}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1">
            Mission Statement
          </label>
          <textarea
            name="missionStatement"
            className="w-full border border-gray-200 p-4 rounded-2xl h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 resize-none"
            placeholder="Describe your daily mission..."
            value={formData.missionStatement}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1">
            Background Image URL
          </label>
          <input
            name="backgroundImage"
            className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50"
            placeholder="https://example.com/image.jpg"
            value={formData.backgroundImage}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`w-full font-bold py-4 rounded-3xl transition-all duration-200 shadow-lg active:scale-95
            ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'}`}
        >
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default VisionMissionAdmin;