"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";
import axios from "axios";

// --- Types ---
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    title: "",
    slug: "",
    type: "News",
    status: "Published",
    author: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "", // Form par comma-separated string ki tarah handle karenge
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- GET ALL POSTS ---
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      // Backend direct array bhej raha hai ya { data: [] } check karein
      const data = res.data;
      setPosts(Array.isArray(data) ? data : data.data || []);
    } catch (err: unknown) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // --- HANDLE INPUT CHANGES & AUTO-SLUG ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData(prev => ({ ...prev, title: value, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- DELETE POST ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      // Backend Route: DELETE /api/posts/:id
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted successfully");
      fetchPosts(); // Refresh List
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete post");
    }
  };

  // --- SET EDIT MODE ---
  const handleEdit = (post: Post) => {
    setEditingId(post._id);
    setFormData({
      title: post.title,
      slug: post.slug,
      type: post.type,
      status: post.status,
      author: post.author || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImage: post.coverImage || "",
      tags: post.tags ? post.tags.join(", ") : "",
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  // --- SUBMIT (CREATE OR UPDATE) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Tags string ko array mein convert karein backend ke liye
    const finalData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()).filter(t => t !== "") : [],
    };

    try {
      if (editingId) {
        // Backend Route: PUT /api/posts/:id
        await api.put(`/posts/${editingId}`, finalData);
        toast.success("📰 Post Updated Successfully!");
      } else {
        // Backend Route: POST /api/posts
        await api.post("/posts", finalData);
        toast.success("📰 Post Published Successfully!");
      }
      resetForm();
      fetchPosts();
    } catch (err: unknown) {
      console.error("Submit error:", err);
      let errorMessage = "Error saving post";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      
      {/* --- FORM SECTION --- */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className={`w-2 h-8 rounded-full inline-block ${editingId ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
            {editingId ? "Edit Post" : "Create New Post"}
            </h2>
            {editingId && (
                <button onClick={resetForm} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                    ✕ Cancel Edit
                </button>
            )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Post Title</label>
              <input name="title" className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Author Name</label>
              <input name="author" className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={formData.author} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">URL Slug</label>
              <input name="slug" className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-500 cursor-not-allowed" value={formData.slug} readOnly />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Category Type</label>
              <select name="type" className="w-full p-4 border border-gray-200 rounded-2xl outline-none bg-white focus:ring-2 focus:ring-orange-500" value={formData.type} onChange={handleChange}>
                <option value="News">News</option>
                <option value="Blog">Blog</option>
                <option value="Update">Update</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Cover Image URL</label>
            <input name="coverImage" className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Excerpt (Short Summary)</label>
            <textarea name="excerpt" className="w-full p-4 border border-gray-200 rounded-2xl h-20 outline-none focus:ring-2 focus:ring-orange-500 resize-none" value={formData.excerpt} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Full Content</label>
            <textarea name="content" className="w-full p-4 border border-gray-200 rounded-2xl h-40 outline-none focus:ring-2 focus:ring-orange-500 resize-none" value={formData.content} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Tags (Comma separated)</label>
            <input name="tags" placeholder="news, company, expansion" className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={formData.tags} onChange={handleChange} />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-4 rounded-[2rem] transition-all shadow-lg active:scale-95 ${isSubmitting ? 'bg-gray-400' : editingId ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
          >
            {isSubmitting ? "Processing..." : editingId ? "Update Existing Post" : "Publish New Post"}
          </button>
        </form>
      </section>

      {/* --- LIST SECTION --- */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Latest Updates</h2>
          <p className="text-gray-400 font-medium">{posts.length} entries found</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed text-gray-400">
            No posts found. Start by creating one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300">
                <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
                  <img 
                    src={post.coverImage || "https://via.placeholder.com/400x200?text=No+Image"} 
                    alt={post.title} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-orange-600 shadow-sm uppercase">
                    {post.type}
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">{post.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                  
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center mb-4 text-[10px] font-bold text-gray-400">
                    <span>By {post.author || "Admin"}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                        onClick={() => handleEdit(post)} 
                        className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleDelete(post._id)} 
                        className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                    >
                        Delete
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