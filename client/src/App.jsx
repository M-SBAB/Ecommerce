import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './Components/Layout/DashboardLayout';
import AddProducts from './Pages/AddProducts';
import Auth from './Pages/Auth';
import Stats from './Pages/Stats';
import Products from './Pages/Products';
import ListProducts from './Pages/ListProducts';
import ManageOrder from './Pages/ManageOrder';
import StockManagement from './Pages/StockManagement';
import PlaceOrder from './Pages/PlaceOrder';
import SearchProduct from './Pages/SearchProduct';
import AddToCart from './Pages/AddToCart';
import MyOrder from './Pages/MyOrder';
import FrontPage from './Pages/FrontPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Auth />} />
              <Route path='/Dashboard' element={<DashboardLayout />}>
                {/* Admin Routes */}
                <Route
                  index
                  element={
                    <ProtectedRoute requiredRole='admin'>
                      <Stats />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='AddProducts'
                  element={
                    <ProtectedRoute requiredRole='admin'>
                      <AddProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='list'
                  element={
                    <ProtectedRoute requiredRole='admin'>
                      <ListProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='StockManagement'
                  element={
                    <ProtectedRoute requiredRole='admin'>
                      <StockManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='ManageOrder'
                  element={
                    <ProtectedRoute requiredRole='admin'>
                      <ManageOrder />
                    </ProtectedRoute>
                  }
                />

                {/* User Routes */}
                <Route
                  path='products'
                  element={
                    <ProtectedRoute requiredRole='user'>
                      <Products />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='MyOrder'
                  element={
                    <ProtectedRoute requiredRole='user'>
                      <MyOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='AddToCart'
                  element={
                    <ProtectedRoute requiredRole='user'>
                      <AddToCart />
                    </ProtectedRoute>
                  }
                />

                {/* Shared/Utility Routes (accessible by authenticated users) */}
                <Route path='PlaceOrder' element={<PlaceOrder />} />
                <Route path='SearchProduct' element={<SearchProduct />} />
                <Route path='FrontPage' element={<FrontPage />} />
              </Route>
              {/* <Route path ="/Login" element = {<Login/>} /> */}
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
