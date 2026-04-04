'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaSlidersH, FaInfoCircle, FaEye, FaUserTie, FaBuilding, 
  FaUsers, FaSitemap, FaBox, FaPhotoVideo, FaFilePdf, FaNewspaper, 
  FaCalendarAlt, FaBriefcase, FaChartBar, FaStar, FaLink, FaMapMarkerAlt, 
  FaMap, FaPhone 
} from 'react-icons/fa';

import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import VisionSection from './components/VisionSection';
import ChairmanSection from './components/ChairmanSection';
import CompanySection from './components/CompanySection';
import BoardSection from './components/BoardSection';
import CommitteeSection from './components/CommitteeSection';
import StatsSection from './components/StatsSection';
import ProductsSection from './components/ProductsSection';
import PostsSection from './components/PostsSection';
import ProgrammesSection from './components/ProgrammesSection';
import JobsSection from './components/JobsSection';
import MediaSection from './components/MediaSection';
import DocumentsSection from './components/DocumentsSection';
import ReviewsSection from './components/ReviewsSection';
import FooterSection from './components/FooterSection';
import AddressSection from './components/AddressSection';
import MapSection from './components/MapSection';
import ContactSection from './components/ContactSection';

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: FaHome },
  { id: 'hero', label: 'Hero Slider', icon: FaSlidersH },
  { id: 'about', label: 'About Snippet', icon: FaInfoCircle },
  { id: 'vision', label: 'Vision & Mission', icon: FaEye },
  { id: 'chairman', label: "Chairman's Message", icon: FaUserTie },
  { id: 'company', label: 'Company Sections', icon: FaBuilding },
  { id: 'board', label: 'Board of Directors', icon: FaUsers },
  { id: 'committee', label: 'Committees', icon: FaSitemap },
  { id: 'stats', label: 'Statistics', icon: FaChartBar },
  { id: 'products', label: 'Products', icon: FaBox },
  { id: 'posts', label: 'Posts & News', icon: FaNewspaper },
  { id: 'programmes', label: 'Programmes', icon: FaCalendarAlt },
  { id: 'jobs', label: 'Jobs / Careers', icon: FaBriefcase },
  { id: 'media', label: 'Media Gallery', icon: FaPhotoVideo },
  { id: 'documents', label: 'Documents', icon: FaFilePdf },
  { id: 'reviews', label: 'Reviews', icon: FaStar },
  { id: 'footer', label: 'Footer Links', icon: FaLink },
  { id: 'address', label: 'Addresses', icon: FaMapMarkerAlt },
  { id: 'map', label: 'Map Settings', icon: FaMap },
  { id: 'contact', label: 'Contact & FAQs', icon: FaPhone },
];

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'hero':
        return <HeroSection />;
      case 'about':
        return <AboutSection />;
      case 'vision':
        return <VisionSection />;
      case 'chairman':
        return <ChairmanSection />;
      case 'company':
        return <CompanySection />;
      case 'board':
        return <BoardSection />;
      case 'committee':
        return <CommitteeSection />;
      case 'stats':
        return <StatsSection />;
      case 'products':
        return <ProductsSection />;
      case 'posts':
        return <PostsSection />;
      case 'programmes':
        return <ProgrammesSection />;
      case 'jobs':
        return <JobsSection />;
      case 'media':
        return <MediaSection />;
      case 'documents':
        return <DocumentsSection />;
      case 'reviews':
        return <ReviewsSection />;
      case 'footer':
        return <FooterSection />;
      case 'address':
        return <AddressSection />;
      case 'map':
        return <MapSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <div className="text-center py-20 text-gray-500">Section under development</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-teal-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-teal-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-teal-900 rounded-2xl flex items-center justify-center font-bold text-2xl">VI</div>
          {sidebarOpen && (
            <div>
              <h1 className="text-2xl font-semibold">Vaswani Admin</h1>
              <p className="text-teal-300 text-sm">Corporate CMS</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-all hover:bg-teal-800 ${
                  activeSection === section.id ? 'bg-teal-700 shadow-inner' : ''
                }`}
              >
                <Icon className="text-xl" />
                {sidebarOpen && <span className="font-medium">{section.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-teal-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-700 rounded-2xl flex items-center justify-center">R</div>
            {sidebarOpen && (
              <div>
                <p className="font-medium">Raju</p>
                <p className="text-xs text-teal-300">Raipur, CG</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-teal-700"
            >
              <FaHome size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              {sections.find(s => s.id === activeSection)?.label || 'Admin Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Backend Connected
            </div>
            <button 
              onClick={() => alert('Logged out')}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Simple Dashboard
function DashboardOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome to Vaswani Industries Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-lg text-gray-600">Total Products</h3>
          <p className="text-5xl font-bold mt-2 text-teal-700">14</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-lg text-gray-600">Active Jobs</h3>
          <p className="text-5xl font-bold mt-2 text-teal-700">7</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-lg text-gray-600">Media Files</h3>
          <p className="text-5xl font-bold mt-2 text-teal-700">53</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-lg text-gray-600">Reviews</h3>
          <p className="text-5xl font-bold mt-2 text-teal-700">28</p>
        </div>
      </div>
    </div>
  );
}