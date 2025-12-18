import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar - Fixed on left, highest z-index */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Navbar - Fixed at top, starts after sidebar on large screens */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area - Scrollable, positioned after sidebar and navbar */}
      <main className='pt-[80px] lg:pl-[300px] min-h-screen'>
        <div className='p-4 sm:p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
