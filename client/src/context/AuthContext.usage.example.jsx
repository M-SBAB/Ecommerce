/**
 * AuthContext Usage Guide
 *
 * The AuthContext provides global authentication state management.
 * You can access user data and role anywhere in your application.
 *
 * HOW TO USE:
 */

// 1. Import the useAuth hook
import { useAuth } from '../../context/AuthContext';

// 2. In any component, use the hook to access auth state
const MyComponent = () => {
  const {
    user, // Current user object (contains username, role, _id, etc.)
    isAuthenticated, // Boolean - true if user is logged in
    isLoading, // Boolean - true while checking auth state
    login, // Function to login user: login(userData)
    logout, // Function to logout user: logout()
    hasRole, // Function to check role: hasRole('admin')
    isAdmin, // Function - returns true if user is admin
    isUser, // Function - returns true if user is regular user
  } = useAuth();

  // Example 1: Display user info
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Your role: {user.role}</p>

      {/* Example 2: Conditional rendering based on role */}
      {isAdmin() && (
        <div>
          <h2>Admin Panel</h2>
          <p>You have admin access</p>
        </div>
      )}

      {isUser() && (
        <div>
          <h2>User Dashboard</h2>
          <p>You have user access</p>
        </div>
      )}

      {/* Example 3: Check specific role */}
      {hasRole('admin') && <button>Admin Only Button</button>}

      {/* Example 4: Logout */}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

/**
 * SIDEBAR EXAMPLE - Role-based navigation
 */

const Sidebar = () => {
  const { isAdmin, isUser, user } = useAuth();

  const adminLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/AddProducts', label: 'Add Product', icon: '➕' },
    { path: '/StockManagement', label: 'Stock Management', icon: '📦' },
    { path: '/ManageOrder', label: 'Manage Orders', icon: '⚙️' },
    { path: '/ViewOrder', label: 'View Orders', icon: '👁️' },
  ];

  const userLinks = [
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/MyOrder', label: 'My Orders', icon: '📝' },
    { path: '/AddToCart', label: 'Cart', icon: '🛒' },
  ];

  return (
    <div className='sidebar'>
      <h1>Welcome, {user?.username}</h1>

      <nav>
        {isAdmin() &&
          adminLinks.map((link) => (
            <a key={link.path} href={link.path}>
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}

        {isUser() &&
          userLinks.map((link) => (
            <a key={link.path} href={link.path}>
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
      </nav>
    </div>
  );
};

/**
 * PROTECTED ROUTE EXAMPLE
 * Create a component to protect routes that require authentication
 */

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

// Usage in App.jsx:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// <Route path="/AddProducts" element={<ProtectedRoute requireAdmin={true}><AddProducts /></ProtectedRoute>} />

export default MyComponent;
