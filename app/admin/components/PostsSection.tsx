"use client";
import React, { useState, useEffect } from "react";

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
    tags: "", // String input, submission par array banayenge
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()), // String to Array
    };

    try {
      const res = await fetch("https://vil-cms.vercel.app/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        alert("Post created!");
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
      }
    } catch (err) {
      alert("Error saving post");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* --- ADD POST FORM --- */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">Create New Post / News</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Post Title"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              name="author"
              placeholder="Author Name"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.author}
              onChange={handleChange}
            />
            <input
              name="slug"
              placeholder="URL-slug-format"
              className="p-3 border rounded-xl outline-none"
              value={formData.slug}
              onChange={handleChange}
            />
            <select
              name="type"
              className="p-3 border rounded-xl"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="News">News</option>
              <option value="Blog">Blog</option>
              <option value="Update">Update</option>
            </select>
          </div>

          <input
            name="coverImage"
            placeholder="Cover Image URL (https://...)"
            className="w-full p-3 border rounded-xl outline-none"
            value={formData.coverImage}
            onChange={handleChange}
          />

          <textarea
            name="excerpt"
            placeholder="Short Summary (Excerpt)"
            className="w-full p-3 border rounded-xl h-20 outline-none"
            value={formData.excerpt}
            onChange={handleChange}
          />

          <textarea
            name="content"
            placeholder="Main Content (HTML supported)"
            className="w-full p-3 border rounded-xl h-40 font-mono text-sm outline-none"
            value={formData.content}
            onChange={handleChange}
          />

          <input
            name="tags"
            placeholder="Tags (comma separated: news, update, 2026)"
            className="w-full p-3 border rounded-xl outline-none"
            value={formData.tags}
            onChange={handleChange}
          />

          <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition">
            Publish Post
          </button>
        </form>
      </section>

      {/* --- POSTS DISPLAY --- */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Latest Updates</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase">
                      {post.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                    <span className="text-gray-500 italic">
                      By {post.author || "Admin"}
                    </span>
                    <button className="text-orange-600 font-semibold hover:underline">
                      Read More →
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
