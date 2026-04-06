"use client";
import api from "@/lib/api"; // Aapka Axios instance
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Member {
  _id: string;
  fullName: string;
  designation: string;
  profileImageUrl: string;
}

export default function BoardSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  // --- READ (Axios) ---
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/board-members");
      // Axios directly data return karta hai
      setMembers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- CREATE (Axios) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/board-members/add", formData);
      
      toast.success("Member added successfully!");
      setShowForm(false);
      setFormData({ fullName: "", designation: "", profileImageUrl: "" });
      fetchMembers();
    } catch (error) {
      console.error("Add error:", error);
      // Interceptor will handle the toast message
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE (Axios) ---
  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await api.delete(`/board-members/${id}`);
      toast.success("Member removed!");
      fetchMembers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-4 animate-in fade-in duration-500">
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
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-5 px-6 text-left text-sm font-semibold text-gray-600">Image</th>
              <th className="py-5 px-6 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="py-5 px-6 text-left text-sm font-semibold text-gray-600">Designation</th>
              <th className="py-5 px-6 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">Loading members...</td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">No members found.</td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <img
                      src={member.profileImageUrl || "https://via.placeholder.com/150"}
                      alt={member.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100"
                    />
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-800">{member.fullName}</td>
                  <td className="py-4 px-6 text-gray-600">{member.designation}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => deleteMember(member._id)}
                      className="text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Add Board Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Full Name</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Designation</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Profile Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
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
                  className="flex-1 py-4 border border-gray-200 rounded-2xl text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-all
                    ${isSubmitting ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-100 active:scale-95'}`}
                >
                  {isSubmitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}