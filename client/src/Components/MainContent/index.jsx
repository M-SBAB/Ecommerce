import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const MainContent = ({ toggleSidebar }) => {
  return (
    <div className='flex-1 flex flex-col min-h-screen overflow-hidden'>
      <Navbar onMenuClick={toggleSidebar} />
      <div className='flex-1 overflow-auto bg-gray-50'>
        <div className='px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
