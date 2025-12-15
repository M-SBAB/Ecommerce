import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
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
    <div className='h-screen w-[300px] bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl flex flex-col'>
      {/* Header */}
      <div className='border-b border-slate-700'>
        <h1 className='text-2xl text-center text-white font-bold py-8 px-4'>
          {isAdmin() ? 'Admin Panel' : 'User Dashboard'}
        </h1>
        {user && (
          <div className='px-4 pb-4 text-center'>
            <p className='text-slate-400 text-sm'>Welcome back,</p>
            <p className='text-white font-semibold'>{user.username}</p>
            <p className='text-slate-500 text-xs mt-1 capitalize'>
              {user.role}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 overflow-y-auto px-4 mt-6'>
        <ul className='space-y-2'>
          {navigationLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'
              >
                <span className='mr-3'>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className='px-4 py-4 border-t border-slate-700'>
        <button
          onClick={handleLogout}
          className='flex items-center justify-center w-full px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 ease-in-out'
        >
          <LogOut className='w-4 h-4 mr-3' />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
