import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar';
import MainContent from '../../Components/MainContent';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex min-h-screen'>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <MainContent toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Dashboard;
