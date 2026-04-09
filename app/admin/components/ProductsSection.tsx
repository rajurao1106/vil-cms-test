"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api"; 
import { toast } from "react-toastify";

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
  fullDescription: string; // Required in Backend
  specifications: Specification[];
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    productName: "",
    urlSlug: "",
    category: "",
    status: "Published" as const,
    shortDescription: "",
    fullDescription: "Default description", // Placeholder for required field
    specifications: [{ label: "", value: "" }],
  };

  const [formData, setFormData] = useState<Product>(initialForm);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "productName") {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData(prev => ({ ...prev, productName: value, urlSlug: slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        toast.success("Product Updated!");
      } else {
        // Backend expects POST on /api/products
        await api.post("/products", formData);
        toast.success("Product Added!");
      }
      setFormData(initialForm);
      setEditingId(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p._id!);
    setFormData(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <section className="bg-white p-8 rounded-[2rem] border shadow-sm">
        <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="productName" placeholder="Product Name" className="p-4 border rounded-xl" value={formData.productName} onChange={handleChange} required />
            <input name="urlSlug" placeholder="Slug" className="p-4 border rounded-xl bg-gray-50" value={formData.urlSlug} readOnly />
            <input name="category" placeholder="Category" className="p-4 border rounded-xl" value={formData.category} onChange={handleChange} required />
            <select name="status" className="p-4 border rounded-xl" value={formData.status} onChange={handleChange}>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <textarea name="shortDescription" placeholder="Description" className="w-full p-4 border rounded-xl" value={formData.shortDescription} onChange={handleChange} />
          
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="font-bold mb-2">Specs</p>
            {formData.specifications.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input placeholder="Label" className="flex-1 p-2 border rounded-lg" value={s.label} onChange={(e) => {
                  const ns = [...formData.specifications]; ns[i].label = e.target.value; setFormData({...formData, specifications: ns});
                }} />
                <input placeholder="Value" className="flex-1 p-2 border rounded-lg" value={s.value} onChange={(e) => {
                  const ns = [...formData.specifications]; ns[i].value = e.target.value; setFormData({...formData, specifications: ns});
                }} />
              </div>
            ))}
            <button type="button" onClick={() => setFormData({...formData, specifications: [...formData.specifications, {label: "", value: ""}]})} className="text-blue-600 text-sm">+ Add Spec</button>
          </div>

          <div className="flex gap-4">
            <button disabled={isSaving} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">
              {isSaving ? "Saving..." : editingId ? "Update Product" : "Save Product"}
            </button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData(initialForm);}} className="px-6 bg-gray-200 rounded-xl">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-[2rem] border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-4 font-bold">{p.productName}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(p._id!)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}