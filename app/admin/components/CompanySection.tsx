"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Use dynamic import to fix the findDOMNode error
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-50 animate-pulse rounded-2xl" />,
});

const categories = [
  "The Company",
  "Vision & Mission",
  "Chairman Message",
  "Board of Directors",
  "Committees",
  "Familiarization",
];

interface CompanyData {
  pageTitle?: string;
  subtitle?: string;
  mainContent?: string;
}

export default function CompanySection() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [data, setData] = useState<CompanyData>({});
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchSection();
  }, [selectedCategory]);

  const fetchSection = async () => {
    try {
      // FIX: Use encodeURIComponent to handle spaces and "&" in category names
      const encodedCategory = encodeURIComponent(selectedCategory);
      const res = await fetch(
        `https://vil-cms.vercel.app/api/company/${encodedCategory}`,
      );

      if (!res.ok) {
        // If the API returns a 404 because the section doesn't exist yet,
        // we just clear the form instead of throwing a hard error.
        setData({});
        setContent("");
        return;
      }

      const json = await res.json();
      setData(json || {});
      setContent(json?.mainContent || "");
    } catch (error) {
      console.error("Fetch error:", error);
      setData({});
      setContent("");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.append("category", selectedCategory);
    fd.append("mainContent", content);

    try {
      const res = await fetch("https://vil-cms.vercel.app/api/company/save", {
        method: "POST",
        body: fd,
      });
      if (res.ok) alert(`${selectedCategory} Saved!`);
    } catch (err) {
      alert("Failed to save data.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Company Sections</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border rounded-2xl px-5 py-3 mb-8 text-lg focus:ring-2 focus:ring-teal-500 outline-none"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 shadow">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Page Title</label>
            <input
              name="pageTitle"
              key={`${selectedCategory}-title`} // Force re-render when category changes
              defaultValue={data.pageTitle || ""}
              placeholder="Page Title"
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              name="subtitle"
              key={`${selectedCategory}-subtitle`} // Force re-render when category changes
              defaultValue={data.subtitle || ""}
              placeholder="Subtitle"
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>

          <div className="pb-12">
            <label className="block text-sm font-medium mb-2">
              Main Content
            </label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-80"
            />
          </div>

          <div className="pt-8">
            <label className="block text-sm font-medium mb-2">
              Section Image
            </label>
            <input
              type="file"
              name="sectionImage"
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-3xl font-bold transition-colors"
          >
            Save {selectedCategory}
          </button>
        </div>
      </form>
    </div>
  );
}
