"use client";
import React, { useState, useEffect } from "react";

export default function AddressSection() {
  const [address, setAddress] = useState({
    headOffice: "",
    cityOffice: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- READ ---
  const fetchAddress = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://vil-cms.vercel.app/api/addresses/save");
      const data = await res.json();
      // Ensure we have fallback strings to avoid uncontrolled input errors
      setAddress({
        headOffice: data?.headOffice || "",
        cityOffice: data?.cityOffice || "",
      });
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  // Handle input changes (Update local state)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // --- CREATE / UPDATE ---
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/addresses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });

      if (res.ok) {
        alert("Address Saved successfully!");
      }
    } catch (error) {
      alert("Error saving address");
    }
  };

  // --- DELETE (Clear) ---
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to clear these addresses?")) return;

    try {
      // Assuming your backend supports DELETE or a POST with empty values
      await fetch("https://vil-cms.vercel.app/api/addresses/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headOffice: "", cityOffice: "" }),
      });
      setAddress({ headOffice: "", cityOffice: "" });
      alert("Addresses Cleared!");
    } catch (error) {
      alert("Failed to delete.");
    }
  };

  if (isLoading) return <p className="p-8">Loading addresses...</p>;

  return (
    <div className="max-w-2xl p-4">
      <h2 className="text-3xl font-bold mb-8">Addresses & Sister Concerns</h2>
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-8 shadow space-y-6"
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Head Office
          </label>
          <textarea
            name="headOffice"
            value={address.headOffice}
            onChange={handleChange}
            placeholder="Enter Head Office Address"
            className="w-full border rounded-3xl p-4 h-28 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            City Office
          </label>
          <textarea
            name="cityOffice"
            value={address.cityOffice}
            onChange={handleChange}
            placeholder="Enter City Office Address"
            className="w-full border rounded-3xl p-4 h-28 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-3xl font-semibold transition-colors"
          >
            Save Addresses
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="px-6 bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-3xl font-semibold transition-colors border border-red-200"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
