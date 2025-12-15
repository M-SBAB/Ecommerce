import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isUser, logout } = useAuth();
  const navigate = useNavigate();

  // Admin navigation items
  const adminLinks = [
    { path: '/Dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/Dashboard/AddProducts', label: 'Add Product', icon: '➕' },
    {
      path: '/Dashboard/StockManagement',
      label: 'Stock Management',
      icon: '📦',
    },
    { path: '/Dashboard/ManageOrder', label: 'Manage Orders', icon: '⚙️' },
    { path: '/Dashboard/ViewOrder', label: 'View Orders', icon: '👁️' },
  ];

  // User navigation items
  const userLinks = [
    { path: '/Dashboard/products', label: 'Products', icon: '🛍️' },
    { path: '/Dashboard/MyOrder', label: 'My Orders', icon: '📝' },
    { path: '/Dashboard/AddToCart', label: 'Cart', icon: '🛒' },
  ];

  // Get navigation links based on role
  const navigationLinks = isAdmin() ? adminLinks : isUser() ? userLinks : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        h-screen w-[280px] lg:w-[300px]
        bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className='lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10'
          aria-label='Close sidebar'
        >
          <X className='w-6 h-6' />
        </button>

        {/* Header */}
        <div className='border-b border-gray-700 pt-2'>
          <h1 className='text-2xl text-center text-white font-bold py-8 px-4'>
            {isAdmin() ? 'Admin Panel' : 'User Dashboard'}
          </h1>
          {user && (
            <div className='px-4 pb-4 text-center'>
              <p className='text-gray-400 text-sm'>Welcome back,</p>
              <p className='text-white font-semibold'>{user.username}</p>
              <p className='text-gray-500 text-xs mt-1 capitalize'>
                {user.role}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className='flex-1 overflow-y-auto px-3 lg:px-4 mt-6'>
          <ul className='space-y-2'>
            {navigationLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => onClose()}
                  className='flex items-center px-4 py-3 mx-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'
                >
                  <span className='mr-3 text-lg'>{link.icon}</span>
                  <span className='font-medium'>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className='px-3 lg:px-4 py-4 border-t border-gray-700'>
          <button
            onClick={handleLogout}
            className='flex items-center justify-center w-full px-4 py-3 mx-2 text-gray-300 hover:bg-error-600 hover:text-white rounded-lg transition-all duration-200 ease-in-out font-medium'
          >
            <LogOut className='w-4 h-4 mr-3' />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
