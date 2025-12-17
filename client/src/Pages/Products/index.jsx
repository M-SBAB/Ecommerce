import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Filter, X, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Toast from '../../Components/Toast';

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:6001/products/all?';
      const params = [];

      if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
      if (selectedCategory) params.push(`category=${selectedCategory}`);
      if (priceRange.min) params.push(`minPrice=${priceRange.min}`);
      if (priceRange.max) params.push(`maxPrice=${priceRange.max}`);

      url += params.join('&');

      const res = await fetch(url);
      const response = await res.json();

      if (response.products) {
        setProducts(response.products);
      } else if (response.ErrorMessage) {
        console.error(response.ErrorMessage);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCategory, priceRange]);

  const handleAddToCart = (product) => {
    const success = addToCart(product, 1);
    if (success) {
      setToast({
        message: `${product.productName} added to cart!`,
        type: 'success',
      });
    } else {
      setToast({
        message: 'Failed to add product to cart',
        type: 'error',
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
  };

  const getProductImage = (category) => {
    const images = {
      electronics:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      clothing:
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
      food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      books:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
      home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop',
      sports:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    };
    return (
      images[category] ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Toast Notification */}
      {toast && (
        <div className='fixed top-4 right-4 z-50 min-w-[300px]'>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <Package className='w-8 h-8 text-blue-600' />
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
              Browse Products
            </h1>
          </div>
          <p className='text-gray-600'>
            Discover our wide range of quality products
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className='bg-white rounded-xl shadow-sm p-4 mb-6 space-y-4'>
          {/* Search Bar */}
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search products...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <Filter className='w-5 h-5' />
              <span className='hidden sm:inline'>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className='border-t border-gray-200 pt-4 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Category Filter */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Min Price
                  </label>
                  <input
                    type='number'
                    placeholder='$0'
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    min='0'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Max Price
                  </label>
                  <input
                    type='number'
                    placeholder='$9999'
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    min='0'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className='flex justify-end'>
                <button
                  onClick={clearFilters}
                  className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <X className='w-4 h-4' />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        ) : products.length === 0 ? (
          <div className='text-center py-20'>
            <Package className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              No products found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className='mb-4 text-sm text-gray-600'>
              Showing {products.length} product
              {products.length !== 1 ? 's' : ''}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {products.map((product) => (
                <div
                  key={product._id}
                  className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group'
                >
                  {/* Product Image */}
                  <div className='relative h-48 overflow-hidden bg-gray-100'>
                    <img
                      src={getProductImage(product.category)}
                      alt={product.productName}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    {product.quantity === 0 && (
                      <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                        <span className='bg-red-600 text-white px-4 py-2 rounded-lg font-semibold'>
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <span className='absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full capitalize'>
                      {product.category}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className='p-4'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]'>
                      {product.productName}
                    </h3>
                    <p className='text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]'>
                      {product.description}
                    </p>

                    {/* Price and Stock */}
                    <div className='flex items-center justify-between mb-4'>
                      <div>
                        <span className='text-2xl font-bold text-blue-600'>
                          ${product.price}
                        </span>
                      </div>
                      <div className='text-sm text-gray-600'>
                        {product.quantity > 0 ? (
                          <span className='flex items-center gap-1'>
                            <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                            {product.quantity} in stock
                          </span>
                        ) : (
                          <span className='flex items-center gap-1 text-red-600'>
                            <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        product.quantity === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                      }`}
                    >
                      <ShoppingCart className='w-5 h-5' />
                      {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
