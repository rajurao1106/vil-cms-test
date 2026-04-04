"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Import styles
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
      Loading Editor...
    </div>
  ),
});

export default function ChairmanSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [signaturePath, setSignaturePath] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Note: Ensure this URL matches your backend route exactly
      const res = await fetch(
        "https://vil-cms.vercel.app/api/chairman-message",
      );

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const json = await res.json();

      // Handle Strapi's nested structure or flat JSON
      const attributes = json.data?.attributes || json.data || json;

      setData(attributes);
      setAuthorName(attributes?.authorName || "");
      setContent(attributes?.messageContent || "");
      setSignaturePath(attributes?.signatureImagePath || "");
    } catch (err: unknown) {
      console.error("Error fetching chairman data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      authorName: authorName,
      messageContent: content,
      signatureImagePath: signaturePath,
    };

    try {
      const res = await fetch(
        "https://vil-cms.vercel.app/api/chairman-message/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        alert("Chairman's Message Saved Successfully!");
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message || "Save failed"}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving. Is the backend running?");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Chairman Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-3xl border border-red-100 max-w-3xl">
        <h3 className="text-red-600 font-bold text-lg mb-2">
          Connection Error
        </h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Chairman's Message
      </h2>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6"
      >
        {/* Author Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Author Name
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Dr. John Doe"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>

        {/* Message Content (Rich Text) */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Message Content
          </label>
          <div className="min-h-[350px] pb-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-72"
            />
          </div>
        </div>

        {/* Signature Path (Text Input) */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Signature Image URL / Path
          </label>
          <input
            type="text"
            value={signaturePath}
            onChange={(e) => setSignaturePath(e.target.value)}
            placeholder="/images/signatures/chairman.png"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-3xl transition-all duration-200 shadow-lg shadow-teal-100 active:scale-[0.98]"
        >
          Save Message
        </button>
      </form>
    </div>
  );
}
