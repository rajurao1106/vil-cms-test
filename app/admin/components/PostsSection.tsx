"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";
import axios from "axios";

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
    tags: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      const generatedSlug = value
        .toLowerCase()
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
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  // --- EDIT MODE ---
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

    const finalData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
    };

    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, finalData);
        toast.success("📰 Post Updated Successfully!");
      } else {
        await api.post("/posts", finalData);
        toast.success("📰 Post Published Successfully!");
      }
      resetForm();
      fetchPosts();
    } catch (err: unknown) {
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
    <div className="max-w-6xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
      
      {/* --- FORM SECTION --- */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Post Title</label>
              <input name="title" className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">Author Name</label>
              <input name="author" className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={formData.author} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">URL Slug</label>
              <input name="slug" className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 text-gray-500" value={formData.slug} readOnly />
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
            <input name="coverImage" className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" value={formData.coverImage} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Excerpt</label>
            <textarea name="excerpt" className="w-full p-4 border border-gray-200 rounded-2xl h-20 outline-none focus:ring-2 focus:ring-orange-500" value={formData.excerpt} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Content</label>
            <textarea name="content" className="w-full p-4 border border-gray-200 rounded-2xl h-40 outline-none focus:ring-2 focus:ring-orange-500" value={formData.content} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">Tags (Comma separated)</label>
            <input name="tags" className="w-full p-4 border border-gray-200 rounded-2xl outline-none" value={formData.tags} onChange={handleChange} />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 font-bold py-4 rounded-[2rem] transition-all shadow-lg active:scale-95 ${isSubmitting ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
            >
              {isSubmitting ? "Processing..." : editingId ? "Update Post" : "Publish Post"}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={resetForm}
                className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-[2rem] hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* --- DISPLAY SECTION --- */}
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
              <div key={post._id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all">
                {post.coverImage && (
                  <div className="h-48 w-full overflow-hidden">
                    <img src={post.coverImage || "/placeholder.jpg"} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-all" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">{post.type}</span>
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(post)} className="text-blue-500 text-xs font-bold hover:underline">Edit</button>
                        <button onClick={() => handleDelete(post._id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{post.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">{post.excerpt}</p>
                  
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold">By {post.author || "Admin"}</span>
                    <span className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
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