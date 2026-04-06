"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

// --- Types ---
interface Specification {
  label: string;
  value: string;
}

interface Product {
  _id?: string;
  productName: string;
  urlSlug: string;
  category: string;
  status: "Published" | "Draft";
  shortDescription: string;
  specifications: Specification[];
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Product>({
    productName: "",
    urlSlug: "",
    category: "",
    status: "Published",
    shortDescription: "",
    specifications: [{ label: "", value: "" }],
  });

  // --- GET PRODUCTS ---
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const data = res.data;
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Input Changes & Auto-Slug
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "productName") {
      // Auto-generate slug from product name
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      
      setFormData((prev) => ({ ...prev, productName: value, urlSlug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Dynamic Specs Logic
  const handleSpecChange = (index: number, field: keyof Specification, value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecField = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpecField = (index: number) => {
    if (formData.specifications.length <= 1) return;
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  // Submit Form (Axios)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post("/products/add", formData);
      toast.success("📦 Product added successfully!");
      
      // Reset Form
      setFormData({
        productName: "",
        urlSlug: "",
        category: "",
        status: "Published",
        shortDescription: "",
        specifications: [{ label: "", value: "" }],
      });
      fetchProducts();
    } catch (err: any) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.message || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
      {/* --- ADD PRODUCT FORM --- */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
          Add New Product
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Product Name</label>
              <input
                type="text"
                name="productName"
                placeholder="e.g. Premium TMT Bar"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">URL Slug</label>
              <input
                type="text"
                name="urlSlug"
                placeholder="auto-generated-slug"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none bg-gray-50 text-gray-500"
                value={formData.urlSlug}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Construction Steel"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Status</label>
              <select
                name="status"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none bg-white focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Short Description</label>
            <textarea
              name="shortDescription"
              placeholder="Provide a brief overview of the product..."
              className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              rows={3}
              value={formData.shortDescription}
              onChange={handleChange}
            />
          </div>

          {/* Dynamic Specifications */}
          <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
            <label className="font-bold text-gray-700 flex items-center gap-2">
              Technical Specifications
            </label>
            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 items-center animate-in slide-in-from-left-2 duration-200">
                  <input
                    placeholder="Label (e.g. Grade)"
                    className="flex-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                  />
                  <input
                    placeholder="Value (e.g. Fe 550D)"
                    className="flex-1 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeSpecField(index)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSpecField}
              className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
            >
              + Add Specification Field
            </button>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full font-bold py-4 rounded-[2rem] transition-all shadow-lg active:scale-95
              ${isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"}`}
          >
            {isSaving ? "Saving Product..." : "Save Product to Inventory"}
          </button>
        </form>
      </section>

      {/* --- PRODUCTS TABLE --- */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Product Inventory</h2>
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-5 font-bold text-gray-600 text-sm">Product Details</th>
                <th className="p-5 font-bold text-gray-600 text-sm">Category</th>
                <th className="p-5 font-bold text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                       <p className="text-gray-400 text-sm">Loading inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-16 text-center text-gray-400 font-medium">
                    No products found in database.
                  </td>
                </tr>
              ) : (
                products.map((p, idx) => (
                  <tr key={p._id || idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.productName}</div>
                      <div className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{p.urlSlug}</div>
                    </td>
                    <td className="p-5 text-gray-600 font-medium text-sm">{p.category || "General"}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        p.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}