"use client";

import React, { useState, useEffect } from "react";

// --- Types ---
interface Review {
  id?: string | number;
  _id?: string;
  name: string;
  rating: number;
  reviewText: string;
  // Support for Strapi v4/v5 nested attributes
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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/reviews");
      const data = await res.json();

      // Normalize data based on API response structure
      const reviewsArray = Array.isArray(data) ? data : data.data || [];
      setReviews(reviewsArray);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://vil-cms.vercel.app/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Tip: If using Strapi, you may need: body: JSON.stringify({ data: formData })
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", rating: 5, reviewText: "" }); // Reset form
        fetchReviews(); // Refresh list
      }
    } catch (error) {
      console.error("Error posting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">
        Reviews / Testimonials
      </h2>

      {/* --- POST REVIEW FORM --- */}
      <form
        onSubmit={handleSubmit}
        className="mb-12 bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Leave a Review
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="relative">
            <select
              className="w-full p-3 rounded-xl border border-gray-300 outline-none bg-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              ▼
            </div>
          </div>

          <textarea
            placeholder="Write your thoughts..."
            className="w-full p-3 rounded-xl border border-gray-300 outline-none h-32 focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.reviewText}
            onChange={(e) =>
              setFormData({ ...formData, reviewText: e.target.value })
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-lg shadow-blue-100"
          >
            {loading ? "Posting..." : "Post Review"}
          </button>
        </div>
      </form>

      {/* --- REVIEWS LIST --- */}
      <div className="space-y-6">
        {reviews.length === 0 && !loading && (
          <p className="text-center text-gray-500 italic">
            No reviews yet. Be the first to leave one!
          </p>
        )}

        {reviews.map((review) => {
          // Destructure for readability, handling both standard and Strapi formats
          const name = review.name || review.attributes?.name;
          const rating = review.rating || review.attributes?.rating || 0;
          const text = review.reviewText || review.attributes?.reviewText;

          return (
            <div
              key={review._id || review.id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-900">{name}</p>
                <div className="flex text-yellow-400 text-lg">
                  {"★".repeat(rating)}
                  <span className="text-gray-200">
                    {"★".repeat(5 - rating)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-gray-600 leading-relaxed">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
