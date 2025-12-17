import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { User, LogOut, Menu, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAdmin, isUser } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const cartItemCount = getCartItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='bg-white shadow-md border-b border-gray-200'>
      <div className='flex items-center justify-between px-4 sm:px-6 py-10'>
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={onMenuClick}
          className='lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors duration-200'
          aria-label='Toggle sidebar'
        >
          <Menu className='w-6 h-6 text-primary-600' />
        </button>

        {/* Left side - Title */}
        <div className='flex-1 lg:flex-none'>
          <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
            E-Commerce {isAdmin() ? 'Admin' : 'Store'}
          </h1>
        </div>

        {/* Right side - User info and logout */}
        {user && (
          <div className='flex items-center gap-2 sm:gap-4'>
            <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg border border-primary-100'>
              <User className='w-5 h-5 text-primary-600' />
              <div className='text-sm'>
                <p className='font-semibold text-gray-900'>{user.username}</p>
                <p className='text-xs text-primary-600 capitalize font-medium'>
                  {user.role}
                </p>
              </div>
            </div>

            {/* Cart Badge - Only for Users */}
            {isUser() && (
              <button
                onClick={() => navigate('/Dashboard/AddToCart')}
                className='relative p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md'
                aria-label='Shopping cart'
              >
                <ShoppingCart className='w-5 h-5 sm:w-6 sm:h-6' />
                {cartItemCount > 0 && (
                  <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse'>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md'
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
