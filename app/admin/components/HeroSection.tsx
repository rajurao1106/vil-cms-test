"use client";
import axiosClient from "@/lib/api"; 
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface Slider {
  _id: string;
  heading?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImagePath?: string;
}

interface SliderFormData {
  heading?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImagePath?: string;
}

export default function HeroSection() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Slider | null>(null);
  const [formData, setFormData] = useState<SliderFormData>({});
  const [loading, setLoading] = useState(false);

  // --- GET ALL ---
  const fetchSliders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/hero-sliders/all");
      setSliders(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  // --- CREATE & UPDATE ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        // Backend Route: PUT /hero-sliders/update/:id
        await axiosClient.put(`/hero-sliders/update/${editing._id}`, formData);
        toast.success("Slider updated successfully");
      } else {
        // Backend Route: POST /hero-sliders/add
        await axiosClient.post("/hero-sliders/add", formData);
        toast.success("Slider added successfully");
      }
      
      closeModal();
      fetchSliders();
    } catch (error: unknown) {
      console.error("Save error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to save slider.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const deleteSlider = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    try {
      // Backend Route: DELETE /hero-sliders/delete/:id
      await axiosClient.delete(`/hero-sliders/delete/${id}`);
      toast.success("Slider deleted successfully");
      fetchSliders();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete slider");
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({});
  };

  const openEdit = (slider: Slider) => {
    setEditing(slider);
    setFormData({
      heading: slider.heading,
      subtitle: slider.subtitle,
      ctaText: slider.ctaText,
      ctaLink: slider.ctaLink,
      backgroundImagePath: slider.backgroundImagePath,
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Hero Sliders</h2>
          <p className="text-gray-500 text-sm">Manage website homepage banners</p>
        </div>
        <button
          onClick={() => { setFormData({}); setEditing(null); setShowForm(true); }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          + Add Slider
        </button>
      </div>

      {loading && sliders.length === 0 ? (
        <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading sliders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <div key={slider._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={slider.backgroundImagePath || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={slider.heading}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-teal-600 shadow-sm">
                  Active
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-1">{slider.heading || "Untitled Slider"}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10">{slider.subtitle}</p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => openEdit(slider)}
                    className="flex-1 py-3 bg-gray-50 text-teal-600 font-semibold rounded-xl hover:bg-teal-600 hover:text-white transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSlider(slider._id)}
                    className="flex-1 py-3 bg-gray-50 text-red-500 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                {editing ? "Edit" : "Add New"} Slider
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Main Heading</label>
                <input
                    type="text"
                    placeholder="Enter heading..."
                    value={formData.heading || ""}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Subtitle</label>
                <textarea
                    placeholder="Enter subtitle..."
                    value={formData.subtitle || ""}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                    rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Button Text</label>
                    <input
                    type="text"
                    placeholder="e.g. Learn More"
                    value={formData.ctaText || ""}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Button Link</label>
                    <input
                    type="text"
                    placeholder="e.g. /about"
                    value={formData.ctaLink || ""}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Background Image URL (Cloudinary/CDN)</label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/..."
                  value={formData.backgroundImagePath || ""}
                  onChange={(e) => setFormData({ ...formData, backgroundImagePath: e.target.value })}
                  className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none font-mono text-sm"
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4 border border-gray-100 rounded-2xl text-gray-500 hover:bg-gray-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 active:scale-95 transition-all disabled:bg-teal-300"
                >
                  {loading ? "Processing..." : editing ? "Update Changes" : "Save Slider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}