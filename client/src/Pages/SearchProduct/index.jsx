import React, { useState } from 'react';
import { Search, Package, Tag, X, Filter } from 'lucide-react';

// Sample product data (simulating admin published products)
const publishedProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    stock: 15,
    published: true,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    category: 'Electronics',
    stock: 8,
    published: true,
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.99,
    category: 'Sports',
    stock: 25,
    published: true,
  },
  {
    id: 4,
    name: 'Laptop Bag',
    price: 49.99,
    category: 'Accessories',
    stock: 12,
    published: true,
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    price: 59.99,
    category: 'Electronics',
    stock: 20,
    published: true,
  },
  {
    id: 6,
    name: 'Yoga Mat',
    price: 29.99,
    category: 'Sports',
    stock: 30,
    published: true,
  },
  {
    id: 7,
    name: 'Coffee Maker',
    price: 129.99,
    category: 'Home & Kitchen',
    stock: 10,
    published: true,
  },
  {
    id: 8,
    name: 'Water Bottle',
    price: 19.99,
    category: 'Sports',
    stock: 50,
    published: true,
  },
  {
    id: 9,
    name: 'Gaming Mouse',
    price: 69.99,
    category: 'Electronics',
    stock: 18,
    published: true,
  },
  {
    id: 10,
    name: 'Desk Lamp',
    price: 39.99,
    category: 'Home & Kitchen',
    stock: 22,
    published: true,
  },
  {
    id: 11,
    name: 'Backpack',
    price: 54.99,
    category: 'Accessories',
    stock: 15,
    published: true,
  },
  {
    id: 12,
    name: 'Fitness Tracker',
    price: 99.99,
    category: 'Sports',
    stock: 12,
    published: true,
  },
];

export default function ProductSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, products, categories

  // Get unique categories
  const categories = [...new Set(publishedProducts.map((p) => p.category))];

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();

    // Search in both products and categories
    const productMatches = publishedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );

    const categoryMatches = categories.filter((cat) =>
      cat.toLowerCase().includes(lowerQuery)
    );

    // Combine results
    const results = [];

    // Add category matches
    if (selectedFilter === 'all' || selectedFilter === 'categories') {
      categoryMatches.forEach((cat) => {
        const productsInCategory = publishedProducts.filter(
          (p) => p.category === cat
        );
        results.push({
          type: 'category',
          name: cat,
          count: productsInCategory.length,
          products: productsInCategory,
        });
      });
    }

    // Add product matches
    if (selectedFilter === 'all' || selectedFilter === 'products') {
      productMatches.forEach((product) => {
        if (
          !results.some(
            (r) => r.type === 'category' && r.name === product.category
          )
        ) {
          results.push({
            type: 'product',
            ...product,
          });
        }
      });
    }

    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center mb-3'>
              <Package className='w-12 h-12 text-indigo-600' />
            </div>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>
              Product Search
            </h1>
            <p className='text-gray-600'>
              Search through all published products and categories
            </p>
          </div>

          {/* Search Section */}
          <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
            {/* Search Bar */}
            <div className='relative mb-4'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search by product name or category...'
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className='w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg'
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              )}
            </div>

            {/* Filter Options */}
            <div className='flex items-center gap-3'>
              <Filter className='w-4 h-4 text-gray-500' />
              <span className='text-sm text-gray-600'>Filter:</span>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setSelectedFilter('all');
                    if (searchQuery) handleSearch(searchQuery);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter('products');
                    if (searchQuery) handleSearch(searchQuery);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'products'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Products Only
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter('categories');
                    if (searchQuery) handleSearch(searchQuery);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === 'categories'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Categories Only
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {isSearching && (
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <div className='mb-4'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Search Results for "{searchQuery}"
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  {searchResults.length} result
                  {searchResults.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className='space-y-4'>
                  {searchResults.map((result, index) =>
                    result.type === 'category' ? (
                      // Category Result
                      <div
                        key={`cat-${index}`}
                        className='border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50'
                      >
                        <div className='flex items-center gap-3 mb-3'>
                          <Tag className='w-5 h-5 text-indigo-600' />
                          <h3 className='text-lg font-semibold text-gray-800'>
                            {result.name}
                          </h3>
                          <span className='ml-auto bg-indigo-600 text-white px-3 py-1 rounded-full text-sm'>
                            {result.count} products
                          </span>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3'>
                          {result.products.slice(0, 4).map((product) => (
                            <div
                              key={product.id}
                              className='bg-white rounded p-3 text-sm'
                            >
                              <p className='font-medium text-gray-800'>
                                {product.name}
                              </p>
                              <p className='text-indigo-600 font-semibold'>
                                ${product.price}
                              </p>
                            </div>
                          ))}
                        </div>
                        {result.count > 4 && (
                          <p className='text-sm text-gray-600 mt-2 text-center'>
                            +{result.count - 4} more products in this category
                          </p>
                        )}
                      </div>
                    ) : (
                      // Product Result
                      <div
                        key={`prod-${result.id}`}
                        className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3'>
                              <Package className='w-5 h-5 text-gray-400' />
                              <h3 className='font-semibold text-gray-800 text-lg'>
                                {result.name}
                              </h3>
                            </div>
                            <div className='flex items-center gap-4 mt-2 ml-8'>
                              <span className='text-sm text-gray-500'>
                                Category:{' '}
                                <span className='font-medium text-indigo-600'>
                                  {result.category}
                                </span>
                              </span>
                              <span className='text-sm text-gray-500'>
                                Stock:{' '}
                                <span className='font-medium'>
                                  {result.stock} units
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-2xl font-bold text-indigo-600'>
                              ${result.price}
                            </p>
                            <span className='inline-block mt-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium'>
                              Published
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <div className='text-gray-300 mb-4'>
                    <Search className='w-20 h-20 mx-auto' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                    No Results Found
                  </h3>
                  <p className='text-gray-500 mb-4'>
                    We couldn't find any products or categories matching "
                    {searchQuery}"
                  </p>
                  <button onClick={clearSearch} className='btn-primary btn-lg'>
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Initial State - Show Available Categories */}
          {!isSearching && (
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                Available Categories ({categories.length})
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {categories.map((category, index) => {
                  const count = publishedProducts.filter(
                    (p) => p.category === category
                  ).length;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSearch(category)}
                      className='btn-outline p-4 flex flex-col items-center'
                    >
                      <Tag className='w-6 h-6 text-indigo-600 mb-2' />
                      <p className='font-medium text-gray-800 text-sm'>
                        {category}
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {count} products
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className='mt-6 pt-6 border-t border-gray-200'>
                <p className='text-center text-gray-600'>
                  <span className='font-semibold text-indigo-600'>
                    {publishedProducts.length}
                  </span>{' '}
                  total products published for sale
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
