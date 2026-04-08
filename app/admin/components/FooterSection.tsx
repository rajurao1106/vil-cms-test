"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

interface Link {
  _id: string;
  title: string;
  url: string;
  section: string;
}

export default function FooterSection() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  // --- GET FOOTER LINKS (Using Axios) ---
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/footer");
      // Axios directly returns data
      setDocs(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (error) {
      console.error("Error fetching footer links:", error);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE LINK (Optional logic but good for management) ---
  const deleteLink = async (id: string) => {
    if (!confirm("Remove this link from footer?")) return;
    try {
      await api.delete(`/footer/${id}`);
      toast.success("Link removed");
      fetchLinks();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Footer Management</h2>
        <button 
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-teal-100 transition-all active:scale-95"
          onClick={() => toast.info("Add Link feature can be added here")}
        >
          + Add Link
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading footer links...</div>
        ) : links.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {links.map((link) => (
              <div
                key={link._id}
                className="flex justify-between items-center py-5 hover:bg-gray-50/50 px-4 rounded-2xl transition-all group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-800">{link.title}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {link.section || "General"}
                    </span>
                  </div>
                  <p className="text-sm text-teal-600 truncate max-w-xs md:max-w-md">
                    {link.url}
                  </p>
                </div>

                <button 
                  onClick={() => deleteLink(link._id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-sm font-semibold transition-all px-3 py-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 font-medium">
            No footer links found.
          </div>
        )}
      </div>
    </div>
  );
}

function setDocs(arg0: unknown) {
  throw new Error("Function not implemented.");
}