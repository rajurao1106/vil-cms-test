"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

// --- Types ---
interface Review {
  id?: string | number;
  _id?: string;
  name: string;
  rating: number;
  reviewText: string;
  attributes?: {
    name: string;
    rating: number;
    reviewText: string;
  };
}

interface ReviewFormData {
  name: string;
  rating: number;
  reviewText: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    rating: 5,
    reviewText: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- GET REVIEWS (Using Axios) ---
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/reviews");
      const data = res.data;

      // Normalize data (Support for direct array or Strapi data object)
      const reviewsArray = Array.isArray(data) ? data : data.data || [];
      setReviews(reviewsArray);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // --- POST REVIEW (Using Axios) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Tip: Agar Strapi use kar rahe hain toh payload: { data: formData } bhejien
      await api.post("/reviews", formData);
      
      toast.success("⭐ Review posted successfully!");
      setFormData({ name: "", rating: 5, reviewText: "" }); // Reset form
      fetchReviews(); // Refresh list
    } catch (error: any) {
      console.error("Error posting review:", error);
      toast.error(error.response?.data?.message || "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
        <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
        Reviews & Testimonials
      </h2>

      {/* --- POST REVIEW FORM --- */}
      <form
        onSubmit={handleSubmit}
        className="mb-12 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
      >
        <h3 className="text-xl font-bold mb-6 text-gray-800">Leave a Review</h3>
        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Rating</label>
            <div className="relative">
              <select
                className="w-full p-4 rounded-2xl border border-gray-200 outline-none bg-gray-50/50 focus:ring-2 focus:ring-blue-500 transition-all appearance-none font-medium text-gray-700"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                ▼
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Review Text</label>
            <textarea
              placeholder="Tell us about your experience..."
              className="w-full p-4 rounded-2xl border border-gray-200 outline-none h-32 focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50 resize-none"
              value={formData.reviewText}
              onChange={(e) =>
                setFormData({ ...formData, reviewText: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95
              ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'}`}
          >
            {isSubmitting ? "Posting..." : "Post Review"}
          </button>
        </div>
      </form>

      {/* --- REVIEWS LIST --- */}
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-10 flex flex-col items-center gap-2">
            <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="text-gray-400 text-sm font-medium">Fetching testimonials...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] py-16 text-center text-gray-400">
             No reviews yet. Be the first to leave one!
          </div>
        ) : (
          reviews.map((review) => {
            const name = review.name || review.attributes?.name;
            const rating = review.rating || review.attributes?.rating || 0;
            const text = review.reviewText || review.attributes?.reviewText;

            return (
              <div
                key={review._id || review.id}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{name}</p>
                    <div className="flex text-yellow-400 text-sm">
                      {"★".repeat(rating)}
                      <span className="text-gray-200">
                        {"★".repeat(5 - rating)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Verified</span>
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed text-sm italic">"{text}"</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}