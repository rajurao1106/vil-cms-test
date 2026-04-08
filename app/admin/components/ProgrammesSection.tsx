"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";
import axios from "axios"; // Added for type guarding

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
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Programme>({
    programmeTitle: "",
    reviewDate: "",
    programmeContent: "",
    pdfUrl: "",
  });

  // --- GET PROGRAMMES (Using Axios) ---
  const fetchProgrammes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/programmes");
      const data = res.data;
      const programmesArray = Array.isArray(data) ? data : data.data || [];
      setProgrammes(programmesArray);
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgrammes();
  }, [fetchProgrammes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- POST PROGRAMME (Using Axios) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post("/programmes/add", formData);
      
      toast.success("🎯 Programme added successfully!");
      setFormData({
        programmeTitle: "",
        reviewDate: "",
        programmeContent: "",
        pdfUrl: "",
      });
      fetchProgrammes(); 
    } catch (err: unknown) {
      console.error("Save error:", err);

      // --- FIX: Type-safe error message extraction ---
      let errorMessage = "Error adding programme";
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 text-gray-800 animate-in fade-in duration-500">
      {/* --- ADD PROGRAMME FORM --- */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-indigo-900 flex items-center gap-2">
          <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block"></span>
          New Programme Entry
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Programme Title
              </label>
              <input
                name="programmeTitle"
                placeholder="e.g. Annual Review 2026"
                className="p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.programmeTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Review Date
              </label>
              <input
                type="date"
                name="reviewDate"
                className="p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                value={formData.reviewDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              PDF Document URL
            </label>
            <input
              name="pdfUrl"
              placeholder="https://example.com/document.pdf"
              className="p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.pdfUrl}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Programme Content (HTML Support)
            </label>
            <textarea
              name="programmeContent"
              placeholder="Describe the programme details here..."
              className="w-full p-4 border border-gray-200 rounded-2xl h-36 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              value={formData.programmeContent}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full font-bold py-4 rounded-3xl transition-all shadow-lg active:scale-95
              ${isSaving ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}`}
          >
            {isSaving ? "Saving Programme..." : "Save Programme to Dashboard"}
          </button>
        </form>
      </section>

      {/* --- PROGRAMMES LIST --- */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Active Programmes
        </h2>
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium">Fetching schedules...</p>
            </div>
          ) : programmes.length > 0 ? (
            programmes.map((p, idx) => (
              <div
                key={p._id || idx}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all group"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {p.programmeTitle}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">
                      📅 {p.reviewDate
                        ? new Date(p.reviewDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "No date set"}
                    </span>
                    {p.pdfUrl && (
                      <span className="text-[10px] uppercase tracking-widest bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-black">
                        PDF Linked
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
                      className="flex-1 md:flex-none text-center bg-gray-50 text-gray-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      View PDF
                    </a>
                  )}
                  <button className="flex-1 md:flex-none bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4 grayscale opacity-50">📂</div>
              <p className="text-gray-400 font-bold">No programmes listed in the database.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}