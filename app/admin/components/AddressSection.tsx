"use client";
import api from "@/lib/api"; // Yeh aapka Axios Instance hai
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddressSection() {
  const [address, setAddress] = useState({
    headOffice: "",
    cityOffice: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- READ (Using Axios) ---
  const fetchAddress = async () => {
    try {
      setIsLoading(true);
      // Axios automatically JSON parse kar leta hai aur baseURL handle karta hai
      const res = await api.get("/addresses/save");
      const data = res.data;
      
      setAddress({
        headOffice: data?.headOffice || "",
        cityOffice: data?.cityOffice || "",
      });
    } catch (error: unknown) {
      console.error("Failed to fetch:", error);
      // Error interceptor handles the toast, but safety check:
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // --- CREATE / UPDATE (Using Axios) ---
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // No backticks needed, just the endpoint
      await api.post("/addresses/save", address);
      toast.success("Address Saved successfully!");
    } catch (error) {
      console.error("Error saving address:", error);
      // Interceptor will show the error toast
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE / CLEAR ---
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to clear these addresses?")) return;

    try {
      await api.post("/addresses/save", { headOffice: "", cityOffice: "" });
      setAddress({ headOffice: "", cityOffice: "" });
      toast.info("Addresses Cleared!");
    } catch (error) {
      console.error("Failed to delete.");
    }
  };

  if (isLoading) return (
    <div className="p-8 flex items-center gap-3">
      <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full"></div>
      <p>Loading addresses...</p>
    </div>
  );

  return (
    <div className="max-w-2xl p-4 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Addresses & Sister Concerns</h2>
      
      <form
        onSubmit={handleSave}
        className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6"
      >
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-600">
            Head Office
          </label>
          <textarea
            name="headOffice"
            value={address.headOffice}
            onChange={handleChange}
            placeholder="Enter Head Office Address"
            className="w-full border border-gray-200 rounded-3xl p-5 h-32 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-600">
            City Office
          </label>
          <textarea
            name="cityOffice"
            value={address.cityOffice}
            onChange={handleChange}
            placeholder="Enter City Office Address"
            className="w-full border border-gray-200 rounded-3xl p-5 h-32 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex-1 py-4 rounded-3xl font-bold transition-all shadow-lg shadow-teal-100
              ${isSaving ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'}`}
          >
            {isSaving ? "Saving..." : "Save Addresses"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="px-8 bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-3xl font-bold transition-all border border-red-100 active:scale-95"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}