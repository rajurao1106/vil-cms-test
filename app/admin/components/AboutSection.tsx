"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios"; // Core library for type checking
import axiosClient from "@/lib/api"; // Your custom instance
import { toast } from "react-toastify";
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
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/about-snippet");
      const json = res.data;
      const attributes = json.data?.attributes || json.data || json;
      
      setData(attributes || {});
      setContent(attributes?.content || "");
    } catch (err) {
      console.error("Failed to fetch about snippet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    const payload = {
      ...data,
      content: content,
    };

    try {
      await axiosClient.post("/about-snippet/save", payload);
      toast.success("About Snippet Saved Successfully!");
    } catch (err: unknown) {
      console.error("Save error:", err);
      
      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        toast.error(serverMessage || "Server error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
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
    []
  );

  if (loading) return <div className="p-10 text-center">Loading About Data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8">About Snippet</h2>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              placeholder="Enter tagline..."
              value={data.tagLine || ""}
              onChange={(e) => setData({ ...data, tagLine: e.target.value })}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 transition-all text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Heading *</label>
            <input
              type="text"
              placeholder="Enter heading..."
              value={data.heading || ""}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 transition-all text-black"
              required
            />
          </div>
        </div>

        <div className="mb-24">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Main Content</label>
          <div className="h-64 text-black">
             <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-full"
              />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Text</label>
            <input
              type="text"
              placeholder="e.g., Read More"
              value={data.ctaText || ""}
              onChange={(e) => setData({ ...data, ctaText: e.target.value })}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Link</label>
            <input
              type="text"
              placeholder="e.g., /about-us"
              value={data.ctaLink || ""}
              onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 text-black"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-10 w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-3xl text-lg font-bold transition-all shadow-lg shadow-teal-100 active:scale-95"
        >
          Save About Snippet
        </button>
      </div>
    </div>
  );
}