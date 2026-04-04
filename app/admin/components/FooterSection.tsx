"use client";
import React, { useState, useEffect } from "react";

interface Link {
  _id: string;
  title: string;
  url: string;
  section: string;
}

export default function FooterSection() {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const res = await fetch("https://vil-cms.vercel.app/api/footer");
    const data = await res.json();
    setLinks(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Footer Links</h2>
      <div className="bg-white rounded-3xl p-6 shadow">
        {links.map((link) => (
          <div
            key={link._id}
            className="flex justify-between py-4 border-b last:border-none"
          >
            <div>
              <p className="font-medium">{link.title}</p>
              <p className="text-sm text-gray-500">{link.url}</p>
            </div>
            <p className="text-sm text-gray-500">{link.section}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
