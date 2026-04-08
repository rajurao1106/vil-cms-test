"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`https://vil-cms-dhct.vercel.app${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (type === "login") {
        localStorage.setItem("token", data.token);
        router.push("/admin"); 
      } else {
        alert("Registration successful! Now login.");
        router.push("/login");
      }
    } catch (err: unknown) {
      // --- FIX: Type guard for native Error object ---
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        {type === "login" ? "Welcome Back" : "Create Account"}
      </h2>
      
      {error && <p className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}