"use client";
import React, { useState, useEffect } from "react";

interface Document {
  _id: string;
  documentTitle: string;
  financialYear: string;
  pdfPath: string;
}

export default function DocumentsSection() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/documents");
      const data = await res.json();
      setDocs(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    // Add any extra fields your backend expects, e.g.:
    // formData.append("documentTitle", file.name);

    setUploading(true);

    try {
      const res = await fetch(
        "https://vil-cms.vercel.app/api/documents/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (res.ok) {
        alert("Upload successful!");
        fetchDocs(); // Refresh the list
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
      e.target.value = ""; // Clear the input
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Documents</h2>

        {/* Upload Button Logic */}
        <label className="cursor-pointer bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
          {uploading ? "Uploading..." : "Upload New Doc"}
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.doc,.docx"
          />
        </label>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow">
        {docs.length > 0 ? (
          docs.map((doc) => (
            <div
              key={doc._id}
              className="flex justify-between items-center py-4 border-b last:border-none"
            >
              <div>
                <p className="font-medium">{doc.documentTitle}</p>
                <p className="text-sm text-gray-500">{doc.financialYear}</p>
              </div>
              <a
                href={doc.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                View PDF
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No documents found.</p>
        )}
      </div>
    </div>
  );
}
