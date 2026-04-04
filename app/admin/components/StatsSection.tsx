"use client";

import React, { useState, useEffect } from "react";

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
  const API_URL = "https://vil-cms.vercel.app/api/stats";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const normalizedData = Array.isArray(data) ? data : data.data || [];
      setStats(
        normalizedData.length > 0
          ? normalizedData
          : [{ title: "", value: "", unit: "", order: 0 }],
      );
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Type-safe Change Handler
   * We split the logic: 'order' expects a number, others expect strings.
   */
  const handleChange = (index: number, field: keyof Stat, value: string) => {
    setStats((prevStats) => {
      const updatedStats = [...prevStats];
      const currentStat = { ...updatedStats[index] };

      if (field === "order") {
        currentStat.order = Number(value) || 0;
      } else if (field === "title" || field === "value" || field === "unit") {
        currentStat[field] = value;
      }

      updatedStats[index] = currentStat;
      return updatedStats;
    });
  };

  const addStatRow = () => {
    setStats([
      ...stats,
      { title: "", value: "", unit: "", order: stats.length },
    ]);
  };

  const removeStatRow = (index: number) => {
    const updatedStats = stats.filter((_, i) => i !== index);
    setStats(
      updatedStats.length > 0
        ? updatedStats
        : [{ title: "", value: "", unit: "", order: 0 }],
    );
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/save-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats }),
      });

      if (res.ok) {
        alert("Statistics synchronized successfully!");
        fetchStats();
      } else {
        alert("Failed to save statistics.");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h2 className="text-3xl font-bold mb-8">Manage Statistics</h2>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        {loading ? (
          <div className="py-10 text-center text-gray-400">
            Loading stats...
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-grow">
                  {[
                    {
                      label: "Title",
                      field: "title",
                      type: "text",
                      placeholder: "Happy Clients",
                    },
                    {
                      label: "Value",
                      field: "value",
                      type: "text",
                      placeholder: "500",
                    },
                    {
                      label: "Unit",
                      field: "unit",
                      type: "text",
                      placeholder: "+",
                    },
                    {
                      label: "Order",
                      field: "order",
                      type: "number",
                      placeholder: "0",
                    },
                  ].map((input) => (
                    <div key={input.field} className="flex flex-col">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1">
                        {input.label}
                      </label>
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        // Type assertion here is safe because we map field to keys
                        value={stat[input.field as keyof Stat] ?? ""}
                        onChange={(e) =>
                          handleChange(
                            index,
                            input.field as keyof Stat,
                            e.target.value,
                          )
                        }
                        className="border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => removeStatRow(index)}
                  className="mt-7 p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  title="Remove row"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={addStatRow}
            className="flex-1 py-4 border-2 border-dashed border-gray-200 text-gray-500 hover:border-teal-500 hover:text-teal-600 rounded-3xl transition-all font-semibold"
          >
            + Add New Stat
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl shadow-lg transition-all font-bold"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}
