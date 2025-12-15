import React, { useState } from 'react';
import { ShoppingCart, Search, Heart } from 'lucide-react';

const EcommercePage = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 89.99,
      category: 'Electronics',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      description:
        'Premium noise-canceling wireless headphones with 30-hour battery life',
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      price: 24.99,
      category: 'Clothing',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      description: 'Comfortable 100% organic cotton t-shirt in various colors',
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 199.99,
      category: 'Electronics',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      description: 'Fitness tracker with heart rate monitor and GPS',
    },
    {
      id: 4,
      name: 'Yoga Mat',
      price: 34.99,
      category: 'Sports',
      image:
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop',
      description: 'Non-slip eco-friendly yoga mat with carrying strap',
    },
    {
      id: 5,
      name: 'Coffee Maker',
      price: 79.99,
      category: 'Home & Garden',
      image:
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop',
      description: 'Programmable drip coffee maker with thermal carafe',
    },
    {
      id: 6,
      name: 'Fiction Novel',
      price: 14.99,
      category: 'Books',
      image:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      description: 'Bestselling mystery novel by acclaimed author',
    },
    {
      id: 7,
      name: 'Running Shoes',
      price: 119.99,
      category: 'Sports',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      description: 'Lightweight running shoes with superior cushioning',
    },
    {
      id: 8,
      name: 'Denim Jeans',
      price: 59.99,
      category: 'Clothing',
      image:
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      description: 'Classic fit denim jeans with stretch comfort',
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const buyNow = (product) => {
    alert(`Proceeding to checkout for ${product.name}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-blue-600'>ShopHub</h1>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <ShoppingCart className='w-6 h-6 text-gray-700' />
                {cart.length > 0 && (
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Categories */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          {/* Search Bar */}
          <div className='relative mb-6'>
            <Search className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Categories */}
          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow'
            >
              <div className='relative'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-full h-48 object-cover'
                />
                <button className='absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100'>
                  <Heart className='w-5 h-5 text-gray-600' />
                </button>
              </div>

              <div className='p-4'>
                <span className='text-xs text-blue-600 font-semibold'>
                  {product.category}
                </span>
                <h3 className='text-lg font-semibold text-gray-800 mt-1'>
                  {product.name}
                </h3>
                <p className='text-sm text-gray-600 mt-2 line-clamp-2'>
                  {product.description}
                </p>

                <div className='mt-4 flex items-center justify-between'>
                  <span className='text-2xl font-bold text-gray-900'>
                    ${product.price}
                  </span>
                </div>

                <div className='mt-4 flex gap-2'>
                  <button
                    onClick={() => addToCart(product)}
                    className='btn-secondary flex-1'
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => buyNow(product)}
                    className='btn-primary flex-1'
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommercePage;
