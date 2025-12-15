import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='bg-white shadow-md border-b border-gray-200'>
      <div className='flex items-center justify-between px-4 sm:px-6 py-4'>
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={onMenuClick}
          className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
          aria-label='Toggle sidebar'
        >
          <Menu className='w-6 h-6 text-gray-700' />
        </button>

        {/* Left side - Title */}
        <div className='flex-1 lg:flex-none'>
          <h1 className='text-2xl font-bold text-gray-800'>
            E-Commerce {isAdmin() ? 'Admin' : 'Store'}
          </h1>
        </div>

        {/* Right side - User info and logout */}
        {user && (
          <div className='flex items-center gap-4'>
            <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg'>
              <User className='w-5 h-5 text-gray-600' />
              <div className='text-sm'>
                <p className='font-semibold text-gray-800'>{user.username}</p>
                <p className='text-xs text-gray-500 capitalize'>{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200'
            >
              <LogOut className='w-4 h-4' />
              <span className='hidden sm:inline text-sm font-medium'>
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
