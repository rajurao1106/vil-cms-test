"use client";
import React, { useState, useEffect } from "react";

interface Member {
  _id: string;
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

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/board-members");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Changed from FormData to JSON
    await fetch("https://vil-cms.vercel.app/api/board-members/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setShowForm(false);
    setFormData({ fullName: "", designation: "", profileImageUrl: "" });
    fetchMembers();
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete member?")) return;
    await fetch(`https://vil-cms.vercel.app/api/board-members/${id}`, {
      method: "DELETE",
    });
    fetchMembers();
  };

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-bold">Board of Directors</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 text-white px-6 py-3 rounded-2xl"
        >
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Designation</th>
              <th className="py-4 px-6 text-left">Image</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="border-t">
                <td className="py-4 px-6 font-medium">{member.fullName}</td>
                <td className="py-4 px-6">{member.designation}</td>
                <td className="py-4 px-6">
                  <img
                    src={member.profileImageUrl}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => deleteMember(member._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">Add Board Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
                required
              />
              <input
                type="text"
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
                required
              />
              {/* Changed from type="file" to type="text" */}
              <input
                type="text"
                placeholder="Profile Image URL"
                value={formData.profileImageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, profileImageUrl: e.target.value })
                }
                className="w-full border rounded-2xl px-4 py-3"
                required
              />
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 border rounded-3xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-teal-600 text-white rounded-3xl"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
