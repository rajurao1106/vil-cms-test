"use client";

import React, { useState, useEffect } from "react";

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

  // Form State
  const [formData, setFormData] = useState<Product>({
    productName: "",
    urlSlug: "",
    category: "",
    status: "Published",
    shortDescription: "",
    specifications: [{ label: "", value: "" }],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/products");
      const data = await res.json();
      // Handle different API response structures
      const productsArray = Array.isArray(data) ? data : data.data || [];
      setProducts(productsArray);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamic Specs Logic
  const handleSpecChange = (
    index: number,
    field: keyof Specification,
    value: string,
  ) => {
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

  // Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("https://vil-cms.vercel.app/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Product added successfully!");
        setFormData({
          productName: "",
          urlSlug: "",
          category: "",
          status: "Published",
          shortDescription: "",
          specifications: [{ label: "", value: "" }],
        });
        fetchProducts(); // Refresh list
      }
    } catch (err) {
      alert("Error adding product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* --- ADD PRODUCT FORM --- */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.productName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="urlSlug"
              placeholder="URL Slug (e.g. premium-iron)"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.urlSlug}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={handleChange}
            />
            <select
              name="status"
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <textarea
            name="shortDescription"
            placeholder="Short Description"
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.shortDescription}
            onChange={handleChange}
          />

          {/* Dynamic Specifications */}
          <div className="space-y-2">
            <label className="font-semibold block text-gray-700">
              Specifications:
            </label>
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  placeholder="Label (e.g. Size)"
                  className="flex-1 p-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                  value={spec.label}
                  onChange={(e) =>
                    handleSpecChange(index, "label", e.target.value)
                  }
                />
                <input
                  placeholder="Value (e.g. 10x12)"
                  className="flex-1 p-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(index, "value", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecField}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              + Add another specification
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            Save Product
          </button>
        </form>
      </section>

      <hr className="border-gray-100" />

      {/* --- PRODUCTS TABLE --- */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Product Inventory</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Category</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-10 text-center text-gray-400 italic"
                  >
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p, idx) => (
                  <tr
                    key={p._id || idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {p.productName}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {p.urlSlug}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{p.category || "N/A"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
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
