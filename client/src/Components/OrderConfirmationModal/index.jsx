import React from 'react';
import { CheckCircle, Package, X } from 'lucide-react';

const OrderConfirmationModal = ({ isOpen, order, onClose, onViewOrders }) => {
  if (!isOpen || !order) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300'>
        {/* Header */}
        <div className='bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center relative'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition'
          >
            <X className='w-5 h-5' />
          </button>
          <div className='flex justify-center mb-4'>
            <div className='bg-white rounded-full p-3'>
              <CheckCircle className='w-12 h-12 text-green-500' />
            </div>
          </div>
          <h2 className='text-2xl font-bold text-white mb-2'>
            Order Placed Successfully!
          </h2>
          <p className='text-green-50'>
            Your order has been confirmed and is being processed
          </p>
        </div>

        {/* Order Details */}
        <div className='p-6 space-y-6'>
          {/* Order ID */}
          <div className='bg-gray-50 rounded-lg p-4 text-center'>
            <p className='text-sm text-gray-600 mb-1'>Order ID</p>
            <p className='text-lg font-bold text-gray-900 font-mono'>
              #{order._id?.slice(-8).toUpperCase() || 'N/A'}
            </p>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
              <Package className='w-4 h-4' />
              Shipping Details
            </h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Name:</span>
                <span className='font-semibold text-gray-900'>
                  {order.customerName}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Email:</span>
                <span className='font-semibold text-gray-900'>
                  {order.email}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Phone:</span>
                <span className='font-semibold text-gray-900'>
                  {order.phoneNumber}
                </span>
              </div>
              <div className='pt-2 border-t'>
                <p className='text-gray-600 mb-1'>Address:</p>
                <p className='font-semibold text-gray-900'>
                  {order.address}, {order.city}
                </p>
                <p className='font-semibold text-gray-900'>
                  {order.state}, {order.zipCode}
                </p>
                <p className='font-semibold text-gray-900'>{order.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className='text-sm font-semibold text-gray-700 mb-3'>
              Order Items ({order.items?.length || 0})
            </h3>
            <div className='space-y-2'>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center py-2 border-b last:border-b-0'
                >
                  <div className='flex-1'>
                    <p className='font-medium text-gray-900'>
                      {item.productName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      ${item.price?.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className='font-semibold text-gray-900'>
                    ${item.subtotal?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className='bg-blue-50 rounded-lg p-4'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-700 font-medium'>Total Amount</span>
              <span className='text-2xl font-bold text-blue-600'>
                ${order.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className='text-center'>
            <p className='text-sm text-gray-600'>Payment Method</p>
            <p className='font-semibold text-gray-900 capitalize'>
              {order.paymentMethod?.replace('_', ' ')}
            </p>
          </div>

          {/* Actions */}
          <div className='space-y-3'>
            <button
              onClick={onViewOrders}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200'
            >
              View My Orders
            </button>
            <button
              onClick={onClose}
              className='w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors duration-200'
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
