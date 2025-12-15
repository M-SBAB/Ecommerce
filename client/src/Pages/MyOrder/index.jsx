import React, { useState } from 'react';
import { Package, X, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-11-25',
      items: ['Wireless Headphones', 'Phone Case'],
      total: 89.99,
      status: 'processing',
      deliveryDate: '2024-12-02',
    },
    {
      id: 'ORD-002',
      date: '2024-11-24',
      items: ['Smart Watch', 'Charging Cable'],
      total: 299.99,
      status: 'shipped',
      deliveryDate: '2024-11-30',
    },
    {
      id: 'ORD-003',
      date: '2024-11-23',
      items: ['Laptop Stand', 'Wireless Mouse'],
      total: 65.5,
      status: 'delivered',
      deliveryDate: '2024-11-27',
    },
    {
      id: 'ORD-004',
      date: '2024-11-28',
      items: ['Bluetooth Speaker'],
      total: 45.0,
      status: 'processing',
      deliveryDate: '2024-12-05',
    },
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status: 'cancelled' }
          : order
      )
    );
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className='w-5 h-5 text-blue-500' />;
      case 'shipped':
        return <Truck className='w-5 h-5 text-purple-500' />;
      case 'delivered':
        return <CheckCircle className='w-5 h-5 text-green-500' />;
      case 'cancelled':
        return <XCircle className='w-5 h-5 text-red-500' />;
      default:
        return <Package className='w-5 h-5 text-gray-500' />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-800 mb-2'>My Orders</h1>
          <p className='text-slate-600'>Track and manage your orders</p>
        </div>

        <div className='grid gap-6'>
          {orders.map((order) => (
            <div
              key={order.id}
              className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden'
            >
              <div className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className='text-xl font-semibold text-slate-800'>
                        {order.id}
                      </h3>
                      <p className='text-sm text-slate-500'>
                        Placed on{' '}
                        {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className='border-t border-slate-200 pt-4 mb-4'>
                  <h4 className='text-sm font-medium text-slate-700 mb-2'>
                    Items:
                  </h4>
                  <ul className='space-y-1'>
                    {order.items.map((item, idx) => (
                      <li
                        key={idx}
                        className='text-slate-600 flex items-center gap-2'
                      >
                        <span className='w-1.5 h-1.5 bg-slate-400 rounded-full'></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='flex items-center justify-between border-t border-slate-200 pt-4'>
                  <div className='flex gap-6'>
                    <div>
                      <p className='text-sm text-slate-500'>Total Amount</p>
                      <p className='text-xl font-bold text-slate-800'>
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    {order.status !== 'cancelled' &&
                      order.status !== 'delivered' && (
                        <div>
                          <p className='text-sm text-slate-500'>
                            Expected Delivery
                          </p>
                          <p className='text-sm font-medium text-slate-700'>
                            {new Date(order.deliveryDate).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
                          </p>
                        </div>
                      )}
                  </div>

                  {(order.status === 'processing' ||
                    order.status === 'shipped') && (
                    <button
                      onClick={() => handleCancelClick(order)}
                      className='btn-danger flex items-center gap-2'
                    >
                      <X className='w-4 h-4' />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCancelModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <XCircle className='w-6 h-6 text-red-600' />
              </div>
              <h3 className='text-2xl font-bold text-slate-800'>
                Cancel Order?
              </h3>
            </div>

            <p className='text-slate-600 mb-2'>
              Are you sure you want to cancel order{' '}
              <span className='font-semibold'>{selectedOrder?.id}</span>?
            </p>
            <p className='text-sm text-slate-500 mb-6'>
              This action cannot be undone.
            </p>

            <div className='flex gap-3'>
              <button
                onClick={() => setShowCancelModal(false)}
                className='btn-secondary flex-1'
              >
                Keep Order
              </button>
              <button onClick={confirmCancel} className='btn-danger flex-1'>
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
