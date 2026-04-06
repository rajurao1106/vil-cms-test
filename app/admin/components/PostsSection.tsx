"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

interface Post {
  _id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  author: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
}

export default function PostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "News",
    status: "Published",
    author: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "", 
  });

  // --- GET POSTS ---
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      const data = res.data;
      setPosts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // --- AUTO SLUG GENERATOR & CHANGE HANDLER ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "title") {
      // Title likhte hi slug auto-generate hoga
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      setFormData(prev => ({ ...prev, title: value, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- SUBMIT POST ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
    };

    try {
      await api.post("/posts", finalData);
      toast.success("📰 Post Published Successfully!");
      
      // Reset Form
      setFormData({
        title: "",
        slug: "",
        type: "News",
        status: "Published",
        author: "",
        excerpt: "",
        content: "",
        coverImage: "",
        tags: "",
      });
      fetchPosts();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Error saving post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
      
      {/* --- ADD POST FORM --- */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
          Create New Post / News
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Post Title</label>
              <input
                name="title"
                placeholder="e.g. Annual Result 2026"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Author Name</label>
              <input
                name="author"
                placeholder="Admin"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.author}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">URL Slug (Auto-generated)</label>
              <input
                name="slug"
                placeholder="auto-generated-url"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none bg-gray-50 text-gray-500"
                value={formData.slug}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Category Type</label>
              <select
                name="type"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none bg-white focus:ring-2 focus:ring-orange-500"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="News">News</option>
                <option value="Blog">Blog</option>
                <option value="Update">Update</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Cover Image URL</label>
            <input
              name="coverImage"
              placeholder="https://images.unsplash.com/photo..."
              className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.coverImage}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Excerpt (Short Summary)</label>
            <textarea
              name="excerpt"
              placeholder="Briefly describe what this post is about..."
              className="w-full p-4 border border-gray-200 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              value={formData.excerpt}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Content (HTML/Text)</label>
            <textarea
              name="content"
              placeholder="Paste your main content here..."
              className="w-full p-4 border border-gray-200 rounded-2xl h-48 font-mono text-sm outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.content}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Tags (Comma separated)</label>
            <input
              name="tags"
              placeholder="e.g. business, steel, update"
              className="w-full p-4 border border-gray-200 rounded-2xl outline-none"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <button 
            disabled={isSubmitting}
            className={`w-full font-bold py-4 rounded-[2rem] transition-all shadow-lg active:scale-95
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-100'}`}
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </section>

      {/* --- POSTS DISPLAY --- */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Latest Updates</h2>
          <p className="text-gray-400 font-medium">{posts.length} entries found</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(n => <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300"
              >
                {post.coverImage && (
                  <div className="h-52 w-full overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {post.type}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-gray-50 border border-gray-100 px-3 py-1 rounded-full text-gray-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold italic">
                      By {post.author || "Admin"}
                    </span>
                    <button className="text-orange-600 text-sm font-bold hover:translate-x-1 transition-transform">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}