import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Protects routes based on user authentication and role
 *
 * @param {Object} props
 * @param {JSX.Element} props.children - The component to render if authorized
 * @param {string} props.requiredRole - The role required to access the route ('admin' or 'user')
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading, isAdmin, isUser } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
        <div className='text-center'>
          <Loader2 className='w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin' />
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            Loading...
          </h3>
          <p className='text-gray-600'>
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const hasRequiredRole =
      (requiredRole === 'admin' && isAdmin()) ||
      (requiredRole === 'user' && isUser());

    if (!hasRequiredRole) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
          <div className='max-w-md w-full bg-white rounded shadow-xl p-8 text-center'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <ShieldAlert className='w-8 h-8 text-red-600' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Access Denied
            </h2>
            <p className='text-gray-600 mb-6'>
              You don't have permission to access this page.
            </p>
            <div className='space-y-2 text-sm text-gray-500 bg-gray-50 rounded p-4'>
              <p>
                <span className='font-semibold'>Current Role:</span>{' '}
                <span className='capitalize'>{user?.role || 'Unknown'}</span>
              </p>
              <p>
                <span className='font-semibold'>Required Role:</span>{' '}
                <span className='capitalize'>{requiredRole}</span>
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className='btn-primary mt-6 w-full px-4 py-2'
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute;
