import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';

const TopProductsList = ({ products, limit = 5, onViewProduct }) => {
  const navigate = useNavigate();

  const displayProducts = products?.slice(0, limit) || [];

  // Get rank badge color
  const getRankBadge = (index) => {
    const badges = [
      {
        bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
        text: 'text-yellow-900',
        icon: '🥇',
      },
      {
        bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
        text: 'text-gray-900',
        icon: '🥈',
      },
      {
        bg: 'bg-gradient-to-br from-amber-600 to-amber-700',
        text: 'text-amber-100',
        icon: '🥉',
      },
    ];

    if (index < 3) {
      return badges[index];
    }
    return {
      bg: 'bg-gradient-to-br from-gray-200 to-gray-300',
      text: 'text-gray-700',
      icon: `#${index + 1}`,
    };
  };

  // Handle view products list
  const handleViewProducts = () => {
    navigate('/list-products');
  };

  // Handle view single product
  const handleViewProduct = (productId) => {
    if (onViewProduct) {
      onViewProduct(productId);
    } else {
      navigate(`/list-products?productId=${productId}`);
    }
  };

  if (!displayProducts.length) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center gap-2 mb-4'>
          <Trophy className='w-6 h-6 text-yellow-500' />
          <h3 className='text-xl font-bold text-gray-800'>
            Top Selling Products
          </h3>
        </div>
        <div className='text-center py-8 text-gray-500'>
          <Package className='w-12 h-12 mx-auto mb-2 opacity-50' />
          <p>No sales data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Trophy className='w-6 h-6 text-yellow-500' />
            <h3 className='text-xl font-bold text-gray-800'>
              Top Selling Products
            </h3>
          </div>
          <span className='text-sm text-gray-500'>by Revenue</span>
        </div>
      </div>

      <div className='divide-y divide-gray-200'>
        {displayProducts.map((product, index) => {
          const rankBadge = getRankBadge(index);
          return (
            <div
              key={product._id}
              className='p-4 hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-start gap-4'>
                {/* Rank badge */}
                <div
                  className={`flex-shrink-0 w-10 h-10 ${rankBadge.bg} rounded-lg flex items-center justify-center shadow-md`}
                >
                  <span className={`text-lg font-bold ${rankBadge.text}`}>
                    {rankBadge.icon}
                  </span>
                </div>

                {/* Product info */}
                <div className='flex-1 min-w-0'>
                  <h4
                    onClick={() => handleViewProduct(product._id)}
                    className='text-sm font-semibold text-gray-900 mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors'
                  >
                    {product.productName}
                  </h4>

                  <div className='flex items-center gap-2 text-xs text-gray-500 mb-2'>
                    <span className='px-2 py-0.5 bg-gray-100 rounded'>
                      {product.category}
                    </span>
                    <span>${product.price}</span>
                  </div>

                  {/* Stats grid */}
                  <div className='grid grid-cols-3 gap-3 mt-3'>
                    {/* Revenue */}
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-1 text-green-600 mb-1'>
                        <DollarSign className='w-3 h-3' />
                        <span className='text-xs font-medium'>Revenue</span>
                      </div>
                      <span className='text-sm font-bold text-gray-900'>
                        ${product.totalRevenue?.toLocaleString() || 0}
                      </span>
                    </div>

                    {/* Units sold */}
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-1 text-blue-600 mb-1'>
                        <Package className='w-3 h-3' />
                        <span className='text-xs font-medium'>Sold</span>
                      </div>
                      <span className='text-sm font-bold text-gray-900'>
                        {product.totalQuantitySold?.toLocaleString() || 0} units
                      </span>
                    </div>

                    {/* Orders */}
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-1 text-purple-600 mb-1'>
                        <ShoppingCart className='w-3 h-3' />
                        <span className='text-xs font-medium'>Orders</span>
                      </div>
                      <span className='text-sm font-bold text-gray-900'>
                        {product.orderCount?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  {/* Stock status */}
                  <div className='mt-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-gray-500'>
                        Current Stock:
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          product.currentStock === 0
                            ? 'text-red-600'
                            : product.currentStock < 10
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`}
                      >
                        {product.currentStock || 0} units
                      </span>
                    </div>

                    {/* Performance indicator */}
                    <div className='flex items-center gap-1 text-green-600'>
                      <TrendingUp className='w-3 h-3' />
                      <span className='text-xs font-medium'>Hot!</span>
                    </div>
                  </div>

                  {/* Stock progress bar */}
                  {product.currentStock !== undefined && (
                    <div className='mt-2'>
                      <div className='w-full bg-gray-200 rounded-full h-1.5'>
                        <div
                          className={`h-1.5 rounded-full ${
                            product.currentStock === 0
                              ? 'bg-red-500'
                              : product.currentStock < 10
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              (product.currentStock / 50) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
        <button
          onClick={handleViewProducts}
          className='w-full text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors'
        >
          View all products →
        </button>
      </div>
    </div>
  );
};

export default TopProductsList;
