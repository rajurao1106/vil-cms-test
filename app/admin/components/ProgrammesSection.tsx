"use client";

import React, { useState, useEffect } from "react";

// --- Types ---
interface Programme {
  _id?: string;
  programmeTitle: string;
  reviewDate: string;
  programmeContent: string;
  pdfUrl: string;
}

export default function ProgrammesSection() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState<Programme>({
    programmeTitle: "",
    reviewDate: "",
    programmeContent: "",
    pdfUrl: "",
  });

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/programmes");
      const data = await res.json();
      // Supporting both direct arrays and Strapi-style { data: [] } objects
      const programmesArray = Array.isArray(data) ? data : data.data || [];
      setProgrammes(programmesArray);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/programmes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Programme added successfully!");
        setFormData({
          programmeTitle: "",
          reviewDate: "",
          programmeContent: "",
          pdfUrl: "",
        });
        fetchProgrammes();
      }
    } catch (err) {
      alert("Error adding programme");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 text-gray-800">
      {/* --- ADD PROGRAMME FORM --- */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-indigo-900">
          New Programme Entry
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 ml-1 text-gray-600">
                Programme Title
              </label>
              <input
                name="programmeTitle"
                placeholder="e.g. Annual Review 2026"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.programmeTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 ml-1 text-gray-600">
                Review Date
              </label>
              <input
                type="date"
                name="reviewDate"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.reviewDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 ml-1 text-gray-600">
              PDF Document URL
            </label>
            <input
              name="pdfUrl"
              placeholder="https://example.com/document.pdf"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.pdfUrl}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 ml-1 text-gray-600">
              Programme Content (HTML)
            </label>
            <textarea
              name="programmeContent"
              placeholder="Describe the programme details here..."
              className="w-full p-3 border rounded-xl h-32 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.programmeContent}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            Save Programme
          </button>
        </form>
      </section>

      {/* --- PROGRAMMES LIST --- */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Active Programmes
        </h2>
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 animate-pulse">
                Fetching schedules...
              </p>
            </div>
          ) : programmes.length > 0 ? (
            programmes.map((p, idx) => (
              <div
                key={p._id || idx}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {p.programmeTitle}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-medium">
                      📅{" "}
                      {p.reviewDate
                        ? new Date(p.reviewDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "No date set"}
                    </span>
                    {p.pdfUrl && (
                      <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold">
                        PDF Attached
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {p.pdfUrl && (
                    <a
                      href={p.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                    >
                      View PDF
                    </a>
                  )}
                  <button className="flex-1 md:flex-none bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition">
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-gray-400">No programmes listed yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
