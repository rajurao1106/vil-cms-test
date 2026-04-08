"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Router import kiya
import { 
  FaHome, FaChevronDown, FaInfoCircle, FaBox, 
  FaBriefcase, FaPhotoVideo, FaMapMarkedAlt,
  FaFileAlt, FaNewspaper, FaChartBar, FaSignOutAlt,
  FaSlidersH, FaStar, FaBars, FaTimes
} from 'react-icons/fa';

// Sections Imports
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
import ContactSection from './components/ContactSection';

const sidebarSections = [
  { id: 'dashboard', label: 'Dashboard', icon: FaHome, type: 'link' },
  { 
    id: 'about-dropdown', 
    label: 'About Section', 
    icon: FaInfoCircle, 
    type: 'dropdown',
    subItems: [
      { id: 'company', label: 'The Company' },
      { id: 'vision', label: 'Vision & Mission' },
      { id: 'chairman', label: "Chairman's Message" },
      { id: 'board', label: 'Board of Directors' },
      { id: 'committee', label: 'Committees' },
      { id: 'about-snippet', label: 'About Snippet' },
    ]
  },
  { 
    id: 'products-dropdown', 
    label: 'Our Products', 
    icon: FaBox, 
    type: 'dropdown',
    subItems: [
      { id: 'products', label: 'Manage Products' },
    ]
  },
  { 
    id: 'investors-dropdown', 
    label: 'Investors', 
    icon: FaChartBar, 
    type: 'dropdown',
    subItems: [
      { id: 'documents', label: 'Documents' },
      { id: 'stats', label: 'Statistics' },
    ]
  },
  { id: 'hero', label: 'Hero Slider', icon: FaSlidersH, type: 'link' },
  { id: 'posts', label: 'News & Posts', icon: FaNewspaper, type: 'link' },
  { id: 'programmes', label: 'Programmes', icon: FaNewspaper, type: 'link' }, 
  { id: 'jobs', label: 'Careers/Jobs', icon: FaBriefcase, type: 'link' },
  { id: 'media', label: 'Media Gallery', icon: FaPhotoVideo, type: 'link' },
  { id: 'reviews', label: 'Reviews', icon: FaStar, type: 'link' },
  { id: 'contact', label: 'Contact & Address', icon: FaMapMarkedAlt, type: 'link' },
];

export default function AdminPanel() {
  const router = useRouter(); // Router initialize
  const [loading, setLoading] = useState(true); // Check loading state
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Auth Check Logic ---
  useEffect(() => {
    const token = localStorage.getItem('token'); // localStorage se token check
    if (!token) {
      router.push('/'); // Token nahi hai to redirect
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false); // Token hai to page dikhao
    }
  }, [router]);

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Logout par token hatao
    router.push('/');
  };

  // Prevent UI flashing before redirect
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#43bfb1]"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview />;
      case 'hero': return <HeroSection />;
      case 'about-snippet': return <AboutSection />;
      case 'vision': return <VisionSection />;
      case 'chairman': return <ChairmanSection />;
      case 'company': return <CompanySection />;
      case 'board': return <BoardSection />;
      case 'committee': return <CommitteeSection />;
      case 'stats': return <StatsSection />;
      case 'products': return <ProductsSection />;
      case 'posts': return <PostsSection />;
      case 'programmes': return <ProgrammesSection />;
      case 'jobs': return <JobsSection />;
      case 'media': return <MediaSection />;
      case 'documents': return <DocumentsSection />;
      case 'reviews': return <ReviewsSection />;
      case 'contact': return <ContactSection />;
      default: return <div className="p-10 md:p-20 text-center text-gray-400">Section {activeSection} not found.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden font-sans">
      
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300 transform
        lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="min-w-[40px] h-10 bg-[#43bfb1] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">V</div>
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-gray-800">VIL Admin</h1>
              <p className="text-[10px] text-[#43bfb1] font-bold uppercase tracking-wider">Corporate CMS</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-400">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {sidebarSections.map((section) => (
            <div key={section.id}>
              {section.type === 'dropdown' ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === section.id ? null : section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                      openDropdown === section.id ? 'bg-[#43bfb1]/10 text-[#43bfb1]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className={`text-lg ${openDropdown === section.id ? 'text-[#43bfb1]' : 'text-gray-400'}`} />
                      <span className="font-semibold text-sm">{section.label}</span>
                    </div>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${openDropdown === section.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === section.id && (
                    <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-1">
                      {section.subItems?.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSectionChange(sub.id)}
                          className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeSection === sub.id ? 'text-[#43bfb1] bg-[#43bfb1]/5' : 'text-gray-500 hover:text-[#43bfb1]'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                    activeSection === section.id ? 'bg-[#43bfb1] text-white shadow-lg' : 'hover:bg-gray-50'
                  }`}
                >
                  <section.icon className={`text-lg ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-semibold text-sm">{section.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#43bfb1] rounded-xl flex items-center justify-center text-white font-bold">R</div>
              <div>
                <p className="text-sm font-bold">Raju</p>
                <p className="text-[10px] text-gray-400 uppercase">Raipur, CG</p>
              </div>
            </div>
            <FaSignOutAlt 
              onClick={handleLogout} 
              className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" 
            />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden text-[#43bfb1]"
            >
                <FaBars size={22} />
            </button>
            <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate uppercase tracking-tight">
                  {activeSection.replace('-', ' ')}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">VIL Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="hidden xs:inline">Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar bg-gray-50">
          <div className="max-w-6xl mx-auto pb-10">
            {renderContent()}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, <span className="text-[#43bfb1]">Admin</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Everything is looking good. Here is whats happening with your content today.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: '14', color: 'bg-blue-500' },
          { label: 'Active Careers', value: '07', color: 'bg-emerald-500' },
          { label: 'Gallery Files', value: '53', color: 'bg-amber-500' },
          { label: 'Reviews', value: '28', color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </h3>
              {/* Decorative Dot */}
              <span className={`w-2 h-2 rounded-full ${stat.color}`}></span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-gray-800 group-hover:text-[#43bfb1] transition-colors">
                {stat.value}
              </p>
              {/* <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
                +12%
              </span> */}
            </div>

            {/* <div className="mt-6 flex items-center gap-2 text-[11px] font-medium text-gray-400">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color} opacity-70 w-2/3`}></div>
              </div>
              <span>Updated just now</span>
            </div> */}
          </div>
        ))}
      </div>

      {/* Optional: Placeholder for Recent Activity or Quick Actions */}
      {/* <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 min-h-[200px] flex items-center justify-center border-dashed">
              <p className="text-gray-400 text-sm italic font-medium">Recent Activity Logs will appear here...</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 min-h-[200px] flex items-center justify-center border-dashed">
              <p className="text-gray-400 text-sm italic font-medium">Quick Analytics Chart placeholder</p>
          </div>
      </div> */}
    </div>
  );
}