"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";
import axios from "axios";

interface Job {
  _id?: string;
  jobTitle: string;
  department: string;
  location: string;
  jobType: string;
  isActive: boolean;
  description: string;
  requirements: string[]; // Backend array expect karta hai
}

export default function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    jobTitle: "",
    department: "",
    location: "Raipur, CG",
    jobType: "Full-time",
    isActive: true,
    description: "",
    requirements: [""], // Dynamic array handling
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      setJobs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // --- Requirements Array Logic ---
  const handleRequirementChange = (index: number, value: string) => {
    const newReqs = [...formData.requirements];
    newReqs[index] = value;
    setFormData({ ...formData, requirements: newReqs });
  };

  const addRequirementField = () => setFormData({ ...formData, requirements: [...formData.requirements, ""] });

  // --- Actions ---
  const handleEdit = (job: Job) => {
    setEditingId(job._id || null);
    setFormData({
      jobTitle: job.jobTitle,
      department: job.department,
      location: job.location,
      jobType: job.jobType || "Full-time",
      isActive: job.isActive,
      description: job.description,
      requirements: job.requirements.length > 0 ? job.requirements : [""],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job removed");
      fetchJobs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/jobs/${editingId}`, formData);
        toast.success("Job updated!");
      } else {
        await api.post("/jobs", formData);
        toast.success("Job posted!");
      }
      setFormData(initialForm);
      setEditingId(null);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-teal-900">
          {editingId ? "📝 Edit Job Opening" : "🚀 Post a New Career Opening"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input name="jobTitle" placeholder="Job Title" className="w-full p-4 border rounded-2xl outline-none" value={formData.jobTitle} onChange={handleChange} required />
            <input name="department" placeholder="Department" className="w-full p-4 border rounded-2xl outline-none" value={formData.department} onChange={handleChange} required />
            <input name="location" placeholder="Location" className="w-full p-4 border rounded-2xl outline-none" value={formData.location} onChange={handleChange} />
            <select name="jobType" className="w-full p-4 border rounded-2xl bg-white" value={formData.jobType} onChange={handleChange}>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <textarea name="description" placeholder="Description" className="w-full p-4 border rounded-2xl h-28" value={formData.description} onChange={handleChange} required />

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-500">Requirements</label>
            {formData.requirements.map((req, i) => (
              <input key={i} placeholder={`Requirement ${i + 1}`} className="w-full p-3 border rounded-xl" value={req} onChange={(e) => handleRequirementChange(i, e.target.value)} />
            ))}
            <button type="button" onClick={addRequirementField} className="text-teal-600 text-sm font-bold">+ Add Requirement</button>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" name="isActive" id="isActive" className="w-5 h-5 accent-teal-600" checked={formData.isActive} onChange={handleChange} />
            <label htmlFor="isActive" className="font-bold text-teal-900">Active Opening</label>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className={`flex-1 font-bold py-4 rounded-[2rem] text-white ${editingId ? 'bg-orange-500' : 'bg-teal-600'}`}>
              {submitting ? "Processing..." : editingId ? "Update Job" : "Post Job"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }} className="px-8 bg-gray-100 rounded-[2rem] font-bold text-gray-500">Cancel</button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Current Openings</h2>
        <div className="space-y-5">
          {loading ? <div className="text-center py-10">Loading careers...</div> : jobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-[2rem] border flex justify-between items-center group hover:border-teal-500 transition-all">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{job.jobTitle}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${job.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {job.isActive ? "Hiring" : "Closed"}
                  </span>
                </div>
                <p className="text-gray-500">{job.department} • {job.location}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(job)} className="px-4 py-2 bg-gray-50 text-teal-600 rounded-xl font-bold hover:bg-teal-600 hover:text-white transition-all">Edit</button>
                <button onClick={() => handleDelete(job._id!)} className="px-4 py-2 bg-gray-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}