"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api"; // Aapka Axios Client
import { toast } from "react-toastify";

interface Member {
  _id?: string;
  id?: string;
  fullName: string;
  designation: string;
  profileImageUrl: string;
}

export default function BoardSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    profileImageUrl: "",
  });
  const [imageSrcs, setImageSrcs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMembers();
  }, []);

  // --- GET MEMBERS (Using Axios) ---
  const fetchMembers = async () => {
    try {
      const res = await api.get("/board-members");
      const data = res.data;
      setMembers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    }
  };

  // --- ADD MEMBER (Using Axios) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Axios directly JSON handle karta hai
      await api.post("/board-members/add", formData);
      
      toast.success("Board Member added successfully!");
      setShowForm(false);
      setFormData({ fullName: "", designation: "", profileImageUrl: "" });
      fetchMembers();
    } catch (error) {
      console.error("Error adding member:", error);
      // Interceptor will handle the error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE MEMBER (Using Axios) ---
  const deleteMember = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      // Note: Endpoint matching your backend (board vs board-members)
      await api.delete(`/board-members/${id}`); 
      toast.success("Member deleted successfully");
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Board of Directors</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          + Add Member
        </button>
      </div>

      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-5 px-6 text-sm font-semibold text-gray-600">Name</th>
              <th className="py-5 px-6 text-sm font-semibold text-gray-600">Designation</th>
              <th className="py-5 px-6 text-sm font-semibold text-gray-600 text-center">Image</th>
              <th className="py-5 px-6 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">No members found.</td>
              </tr>
            ) : (
              members.map((member) => {
                const key = (member._id || member.id || "").toString();
                return (
                  <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{member.fullName}</td>
                    <td className="py-4 px-6 text-gray-600">{member.designation}</td>
                    <td className="py-4 px-6 flex justify-center">
                      <div className="relative w-12 h-12">
                        <Image
                          // src={imageSrcs[key] || member.profileImageUrl || "https://via.placeholder.com/150"}
                          src={"/"}
                          alt={member.fullName}
                          fill
                          className="rounded-xl object-cover bg-gray-100"
                          onError={() =>
                            setImageSrcs((prev) => ({
                              ...prev,
                              [key]: "https://via.placeholder.com/150",
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => deleteMember(key)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Add Board Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profileImageUrl}
                  onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border border-gray-200 rounded-2xl hover:bg-gray-50 font-bold text-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-all
                    ${isSubmitting ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-100 active:scale-95'}`}
                >
                  {isSubmitting ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}