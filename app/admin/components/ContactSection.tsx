"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api"; // Aapka Axios instance
import { toast } from "react-toastify";

interface FAQ {
  question: string;
  answer: string;
}

export default function ContactSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [mapSettings, setMapSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setIsLoading(true);
      
      // Parallel API calls using Promise.all for better performance
      const [faqRes, mapRes] = await Promise.all([
        api.get("/contact/faqs"),
        api.get("/contact/map-settings")
      ]);

      setFaqs(Array.isArray(faqRes.data) ? faqRes.data : faqRes.data?.data || []);
      setMapSettings(mapRes.data || {});
      
    } catch (error) {
      console.error("Error fetching contact data:", error);
      // Global interceptor handle kar lega, par local fallback:
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex items-center gap-3">
        <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full"></div>
        <p className="text-gray-500 font-medium">Loading Contact Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Contact Page & FAQs</h2>
      
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-teal-700">Frequently Asked Questions</h3>
          <span className="text-xs bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-bold">
            {faqs.length} Items
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {faqs.length === 0 ? (
            <p className="py-6 text-gray-400 text-center">No FAQs found.</p>
          ) : (
            faqs.map((faq, i) => (
              <div key={i} className="py-5 hover:bg-gray-50/30 transition-colors px-2 rounded-xl">
                <p className="font-bold text-gray-800 flex gap-3">
                  <span className="text-teal-500">Q.</span>
                  {faq.question}
                </p>
                <div className="text-gray-600 text-sm mt-2 ml-7 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Settings Placeholder (Agar aap iska form bhi banana chahein) */}
      <div className="bg-gray-50 rounded-3xl p-6 border border-dashed border-gray-200">
         <p className="text-sm text-gray-500 italic">Map settings are loaded. You can add form fields here to update them.</p>
      </div>
    </div>
  );
}