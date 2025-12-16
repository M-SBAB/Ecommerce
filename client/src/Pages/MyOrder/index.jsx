import React, { useState, useEffect } from 'react';
import {
  Package,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import OrderTimeline from '../../Components/OrderTimeline';

export default function OrderManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch user's orders on component mount
  useEffect(() => {
    if (user && user._id) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user || !user._id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:5000/api/orders/user/${user._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedOrder || !user || !user._id) return;

    try {
      setIsCancelling(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5000/api/orders/${selectedOrder._id}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.ErrorMessage || 'Failed to cancel order');
      }

      const data = await response.json();

      // Update local state with the cancelled order
      setOrders(
        orders.map((order) =>
          order._id === selectedOrder._id ? data.order : order
        )
      );

      setShowCancelModal(false);
      setSelectedOrder(null);
      setSuccessMessage('Order cancelled successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.message || 'Failed to cancel order. Please try again.');
      setShowCancelModal(false);
      setSelectedOrder(null);
    } finally {
      setIsCancelling(false);
    }
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

  // Calculate expected delivery date (7 days from order date for active orders)
  const getExpectedDelivery = (orderDate, status) => {
    if (status === 'cancelled' || status === 'delivered') return null;
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='space-y-6'>
          <div className='mb-8 flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold text-slate-800 mb-2'>
                My Orders
              </h1>
              <p className='text-slate-600'>Track and manage your orders</p>
            </div>
            <button
              onClick={fetchUserOrders}
              disabled={isLoading}
              className='btn-primary flex items-center gap-2 px-4 py-2'
              title='Refresh orders'
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center'>
              <CheckCircle className='w-5 h-5 text-green-600 mr-3' />
              <span className='text-green-800 font-medium'>
                {successMessage}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between'>
              <div className='flex items-center'>
                <AlertCircle className='w-5 h-5 text-red-600 mr-3' />
                <span className='text-red-800 font-medium'>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className='text-red-600 hover:text-red-800'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
              <Loader2 className='w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin' />
              <h3 className='text-xl font-semibold text-slate-800 mb-2'>
                Loading Your Orders...
              </h3>
              <p className='text-slate-600'>
                Please wait while we fetch your orders.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
              <Package className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-slate-800 mb-2'>
                No Orders Yet
              </h3>
              <p className='text-slate-600'>
                You haven't placed any orders yet. Start shopping!
              </p>
            </div>
          ) : (
            <div className='grid gap-6'>
              {orders.map((order) => {
                const expectedDelivery = getExpectedDelivery(
                  order.createdAt,
                  order.status
                );
                return (
                  <div
                    key={order._id}
                    className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden'
                  >
                    <div className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className='text-xl font-semibold text-slate-800'>
                              Order #{order._id?.slice(-8).toUpperCase()}
                            </h3>
                            <p className='text-sm text-slate-500'>
                              Placed on{' '}
                              {new Date(order.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
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
                        <h4 className='text-sm font-medium text-slate-700 mb-3'>
                          Order Items:
                        </h4>
                        {order.items && order.items.length > 0 ? (
                          <div className='space-y-2'>
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className='flex items-center justify-between text-sm bg-slate-50 rounded-lg p-3'
                              >
                                <div className='flex items-center gap-2'>
                                  <span className='w-1.5 h-1.5 bg-slate-400 rounded-full'></span>
                                  <span className='text-slate-700 font-medium'>
                                    {item.productName}
                                  </span>
                                  <span className='text-slate-500'>
                                    x {item.quantity}
                                  </span>
                                </div>
                                <span className='text-slate-700 font-semibold'>
                                  ${item.subtotal?.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className='text-slate-500 text-sm'>No items</p>
                        )}
                      </div>

                      {/* Order Timeline */}
                      <div className='border-t border-slate-200 pt-4 mb-4'>
                        <OrderTimeline
                          currentStatus={order.status}
                          createdAt={order.createdAt}
                          updatedAt={order.updatedAt}
                        />
                      </div>

                      <div className='flex items-center justify-between border-t border-slate-200 pt-4'>
                        <div className='flex gap-6'>
                          <div>
                            <p className='text-sm text-slate-500'>
                              Total Amount
                            </p>
                            <p className='text-xl font-bold text-slate-800'>
                              ${order.totalAmount?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-slate-500'>
                              Payment Method
                            </p>
                            <p className='text-sm font-medium text-slate-700 capitalize'>
                              {order.paymentMethod?.replace('_', ' ') || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-slate-500'>
                              Payment Status
                            </p>
                            <p
                              className={`text-sm font-medium capitalize ${
                                order.paymentStatus === 'paid'
                                  ? 'text-green-600'
                                  : order.paymentStatus === 'failed'
                                  ? 'text-red-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              {order.paymentStatus || 'pending'}
                            </p>
                          </div>
                          {expectedDelivery && (
                            <div>
                              <p className='text-sm text-slate-500'>
                                Expected Delivery
                              </p>
                              <p className='text-sm font-medium text-slate-700'>
                                {expectedDelivery.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          )}
                        </div>

                        {(order.status === 'processing' ||
                          order.status === 'pending') && (
                          <button
                            onClick={() => handleCancelClick(order)}
                            className='btn-danger flex items-center gap-2'
                            disabled={isCancelling}
                          >
                            <X className='w-4 h-4' />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                <span className='font-semibold'>
                  #{selectedOrder?._id?.slice(-8).toUpperCase()}
                </span>
                ?
              </p>
              <p className='text-sm text-slate-500 mb-6'>
                This action cannot be undone. The items will be returned to
                stock.
              </p>

              <div className='flex gap-3'>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className='btn-secondary flex-1'
                  disabled={isCancelling}
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancel}
                  className='btn-danger flex-1 flex items-center justify-center gap-2'
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
