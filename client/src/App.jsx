import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import AddProducts from './Pages/AddProducts';
import Auth from './Pages/Auth';
import Stats from './Pages/Stats';
import Products from './Pages/Products';
import ListProducts from './Pages/ListProducts';
import ViewOrder from './Pages/ViewOrder';
import ManageOrder from './Pages/ManageOrder';
import StockManagement from './Pages/StockManagement';
import PlaceOrder from './Pages/PlaceOrder';
import SearchProduct from './Pages/SearchProduct';
import AddToCart from './Pages/AddToCart';
import MyOrder from './Pages/MyOrder';
import Login from './Pages/Login';
import FrontPage from './Pages/FrontPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Auth />} />
            <Route path='/Dashboard' element={<Dashboard />}>
              <Route index element={<Stats />} />
              <Route path='products' element={<Products />} />
              <Route path='list' element={<ListProducts />} />
              <Route path='AddProducts' element={<AddProducts />} />
              <Route path='ViewOrder' element={<ViewOrder />} />
              <Route path='ManageOrder' element={<ManageOrder />} />
              <Route path='StockManagement' element={<StockManagement />} />
              <Route path='PlaceOrder' element={<PlaceOrder />} />
              <Route path='SearchProduct' element={<SearchProduct />} />
              <Route path='AddToCart' element={<AddToCart />} />
              <Route path='MyOrder' element={<MyOrder />} />
              <Route path='FrontPage' element={<FrontPage />} />
              {/* <Route path = "Auth" element = {<Auth/>}/> */}
            </Route>
            {/* <Route path ="/Login" element = {<Login/>} /> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
