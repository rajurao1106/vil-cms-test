"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";
import axios from "axios"; // Import axios for type guarding

interface Job {
  _id: string;
  jobTitle: string;
  department: string;
  location: string;
  jobType: string;
  isActive: boolean;
  description: string;
  requirements: string;
}

export default function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    location: "",
    jobType: "Full-time",
    isActive: true,
    description: "",
    requirements: "",
  });

  // --- GET JOBS ---
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      const data = res.data;
      setJobs(Array.isArray(data) ? data : data.data || []);
    } catch (err: unknown) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // --- POST JOB ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/jobs", formData);
      
      toast.success("🚀 Job Opening Posted Successfully!");
      
      // Reset Form
      setFormData({
        jobTitle: "",
        department: "",
        location: "",
        jobType: "Full-time",
        isActive: true,
        description: "",
        requirements: "",
      });
      
      fetchJobs(); // Refresh List
    } catch (err: unknown) {
      console.error("Error posting job:", err);
      
      // Fix: Type-safe error handling
      let errorMessage = "Failed to post job";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
      
      {/* --- ADD JOB FORM --- */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-teal-900 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-500 rounded-full inline-block"></span>
          Post a New Career Opening
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Job Title</label>
              <input
                name="jobTitle"
                placeholder="e.g. Senior Engineer"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Department</label>
              <input
                name="department"
                placeholder="e.g. Production"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Location</label>
              <input
                name="location"
                placeholder="e.g. Raipur, CG"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Employment Type</label>
              <select
                name="jobType"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none bg-white focus:ring-2 focus:ring-teal-500"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Short Description</label>
            <textarea
              name="description"
              placeholder="What is this role about?"
              className="w-full p-4 border border-gray-200 rounded-2xl h-28 outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-3 bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              className="w-6 h-6 accent-teal-600 cursor-pointer"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive" className="text-teal-900 font-bold cursor-pointer select-none">
              Mark as Active Opening
            </label>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className={`w-full font-bold py-4 rounded-[2rem] transition-all shadow-lg shadow-teal-100 active:scale-95
              ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
          >
            {submitting ? "Processing..." : "Post Job Entry"}
          </button>
        </form>
      </section>

      {/* --- JOBS LIST --- */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Current Openings</h2>
          <p className="text-gray-400 font-medium">{jobs.length} roles found</p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {loading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
               <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
               <p className="text-gray-400 font-medium">Loading careers...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] py-16 text-center text-gray-400">
               No job openings posted yet.
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="group bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-teal-500"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">{job.jobTitle}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        job.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.isActive ? "Hiring" : "Closed"}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium flex items-center gap-2">
                    {job.department} <span className="text-gray-300">•</span> {job.location}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-1 italic max-w-xl">
                    {job.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right hidden md:block px-4">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Type</p>
                    <p className="font-bold text-gray-700">{job.jobType || "Full-time"}</p>
                  </div>
                  <button className="flex-1 md:flex-none bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-teal-600 hover:text-white transition-all border border-gray-200">
                    Edit Role
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}