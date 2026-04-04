"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

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
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    profileImageUrl: "",
  });
  const [imageSrcs, setImageSrcs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/board-members");
      const data = await res.json();
      // Ensure we handle cases where the API might return an object with a data property
      setMembers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://vil-cms.vercel.app/api/board-members/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        setShowForm(false);
        setFormData({ fullName: "", designation: "", profileImageUrl: "" });
        fetchMembers();
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const deleteMember = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await fetch(`https://vil-cms.vercel.app/api/board/${id}`, {
        method: "DELETE",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Board of Directors</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl transition-colors"
        >
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600">
                Designation
              </th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600">
                Image
              </th>
              <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => {
              const key = member._id || member.id || "";
              return (
                <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {member.fullName}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {member.designation}
                  </td>
                  <td className="py-4 px-6">
                    <Image
                      src={imageSrcs[key] || member.profileImageUrl}
                      alt={member.fullName}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover bg-gray-100"
                      onError={() =>
                        setImageSrcs((prev) => ({
                          ...prev,
                          [key]: "",
                        }))
                      }
                    />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => deleteMember(key)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Add Board Member
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profileImageUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileImageUrl: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 font-medium transition-colors"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
