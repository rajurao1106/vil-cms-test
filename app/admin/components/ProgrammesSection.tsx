"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";
import axios from "axios";

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
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    programmeTitle: "",
    reviewDate: "",
    programmeContent: "",
    pdfUrl: "",
  };

  const [formData, setFormData] = useState<Programme>(initialFormState);

  const fetchProgrammes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/programmes");
      const data = res.data;
      setProgrammes(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgrammes(); }, [fetchProgrammes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- EDIT HANDLER ---
  const handleEdit = (p: Programme) => {
    setEditingId(p._id!);
    // Date formatting for input type="date" (YYYY-MM-DD)
    const formattedDate = p.reviewDate ? new Date(p.reviewDate).toISOString().split('T')[0] : "";
    setFormData({ ...p, reviewDate: formattedDate });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this programme?")) return;
    try {
      await api.delete(`/programmes/${id}`);
      toast.success("🗑️ Programme deleted!");
      fetchProgrammes();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await api.put(`/programmes/${editingId}`, formData);
        toast.success("🔄 Programme updated!");
      } else {
        await api.post("/programmes/add", formData);
        toast.success("🎯 Programme added!");
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchProgrammes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* --- FORM SECTION --- */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-indigo-900 flex items-center gap-2">
          <span className={`w-2 h-8 rounded-full inline-block ${editingId ? 'bg-orange-500' : 'bg-indigo-500'}`}></span>
          {editingId ? "Edit Programme" : "New Programme Entry"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Title</label>
              <input name="programmeTitle" className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.programmeTitle} onChange={handleChange} required />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Review Date</label>
              <input type="date" name="reviewDate" className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={formData.reviewDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">PDF URL</label>
            <input name="pdfUrl" className="p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.pdfUrl} onChange={handleChange} required />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Content (HTML)</label>
            <textarea name="programmeContent" className="w-full p-4 border rounded-2xl h-32 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={formData.programmeContent} onChange={handleChange} required />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={isSaving} className={`flex-1 font-bold py-4 rounded-3xl text-white shadow-lg transition-all ${isSaving ? 'bg-gray-400' : editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isSaving ? "Saving..." : editingId ? "Update Programme" : "Save Programme"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData(initialFormState); }} className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-3xl hover:bg-gray-200">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* --- LIST SECTION --- */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Active Programmes</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : programmes.map((p) => (
            <div key={p._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center group hover:shadow-md transition-all">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600">{p.programmeTitle}</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">
                  📅 {new Date(p.reviewDate).toLocaleDateString("en-GB")}
                </span>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <button onClick={() => handleEdit(p)} className="px-5 py-2 text-sm font-bold text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id!)} className="px-5 py-2 text-sm font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all">
                  Delete
                </button>
                <a href={p.pdfUrl} target="_blank" className="px-5 py-2 text-sm font-bold bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100">
                  PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}