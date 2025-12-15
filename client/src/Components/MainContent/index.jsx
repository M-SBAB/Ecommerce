import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const MainContent = ({ toggleSidebar }) => {
  return (
    <div className='flex-1 flex flex-col min-h-screen overflow-hidden'>
      <Navbar onMenuClick={toggleSidebar} />
      <div className='flex-1 overflow-auto bg-gray-50'>
        <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
