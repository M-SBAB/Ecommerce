import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Package, TrendingUp, ExternalLink } from 'lucide-react';

const LowStockAlert = ({ products, threshold = 10, onViewProduct }) => {
  const navigate = useNavigate();

  // Get status styling
  const getStatusStyle = (status) => {
    if (status === 'OUT_OF_STOCK') {
      return {
        badge: 'bg-red-100 text-red-800 border-red-200',
        icon: 'text-red-600',
        text: 'Out of Stock',
      };
    }
    return {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: 'text-amber-600',
      text: 'Low Stock',
    };
  };

  // Handle navigate to stock management
  const handleManageStock = () => {
    navigate('/Dashboard/StockManagement');
  };

  // Handle view product
  const handleViewProduct = (productId) => {
    if (onViewProduct) {
      onViewProduct(productId);
    } else {
      navigate(`/Dashboard/list?productId=${productId}`);
    }
  };

  const displayProducts = products || [];

  if (!displayProducts.length) {
    return (
      <div className='bg-white rounded shadow-md p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl font-bold text-gray-800'>Stock Alerts</h3>
          <div className='flex items-center gap-2 text-green-600'>
            <Package className='w-5 h-5' />
            <span className='text-sm font-medium'>All Good!</span>
          </div>
        </div>
        <div className='text-center py-8 text-gray-500'>
          <Package className='w-12 h-12 mx-auto mb-2 opacity-50' />
          <p>No low stock items</p>
          <p className='text-sm mt-1'>All products are well stocked</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded shadow-md overflow-hidden'>
      <div className='p-6 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-6 h-6 text-amber-500' />
            <h3 className='text-xl font-bold text-gray-800'>Stock Alerts</h3>
          </div>
          <span className='px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full'>
            {displayProducts.length} Alert
            {displayProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className='divide-y divide-gray-200 max-h-96 overflow-y-auto'>
        {displayProducts.map((product) => {
          const statusStyle = getStatusStyle(product.status);
          return (
            <div
              key={product._id}
              className='p-4 hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start gap-3'>
                    <div className={`mt-1 ${statusStyle.icon}`}>
                      <Package className='w-5 h-5' />
                    </div>
                    <div className='flex-1'>
                      <h4
                        onClick={() => handleViewProduct(product._id)}
                        className='text-sm font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors'
                      >
                        {product.productName}
                      </h4>
                      <div className='flex items-center gap-2 text-xs text-gray-500 mb-2'>
                        <span className='px-2 py-0.5 bg-gray-100 rounded'>
                          {product.category}
                        </span>
                        <span>${product.price}</span>
                      </div>

                      {/* Stock level */}
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-sm text-gray-700'>Stock:</span>
                        <span
                          className={`text-sm font-bold ${
                            product.quantity === 0
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {product.quantity} units
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${statusStyle.badge}`}
                        >
                          {statusStyle.text}
                        </span>
                      </div>

                      {/* Order statistics */}
                      {(product.ordersCount > 0 || product.totalSold > 0) && (
                        <div className='flex items-center gap-4 text-xs text-gray-600'>
                          <div className='flex items-center gap-1'>
                            <TrendingUp className='w-3 h-3' />
                            <span>{product.totalSold || 0} sold</span>
                          </div>
                          <div>
                            <span>{product.ordersCount || 0} orders</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={handleManageStock}
                  className='flex-shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors border border-blue-200'
                >
                  Restock
                </button>
              </div>

              {/* Progress bar showing stock level */}
              <div className='mt-3 ml-8'>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all ${
                      product.quantity === 0
                        ? 'bg-red-500'
                        : product.quantity < threshold / 2
                        ? 'bg-amber-500'
                        : 'bg-amber-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        (product.quantity / threshold) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with action button */}
      <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
        <button
          onClick={handleManageStock}
          className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors'
        >
          <Package className='w-4 h-4' />
          Manage Stock
          <ExternalLink className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
};

export default LowStockAlert;
