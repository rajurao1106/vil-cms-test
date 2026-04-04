"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Import dynamically to disable SSR for the rich text editor
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-72 bg-gray-100 animate-pulse rounded-2xl" />,
});

interface AboutData {
  tagLine?: string;
  heading?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function AboutSection() {
  const [data, setData] = useState<AboutData>({});
  const [content, setContent] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/about-snippet");
      const json = await res.json();
      if (res.ok) {
        setData(json || {});
        setContent(json?.content || "");
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    // Combine local input state with the rich text editor state
    const payload = {
      ...data,
      content: content,
    };

    try {
      const res = await fetch(
        "https://vil-cms.vercel.app/api/about-snippet/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        alert("About Snippet Saved Successfully!");
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Check console.");
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    [],
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8">About Snippet</h2>
      <div className="bg-white rounded-3xl p-8 shadow-sm border">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Tagline
        </label>
        <input
          type="text"
          placeholder="Enter tagline..."
          value={data.tagLine || ""}
          onChange={(e) => setData({ ...data, tagLine: e.target.value })}
          className="w-full border rounded-2xl px-4 py-3 mb-6 outline-teal-500"
        />

        <label className="block text-sm font-medium text-gray-600 mb-1">
          Heading *
        </label>
        <input
          type="text"
          placeholder="Enter heading..."
          value={data.heading || ""}
          onChange={(e) => setData({ ...data, heading: e.target.value })}
          className="w-full border rounded-2xl px-4 py-3 mb-6 outline-teal-500"
        />

        <div className="mb-20">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Main Content
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="h-64 mb-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              CTA Text
            </label>
            <input
              type="text"
              placeholder="e.g., Read More"
              value={data.ctaText || ""}
              onChange={(e) => setData({ ...data, ctaText: e.target.value })}
              className="w-full border rounded-2xl px-4 py-3 outline-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              CTA Link
            </label>
            <input
              type="text"
              placeholder="e.g., /about-us"
              value={data.ctaLink || ""}
              onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
              className="w-full border rounded-2xl px-4 py-3 outline-teal-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-10 w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-3xl text-lg font-bold transition-all"
        >
          Save About Snippet
        </button>
      </div>
    </div>
  );
}
