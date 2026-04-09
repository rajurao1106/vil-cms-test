"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";

interface Member {
  _id?: string;
  name: string;
  designation: string;
}

interface Committee {
  _id: string;
  committeeName: string;
  description: string;
  members: Member[];
}

export default function BoardSection() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    committeeName: "",
    description: "",
    members: [] as Member[],
  });

  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      const res = await api.get("/committees");
      setCommittees(res.data);
    } catch (error) {
      toast.error("Failed to load committees");
    }
  };

  // --- Member Row Helpers ---
  const addMemberRow = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: "", designation: "" }],
    });
  };

  const updateMemberRow = (index: number, field: keyof Member, value: string) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  const removeMemberRow = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    });
  };

  // --- Main Actions ---
  const handleEdit = (committee: Committee) => {
    setEditingId(committee._id);
    setFormData({
      committeeName: committee.committeeName,
      description: committee.description,
      members: committee.members,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/committees/${editingId}`, formData);
        toast.success("Committee updated!");
      } else {
        await api.post("/committees/add", formData);
        toast.success("Committee created!");
      }
      closeModal();
      fetchCommittees();
    } catch (error) {
      toast.error("Error saving committee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCommittee = async (id: string) => {
    if (!confirm("Are you sure? This will delete the committee and all its members.")) return;
    try {
      await api.delete(`/committees/${id}`);
      toast.success("Deleted successfully");
      fetchCommittees();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ committeeName: "", description: "", members: [] });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Committees & Board</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          + Create Committee
        </button>
      </div>

      <div className="grid gap-6">
        {committees.map((comm) => (
          <div key={comm._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-teal-800">{comm.committeeName}</h3>
                <p className="text-gray-500">{comm.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(comm)} className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium">Edit</button>
                <button onClick={() => deleteCommittee(comm._id)} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium">Delete</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full mt-4">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b">
                    <th className="pb-2 font-medium">Member Name</th>
                    <th className="pb-2 font-medium">Designation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {comm.members.map((m) => (
                    <tr key={m._id}>
                      <td className="py-3 font-semibold text-gray-800">{m.name}</td>
                      <td className="py-3 text-gray-600">{m.designation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">{editingId ? 'Update' : 'Add'} Committee</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <input
                  placeholder="Committee Name (e.g. Audit Committee)"
                  value={formData.committeeName}
                  onChange={(e) => setFormData({ ...formData, committeeName: e.target.value })}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-teal-500"
                  required
                />
                <textarea
                  placeholder="Short Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-700">Committee Members</h4>
                  <button type="button" onClick={addMemberRow} className="text-teal-600 font-bold text-sm">+ Add Person</button>
                </div>
                
                <div className="space-y-3">
                  {formData.members.map((m, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => updateMemberRow(index, 'name', e.target.value)}
                        className="flex-1 p-3 bg-gray-50 rounded-xl border-none text-sm"
                        required
                      />
                      <input
                        placeholder="Designation"
                        value={m.designation}
                        onChange={(e) => updateMemberRow(index, 'designation', e.target.value)}
                        className="flex-1 p-3 bg-gray-50 rounded-xl border-none text-sm"
                        required
                      />
                      <button type="button" onClick={() => removeMemberRow(index)} className="text-red-400 px-2">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 font-bold text-gray-500">Cancel</button>
                <button 
                  disabled={isSubmitting}
                  className="flex-1 bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 disabled:bg-gray-300"
                >
                  {isSubmitting ? "Saving..." : "Save Committee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}