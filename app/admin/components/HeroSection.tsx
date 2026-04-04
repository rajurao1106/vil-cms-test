"use client";
import React, { useState, useEffect } from "react";

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
  [key: string]: string | File | undefined;
}

export default function HeroSection() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Slider | null>(null);
  const [formData, setFormData] = useState<SliderFormData>({});

  const API = "https://vil-cms.vercel.app/api/hero-sliders";

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch(`${API}/all`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setSliders([]); // Set empty array so .map() doesn't crash
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) fd.append(key, formData[key]);
    });

    const url = editing ? `${API}/${editing._id}` : `${API}/add`;
    const method = editing ? "PUT" : "POST";

    await fetch(url, { method, body: fd });
    setShowForm(false);
    setEditing(null);
    setFormData({});
    fetchSliders();
  };

  const deleteSlider = async (id: string) => {
    if (!confirm("Delete this slider?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchSliders();
  };

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-bold">Hero Slider</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2"
        >
          + Add Slider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider) => (
          <div
            key={slider._id}
            className="bg-white rounded-3xl overflow-hidden shadow"
          >
            <img
              src={slider.backgroundImagePath}
              alt=""
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="font-semibold">{slider.heading}</h3>
              <p className="text-sm text-gray-600">{slider.subtitle}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setEditing(slider);
                    setShowForm(true);
                  }}
                  className="flex-1 py-2 border rounded-2xl text-teal-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSlider(slider._id)}
                  className="flex-1 py-2 border rounded-2xl text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-6">
              {editing ? "Edit" : "Add"} Slider
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Heading"
                value={formData.heading || ""}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
                required
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={formData.subtitle || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
              />
              <input
                type="text"
                placeholder="CTA Text"
                value={formData.ctaText || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ctaText: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
              />
              <input
                type="text"
                placeholder="CTA Link"
                value={formData.ctaLink || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
              />
              <div>
                <label>Background Image</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      backgroundImagePath: e.target.files?.[0],
                    })
                  }
                  className="w-full border rounded-2xl px-4 py-3 mt-2"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border rounded-3xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-teal-600 text-white rounded-3xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
