import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const MainContent = ({ toggleSidebar }) => {
  return (
    <div className='flex-1 flex flex-col min-h-screen overflow-hidden'>
      <Navbar onMenuClick={toggleSidebar} />
      <div className='flex-1 overflow-auto bg-gray-50'>
        <Outlet />
      </div>
    </div>
  );
};

export default MainContent;
