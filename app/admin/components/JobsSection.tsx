"use client";
import React, { useState, useEffect } from "react";

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

  // Form State
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    location: "",
    jobType: "Full-time", // Full-time, Part-time, Remote
    isActive: true,
    description: "",
    requirements: "", // Will be handled as text/markdown
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target;
    const { name, value } = target;
    let newValue: string | boolean = value;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      newValue = target.checked;
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Job Opening Posted!");
        setFormData({
          jobTitle: "",
          department: "",
          location: "",
          jobType: "Full-time",
          isActive: true,
          description: "",
          requirements: "",
        });
        fetchJobs();
      }
    } catch (err) {
      alert("Error posting job");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* --- ADD JOB FORM --- */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-teal-900">
          Post a New Career Opening
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="jobTitle"
              placeholder="Job Title (e.g. Senior Engineer)"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
            <input
              name="department"
              placeholder="Department (e.g. Production)"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <input
              name="location"
              placeholder="Location (e.g. Raipur, CG)"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.location}
              onChange={handleChange}
            />
            <select
              name="jobType"
              className="p-3 border rounded-xl outline-none"
              value={formData.jobType}
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Brief Job Description"
            className="w-full p-3 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-teal-500"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="flex items-center gap-3 bg-teal-50 p-3 rounded-xl">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              className="w-5 h-5 accent-teal-600"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label
              htmlFor="isActive"
              className="text-teal-800 font-medium cursor-pointer"
            >
              Mark as Active Opening
            </label>
          </div>

          <button className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100">
            Post Job Entry
          </button>
        </form>
      </section>

      {/* --- JOBS LIST --- */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Current Openings
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <p className="text-center text-gray-400">Loading careers...</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.jobTitle}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {job.isActive ? "Hiring" : "Closed"}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium">
                    {job.department} <span className="mx-2">•</span>{" "}
                    {job.location}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-1 italic">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Type
                    </p>
                    <p className="font-semibold text-gray-700">
                      {job.jobType || "Full-time"}
                    </p>
                  </div>
                  <button className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:bg-teal-600 transition-colors">
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
