import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Package, CreditCard, Clock } from 'lucide-react';

const RecentOrdersTable = ({ orders, limit = 10, onViewOrder }) => {
  const navigate = useNavigate();

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full border ${
          statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge styling
  const getPaymentBadge = (paymentStatus) => {
    const paymentStyles = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full border ${
          paymentStyles[paymentStatus] ||
          'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle view order details
  const handleViewOrder = (orderId) => {
    if (onViewOrder) {
      onViewOrder(orderId);
    } else {
      navigate(`/manage-order?orderId=${orderId}`);
    }
  };

  const displayOrders = orders?.slice(0, limit) || [];

  if (!displayOrders.length) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-xl font-bold text-gray-800 mb-4'>Recent Orders</h3>
        <div className='text-center py-8 text-gray-500'>
          <Package className='w-12 h-12 mx-auto mb-2 opacity-50' />
          <p>No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='p-6 border-b border-gray-200'>
        <h3 className='text-xl font-bold text-gray-800'>Recent Orders</h3>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Customer
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Date
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Items
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Total
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Payment
              </th>
              <th className='px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                Action
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {displayOrders.map((order) => (
              <tr
                key={order._id}
                className='hover:bg-gray-50 transition-colors'
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-900'>
                      {order.customerName}
                    </span>
                    {order.userId?.username && (
                      <span className='text-xs text-gray-500'>
                        @{order.userId.username}
                      </span>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center text-sm text-gray-700'>
                    <Clock className='w-4 h-4 mr-1 text-gray-400' />
                    {formatDate(order.createdAt)}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center text-sm text-gray-700'>
                    <Package className='w-4 h-4 mr-1 text-gray-400' />
                    {order.items?.length || 0} item(s)
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='text-sm font-semibold text-gray-900'>
                    ${order.totalAmount?.toLocaleString()}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(order.status)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex flex-col gap-1'>
                    {getPaymentBadge(order.paymentStatus)}
                    <span className='text-xs text-gray-500 capitalize'>
                      {order.paymentMethod?.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    onClick={() => handleViewOrder(order._id)}
                    className='inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors'
                  >
                    <Eye className='w-4 h-4 mr-1' />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders?.length > limit && (
        <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
          <button
            onClick={() => navigate('/Dashboard/ManageOrder')}
            className='w-full text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors'
          >
            View all {orders.length} orders →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;
