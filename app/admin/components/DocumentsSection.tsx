"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

interface Document {
  _id: string;
  documentTitle: string;
  financialYear: string;
  pdfPath: string;
}

export default function DocumentsSection() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  // --- GET DOCUMENTS (Using Axios) ---
  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/documents");
      // Axios directly returns the data
      setDocs(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  // --- UPLOAD DOCUMENT (Using Axios FormData) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    // Agar title chahiye toh filename bhej sakte hain
    formData.append("documentTitle", file.name.split(".")[0]);

    setUploading(true);

    try {
      // Axios automatically headers (multipart/form-data) set kar leta hai
      await api.post("/documents/upload", formData);
      
      toast.success("Document uploaded successfully!");
      fetchDocs(); // Refresh list
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = ""; // Clear input
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Documents</h2>

        <label 
          className={`cursor-pointer px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg
          ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100 active:scale-95"}`}
        >
          {uploading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Uploading...
            </>
          ) : (
            "+ Upload New Doc"
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.doc,.docx"
          />
        </label>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading documents...</div>
        ) : docs.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {docs.map((doc) => (
              <div
                key={doc._id}
                className="flex justify-between items-center py-5 hover:bg-gray-50/50 px-4 rounded-2xl transition-all"
              >
                <div>
                  <p className="font-bold text-gray-800">{doc.documentTitle}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">FY</span>
                    {doc.financialYear || "N/A"}
                  </p>
                </div>
                <a
                  href={doc.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-100 transition-colors"
                >
                  View PDF
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400 font-medium">No documents found.</p>
          </div>
        )}
      </div>
    </div>
  );
}