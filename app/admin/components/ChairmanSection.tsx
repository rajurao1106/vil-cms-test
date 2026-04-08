"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import api from "@/lib/api"; // Aapka Axios Client
import { toast } from "react-toastify";
import axios from "axios"; // Import axios for type checking

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
      Loading Editor...
    </div>
  ),
});

export default function ChairmanSection() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [signaturePath, setSignaturePath] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/chairman-message");
      const json = res.data;

      const attributes = json.data?.attributes || json.data || json;

      setAuthorName(attributes?.authorName || "");
      setContent(attributes?.messageContent || "");
      setSignaturePath(attributes?.signatureImagePath || "");
    } catch (err: unknown) {
      console.error("Error fetching chairman data:", err);
      
      // Type safe error handling
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      authorName: authorName,
      messageContent: content,
      signatureImagePath: signaturePath,
    };

    try {
      await api.post("/chairman-message/save", payload);
      toast.success("Chairman's Message Saved Successfully!");
    } catch (err: unknown) {
      console.error("Save error:", err);
      
      // Type safe error handling for toast
      let errorMessage = "Failed to save message.";
      
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Chairman Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-3xl border border-red-100 max-w-3xl">
        <h3 className="text-red-600 font-bold text-lg mb-2">Connection Error</h3>
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
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Chairmans Message</h2>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6"
      >
        {/* Author Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Author Name</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Dr. John Doe"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            required
          />
        </div>

        {/* Message Content (Rich Text) */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Message Content</label>
          <div className="min-h-[350px] pb-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-72"
            />
          </div>
        </div>

        {/* Signature Path */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Signature Image URL / Path</label>
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
          disabled={isSaving}
          className={`w-full font-bold py-4 rounded-3xl transition-all duration-200 shadow-lg 
            ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100 active:scale-[0.98]"}`}
        >
          {isSaving ? "Saving..." : "Save Message"}
        </button>
      </form>
    </div>
  );
}