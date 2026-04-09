"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";
import axios from "axios";

interface Review {
  _id: string;
  name: string;
  rating: number;
  reviewText: string;
  isApproved: boolean;
  heading?: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    name: "",
    rating: 5,
    reviewText: "",
    heading: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/reviews");
      setReviews(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // --- DELETE ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // --- TOGGLE APPROVAL ---
  const toggleApproval = async (review: Review) => {
    try {
      await api.put(`/reviews/${review._id}`, { isApproved: !review.isApproved });
      toast.info(review.isApproved ? "Review Unapproved" : "Review Approved");
      fetchReviews();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  // --- EDIT MODE ---
  const startEdit = (review: Review) => {
    setEditingId(review._id);
    setFormData({
      name: review.name,
      rating: review.rating,
      reviewText: review.reviewText,
      heading: review.heading || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/reviews/${editingId}`, formData);
        toast.success("Review updated!");
      } else {
        await api.post("/reviews", formData);
        toast.success("Review added!");
      }
      setFormData(initialForm);
      setEditingId(null);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          Review Management
        </h2>
      </div>

      {/* --- FORM --- */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6">{editingId ? "Edit Review" : "Add Manual Review"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <input
            placeholder="Name"
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <select
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
        </div>
        <textarea
          placeholder="Review Text..."
          className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 h-32 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.reviewText}
          onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
          required
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-4 rounded-2xl font-bold text-white transition-all ${editingId ? 'bg-orange-500' : 'bg-blue-600'}`}
          >
            {isSubmitting ? "Processing..." : editingId ? "Update Review" : "Post Review"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }} className="px-8 py-4 bg-gray-100 rounded-2xl font-bold">Cancel</button>
          )}
        </div>
      </form>

      {/* --- LIST --- */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-10">Loading reviews...</div>
        ) : reviews.map((review) => (
          <div key={review._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-800">{review.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${review.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {review.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="flex text-yellow-400 text-xs mb-2">{"★".repeat(review.rating)}</div>
              <p className="text-gray-500 text-sm italic">"{review.reviewText}"</p>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => toggleApproval(review)} 
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${review.isApproved ? 'bg-gray-100 text-gray-600' : 'bg-green-600 text-white'}`}
              >
                {review.isApproved ? "Unapprove" : "Approve"}
              </button>
              <button 
                onClick={() => startEdit(review)} 
                className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(review._id)} 
                className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}