"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";
import axios from "axios"; // Added for error type guarding

// --- Types ---
interface Stat {
  _id?: string;
  id?: string | number;
  title: string;
  value: string;
  unit: string;
  order: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // --- GET STATS (Using Axios) ---
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/stats");
      const data = res.data;
      const normalizedData = Array.isArray(data) ? data : data.data || [];
      
      setStats(
        normalizedData.length > 0
          ? normalizedData
          : [{ title: "", value: "", unit: "", order: 0 }]
      );
    } catch (error: unknown) {
      console.error("Failed to fetch stats:", error);
      setStats([{ title: "", value: "", unit: "", order: 0 }]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // --- CHANGE HANDLER ---
  const handleChange = (index: number, field: keyof Stat, value: string) => {
    setStats((prevStats) => {
      const updatedStats = [...prevStats];
      const currentStat = { ...updatedStats[index] };

      if (field === "order") {
        currentStat.order = Number(value) || 0;
      } else {
        // FIX: Use a record type cast instead of unknown to allow dynamic assignment
        (currentStat as Record<string, string | number | undefined>)[field] = value;
      }

      updatedStats[index] = currentStat;
      return updatedStats;
    });
  };

  const addStatRow = () => {
    setStats((prev) => [
      ...prev,
      { title: "", value: "", unit: "", order: prev.length },
    ]);
  };

  const removeStatRow = (index: number) => {
    const updatedStats = stats.filter((_, i) => i !== index);
    setStats(
      updatedStats.length > 0
        ? updatedStats
        : [{ title: "", value: "", unit: "", order: 0 }]
    );
  };

  // --- SAVE ALL (Using Axios) ---
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.post("/stats/save-all", { stats });
      
      toast.success("📊 Statistics synchronized successfully!");
      fetchStats();
    } catch (error: unknown) {
      console.error("Save error:", error);
      
      // FIX: Type-safe error handling for Axios
      let errorMessage = "Failed to save statistics.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
        Manage Statistics
      </h2>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
             <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
             <p className="text-gray-400 font-medium">Loading stats...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-start gap-3 group animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-grow bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                  {[
                    { label: "Title", field: "title", type: "text", placeholder: "e.g. Clients" },
                    { label: "Value", field: "value", type: "text", placeholder: "500" },
                    { label: "Unit", field: "unit", type: "text", placeholder: "+" },
                    { label: "Order", field: "order", type: "number", placeholder: "0" },
                  ].map((input) => (
                    <div key={input.field} className="flex flex-col">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1 tracking-widest">
                        {input.label}
                      </label>
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        value={stat[input.field as keyof Stat] ?? ""}
                        onChange={(e) =>
                          handleChange(index, input.field as keyof Stat, e.target.value)
                        }
                        className="border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all bg-white"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => removeStatRow(index)}
                  className="mt-8 p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  title="Remove row"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={addStatRow}
            className="flex-1 py-4 border-2 border-dashed border-gray-200 text-gray-400 hover:border-teal-500 hover:text-teal-600 rounded-3xl transition-all font-bold text-sm"
          >
            + Add New Stat Row
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || loading}
            className={`flex-1 py-4 rounded-3xl shadow-lg transition-all font-bold text-white
              ${isSaving ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-100 active:scale-95'}`}
          >
            {isSaving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}