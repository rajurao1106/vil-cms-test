"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus, X, Save } from "lucide-react"; // Icons for better UI

interface ContactData {
  _id?: string;
  hrPhone: string;
  adminPhone: string;
  primaryEmailHR: string;
  adminEmail: string;
  websiteUrl: string;
}

export default function ContactSection() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<ContactData>({
    hrPhone: "",
    adminPhone: "",
    primaryEmailHR: "",
    adminEmail: "",
    websiteUrl: "",
  });

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/contact-page-settings/contact-info");
      if (res.data) {
        setContactData(res.data);
        setFormData(res.data);
      }
    } catch (error: any) {
      console.error("Error fetching contact data:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load contact info");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If contactData exists, use PUT, otherwise POST
      const method = contactData ? "put" : "post";
      const res = await api[method]("/contact-page-settings/contact-info", formData);
      
      setContactData(res.data);
      setIsEditing(false);
      toast.success("Contact info saved successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving data");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete all contact info?")) return;
    
    try {
      await api.delete("/contact-info");
      setContactData(null);
      setFormData({
        hrPhone: "",
        adminPhone: "",
        primaryEmailHR: "",
        adminEmail: "",
        websiteUrl: "",
      });
      toast.success("Contact info deleted");
    } catch (error: any) {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex items-center gap-3">
        <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full"></div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Contact Management</h2>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              {contactData ? <Pencil size={18} /> : <Plus size={18} />}
              {contactData ? "Edit Info" : "Add Info"}
            </button>
            {contactData && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Delete Everything"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        /* EDIT/CREATE FORM */
        <form onSubmit={handleSaveOrUpdate} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">HR Phone</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.hrPhone}
                onChange={(e) => setFormData({ ...formData, hrPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Admin Phone</label>
              <input
                type="text"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.adminPhone}
                onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">HR Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.primaryEmailHR}
                onChange={(e) => setFormData({ ...formData, primaryEmailHR: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Admin Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Website URL</label>
              <input
                type="url"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700"
            >
              <Save size={18} /> Save Details
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        </form>
      ) : (
        /* DATA DISPLAY */
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8">
          {!contactData ? (
            <div className="text-center py-10">
              <p className="text-gray-400">No contact information found. Click "Add Info" to create it.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Phone Numbers</p>
                <p className="text-gray-800"><strong>HR:</strong> {contactData.hrPhone || "N/A"}</p>
                <p className="text-gray-800"><strong>Admin:</strong> {contactData.adminPhone || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Email Addresses</p>
                <p className="text-gray-800"><strong>HR:</strong> {contactData.primaryEmailHR || "N/A"}</p>
                <p className="text-gray-800"><strong>Admin:</strong> {contactData.adminEmail || "N/A"}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Website</p>
                <p className="text-teal-600 underline decoration-2 underline-offset-4">
                  {contactData.websiteUrl || "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}