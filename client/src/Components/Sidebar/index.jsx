import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  X,
  LayoutDashboard,
  PackagePlus,
  Package,
  Settings,
  Eye,
  ShoppingBag,
  FileText,
  ShoppingCart,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isUser, logout } = useAuth();
  const navigate = useNavigate();

  // Admin navigation items
  const adminLinks = [
    { path: '/Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/Dashboard/AddProducts', label: 'Add Product', icon: PackagePlus },
    {
      path: '/Dashboard/StockManagement',
      label: 'Stock Management',
      icon: Package,
    },
    { path: '/Dashboard/ManageOrder', label: 'Manage Orders', icon: Settings },
    { path: '/Dashboard/ViewOrder', label: 'View Orders', icon: Eye },
  ];

  // User navigation items
  const userLinks = [
    { path: '/Dashboard/products', label: 'Products', icon: ShoppingBag },
    { path: '/Dashboard/MyOrder', label: 'My Orders', icon: FileText },
    { path: '/Dashboard/AddToCart', label: 'Cart', icon: ShoppingCart },
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
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className='lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 z-10'
          aria-label='Close sidebar'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Header */}
        <div className='border-b border-gray-700 pt-4 pb-2'>
          <h1 className='text-2xl text-center text-white font-bold py-6 px-4'>
            {isAdmin() ? 'Admin Panel' : 'User Dashboard'}
          </h1>
          {user && (
            <div className='px-4 pb-5 text-center'>
              <p className='text-gray-400 text-sm mb-1'>Welcome back,</p>
              <p className='text-white font-semibold text-lg'>
                {user.username}
              </p>
              <p className='text-gray-500 text-xs mt-1.5 capitalize bg-gray-800 inline-block px-3 py-1 rounded-full'>
                {user.role}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav
          className='flex-1 overflow-y-auto pl-4 pr-2 mt-8 mb-4'
          style={{ marginLeft: '1rem', marginTop: '2rem' }}
        >
          <ul className='flex flex-col gap-4 items-start'>
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => onClose()}
                    className='flex items-center px-4 py-3.5 mr-2 text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-lg hover:scale-105 rounded-lg transition-all duration-200 ease-in-out group gap-3'
                  >
                    <IconComponent className='w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200' />
                    <span className='font-medium'>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className='pl-4 pr-2 py-6 border-t border-gray-700'>
          <button
            onClick={handleLogout}
            className='flex items-center justify-center w-full px-4 py-3.5 mr-2 text-gray-300 hover:bg-error-600 hover:text-white hover:shadow-lg hover:scale-105 rounded-lg transition-all duration-200 ease-in-out font-medium group'
          >
            <LogOut className='w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-200' />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
