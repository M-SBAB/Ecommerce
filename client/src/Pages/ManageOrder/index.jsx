import React, { useState } from 'react';
import {
  Package,
  Edit,
  Save,
  X,
  Search,
  Filter,
  ChevronDown,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

const OrderViewUpdateUI = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 234-567-8900',
      orderDate: '2024-11-20',
      status: 'Delivered',
      total: 299.99,
      items: 3,
      shippingAddress: '123 Main St, New York, NY 10001',
      trackingNumber: 'TRK123456789',
      paymentMethod: 'Credit Card',
      notes: 'Leave at door',
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 234-567-8901',
      orderDate: '2024-11-22',
      status: 'Processing',
      total: 149.5,
      items: 2,
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      trackingNumber: '',
      paymentMethod: 'PayPal',
      notes: '',
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '+1 234-567-8902',
      orderDate: '2024-11-24',
      status: 'Shipped',
      total: 499.99,
      items: 5,
      shippingAddress: '789 Pine Rd, Chicago, IL 60601',
      trackingNumber: 'TRK987654321',
      paymentMethod: 'Credit Card',
      notes: 'Fragile items',
    },
    {
      id: 'ORD-004',
      customerName: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1 234-567-8903',
      orderDate: '2024-11-25',
      status: 'Pending',
      total: 89.99,
      items: 1,
      shippingAddress: '321 Elm St, Houston, TX 77001',
      trackingNumber: '',
      paymentMethod: 'Debit Card',
      notes: '',
    },
  ]);

  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showSuccess, setShowSuccess] = useState(false);

  const statusOptions = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className='w-5 h-5' />;
      case 'Shipped':
        return <Truck className='w-5 h-5' />;
      case 'Processing':
        return <Clock className='w-5 h-5' />;
      case 'Pending':
        return <AlertCircle className='w-5 h-5' />;
      default:
        return <Package className='w-5 h-5' />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Pending':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleEdit = (order) => {
    setEditingOrder({ ...order });
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const handleSave = () => {
    setOrders(
      orders.map((order) =>
        order.id === editingOrder.id ? editingOrder : order
      )
    );
    setEditingOrder(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (field, value) => {
    setEditingOrder({ ...editingOrder, [field]: value });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              Order Management
            </h1>
            <p className='text-gray-600'>View and update customer orders</p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className='mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center'>
              <CheckCircle className='w-5 h-5 text-green-600 mr-3' />
              <span className='text-green-800 font-medium'>
                Order updated successfully!
              </span>
            </div>
          )}

          {/* Search and Filter */}
          <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search by Order ID or Customer Name...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
              <div className='relative'>
                <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white'
                >
                  <option value='All'>All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
              <Package className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No Orders Found
              </h3>
              <p className='text-gray-600'>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
                >
                  {/* Order Header */}
                  <div className='border-b border-gray-200 p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-lg font-bold text-gray-900'>
                          {order.id}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {order.orderDate}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className='text-sm font-medium'>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <p className='text-gray-800 font-semibold'>
                        {order.customerName}
                      </p>
                      <p className='text-sm text-gray-600'>{order.email}</p>
                      <p className='text-sm text-gray-600'>{order.phone}</p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className='p-6 space-y-3'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Items:</span>
                      <span className='font-medium text-gray-900'>
                        {order.items}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Total Amount:</span>
                      <span className='font-bold text-gray-900 text-lg'>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Payment:</span>
                      <span className='font-medium text-gray-900'>
                        {order.paymentMethod}
                      </span>
                    </div>
                    {order.trackingNumber && (
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Tracking:</span>
                        <span className='font-medium text-gray-900'>
                          {order.trackingNumber}
                        </span>
                      </div>
                    )}
                    <div className='pt-2'>
                      <p className='text-sm text-gray-600 mb-1'>
                        Shipping Address:
                      </p>
                      <p className='text-sm text-gray-800'>
                        {order.shippingAddress}
                      </p>
                    </div>
                    {order.notes && (
                      <div className='pt-2'>
                        <p className='text-sm text-gray-600 mb-1'>Notes:</p>
                        <p className='text-sm text-gray-800 italic'>
                          {order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className='border-t border-gray-200 p-4'>
                    <button
                      onClick={() => handleEdit(order)}
                      className='btn-primary btn-full flex items-center justify-center gap-2'
                    >
                      <Edit className='w-4 h-4' />
                      Update Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit Modal */}
          {editingOrder && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
              <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Update Order - {editingOrder.id}
                  </h2>
                  <button onClick={handleCancel} className='btn-ghost'>
                    <X className='w-6 h-6' />
                  </button>
                </div>

                <div className='p-6 space-y-6'>
                  {/* Order Status */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Order Status *
                    </label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) =>
                        handleInputChange('status', e.target.value)
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tracking Number */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Tracking Number
                    </label>
                    <input
                      type='text'
                      value={editingOrder.trackingNumber}
                      onChange={(e) =>
                        handleInputChange('trackingNumber', e.target.value)
                      }
                      placeholder='Enter tracking number'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Shipping Address *
                    </label>
                    <textarea
                      value={editingOrder.shippingAddress}
                      onChange={(e) =>
                        handleInputChange('shippingAddress', e.target.value)
                      }
                      rows='3'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  {/* Customer Info */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Customer Name *
                      </label>
                      <input
                        type='text'
                        value={editingOrder.customerName}
                        onChange={(e) =>
                          handleInputChange('customerName', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Phone Number *
                      </label>
                      <input
                        type='tel'
                        value={editingOrder.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Email Address *
                    </label>
                    <input
                      type='email'
                      value={editingOrder.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Order Notes
                    </label>
                    <textarea
                      value={editingOrder.notes}
                      onChange={(e) =>
                        handleInputChange('notes', e.target.value)
                      }
                      rows='3'
                      placeholder='Add any special instructions or notes...'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>
                </div>

                <div className='sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3'>
                  <button onClick={handleCancel} className='btn-outline flex-1'>
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className='btn-success flex-1 flex items-center justify-center gap-2'
                  >
                    <Save className='w-4 h-4' />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderViewUpdateUI;
