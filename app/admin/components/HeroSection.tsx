"use client";
import axiosClient from "@/lib/api"; // Aapka global axios client
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

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
  backgroundImagePath?: File;
  [key: string]: any;
}

export default function HeroSection() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Slider | null>(null);
  const [formData, setFormData] = useState<SliderFormData>({});
  const [loading, setLoading] = useState(false);

  // --- GET ALL SLIDERS ---
  const fetchSliders = useCallback(async () => {
    try {
      setLoading(true);
      // axiosClient use kar rahe hain, isliye sirf endpoint likhna hai
      const res = await axiosClient.get("/hero-sliders/all");
      const data = res.data;
      setSliders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setSliders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  // --- ADD / EDIT SLIDER ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    
    // Append all fields to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) {
        fd.append(key, formData[key]);
      }
    });

    try {
      if (editing) {
        await axiosClient.put(`/hero-sliders/${editing._id}`, fd);
        toast.success("Slider updated successfully");
      } else {
        await axiosClient.post("/hero-sliders/add", fd);
        toast.success("Slider added successfully");
      }
      
      setShowForm(false);
      setEditing(null);
      setFormData({});
      fetchSliders();
    } catch (error: any) {
      // Global interceptor toast handle karega, par yahan bhi control kar sakte hain
      console.error("Save error:", error);
    }
  };

  // --- DELETE SLIDER ---
  const deleteSlider = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    try {
      await axiosClient.delete(`/hero-sliders/${id}`);
      toast.success("Deleted!");
      fetchSliders();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Hero Sliders</h2>
        <button
          onClick={() => {
            setFormData({});
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl shadow-lg transition-all"
        >
          + Add Slider
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading sliders...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <div key={slider._id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100">
              <div className="h-48 bg-gray-200 relative">
                {slider.backgroundImagePath && (
                  <img
                    src={slider.backgroundImagePath}
                    alt={slider.heading}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{slider.heading || "No Title"}</h3>
                <p className="text-sm text-gray-500 mb-4">{slider.subtitle}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditing(slider);
                      // setFormData({ ...slider });
                      setShowForm(true);
                    }}
                    className="flex-1 py-2 border border-teal-100 rounded-xl text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSlider(slider._id)}
                    className="flex-1 py-2 border border-red-100 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {editing ? "Edit" : "Add New"} Slider
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Heading"
                value={formData.heading || ""}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                required
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={formData.subtitle || ""}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="CTA Text (e.g. Learn More)"
                  value={formData.ctaText || ""}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="CTA Link"
                  value={formData.ctaLink || ""}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  className="border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300">
                <label className="block text-sm font-medium text-gray-600 mb-2">Background Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, backgroundImagePath: e.target.files?.[0] })}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 active:scale-95 transition-all"
                >
                  Save Slider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}