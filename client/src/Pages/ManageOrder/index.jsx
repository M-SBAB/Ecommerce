import React, { useState, useEffect } from 'react';
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
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import OrderTimeline from '../../Components/OrderTimeline';
import Toast from '../../Components/Toast';
import { useAuth } from '../../context/AuthContext';

const OrderViewUpdateUI = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersPerPage] = useState(10);

  const statusOptions = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  // Fetch all orders from backend
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchTerm, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
        userId: user._id,
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter && statusFilter !== 'All')
        params.append('status', statusFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(
        `http://localhost:6001/orders/?${params.toString()}`,
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

      // Update pagination info
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
        setTotalOrders(data.pagination.totalOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setToast({
        message: err.message || 'Failed to load orders. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleEdit = async (order) => {
    setEditingOrder({ ...order });
    await fetchAvailableProducts();
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  // Fetch available products for adding to order
  const fetchAvailableProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch('http://localhost:6001/products/getAll');
      if (response.ok) {
        const data = await response.json();
        setAvailableProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      setError(null);

      // Update order status
      const statusResponse = await fetch(
        `http://localhost:6001/orders/${editingOrder._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: editingOrder.status,
            userId: user._id,
          }),
        }
      );

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(
          errorData.ErrorMessage || 'Failed to update order status'
        );
      }

      // Update payment status
      const paymentResponse = await fetch(
        `http://localhost:6001/orders/${editingOrder._id}/payment-status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentStatus: editingOrder.paymentStatus,
            userId: user._id,
          }),
        }
      );

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(
          errorData.ErrorMessage || 'Failed to update payment status'
        );
      }

      const data = await paymentResponse.json();

      // Update local state with the updated order
      setOrders(
        orders.map((order) =>
          order._id === editingOrder._id ? data.order : order
        )
      );

      setEditingOrder(null);
      setToast({
        message: 'Order updated successfully!',
        type: 'success',
      });
    } catch (err) {
      console.error('Error updating order:', err);
      setToast({
        message: err.message || 'Failed to update order. Please try again.',
        type: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle item quantity change
  const handleItemQuantityChange = (index, newQuantity) => {
    const updatedItems = [...editingOrder.items];
    const item = updatedItems[index];
    const quantity = parseInt(newQuantity) || 0;

    if (quantity > 0) {
      item.quantity = quantity;
      item.subtotal = item.price * quantity;

      // Recalculate total
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      setEditingOrder({
        ...editingOrder,
        items: updatedItems,
        totalAmount: newTotal,
      });
    }
  };

  // Remove item from order
  const handleRemoveItem = (index) => {
    const updatedItems = editingOrder.items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      totalAmount: newTotal,
    });
  };

  // Add new item to order
  const handleAddItem = (productId) => {
    const product = availableProducts.find((p) => p._id === productId);
    if (!product) return;

    const newItem = {
      productId: product._id,
      productName: product.productName,
      price: product.price,
      quantity: 1,
      subtotal: product.price,
    };

    const updatedItems = [...editingOrder.items, newItem];
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    setEditingOrder({
      ...editingOrder,
      items: updatedItems,
      totalAmount: newTotal,
    });
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle filter changes
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDateFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleInputChange = (field, value) => {
    setEditingOrder({ ...editingOrder, [field]: value });
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate total items count
  const getTotalItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

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

          {/* Toast Notification */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          {/* Search and Filter */}
          <div className='bg-white rounded shadow-sm p-4 mb-6'>
            <div className='space-y-4'>
              {/* First Row: Search and Status */}
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type='text'
                    placeholder='Search by Order ID, Customer Name, or Product Name...'
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    disabled={isLoading}
                  />
                </div>
                <div className='relative'>
                  <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className='pl-10 pr-8 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]'
                    disabled={isLoading}
                  >
                    <option value='All'>All Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
                </div>
              </div>

              {/* Second Row: Date Range and Actions */}
              <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-gray-400' />
                  <span className='text-sm text-gray-600'>Date Range:</span>
                </div>
                <div className='flex gap-2 items-center flex-wrap'>
                  <input
                    type='date'
                    value={startDate}
                    onChange={(e) => handleDateFilter(e.target.value, endDate)}
                    className='px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                    disabled={isLoading}
                  />
                  <span className='text-gray-400'>to</span>
                  <input
                    type='date'
                    value={endDate}
                    onChange={(e) =>
                      handleDateFilter(startDate, e.target.value)
                    }
                    className='px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                    disabled={isLoading}
                  />
                </div>
                <div className='flex gap-2 ml-auto'>
                  {(searchTerm ||
                    statusFilter !== 'All' ||
                    startDate ||
                    endDate) && (
                    <button
                      onClick={clearFilters}
                      className='btn-outline px-4 py-2 text-sm px-4 py-2'
                      disabled={isLoading}
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={fetchOrders}
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
              </div>

              {/* Results Summary */}
              {!isLoading && (
                <div className='text-sm text-gray-600 pt-2 border-t border-gray-200'>
                  Showing {orders.length} of {totalOrders} orders
                  {(searchTerm ||
                    statusFilter !== 'All' ||
                    startDate ||
                    endDate) && (
                    <span className='text-blue-600 ml-1'>(filtered)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className='bg-white rounded shadow-sm p-12 text-center'>
              <Loader2 className='w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin' />
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Loading Orders...
              </h3>
              <p className='text-gray-600'>
                Please wait while we fetch the orders.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className='bg-white rounded shadow-sm p-12 text-center'>
              <Package className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No Orders Found
              </h3>
              <p className='text-gray-600'>
                {totalOrders === 0
                  ? 'No orders have been placed yet.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className='bg-white rounded shadow-sm hover:shadow-md transition-shadow'
                  >
                    {/* Order Header */}
                    <div className='border-b border-gray-200 p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <h3 className='text-lg font-bold text-gray-900'>
                            Order #{order._id?.slice(-8).toUpperCase()}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className='text-sm font-medium capitalize'>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <p className='text-gray-800 font-semibold'>
                          {order.customerName}
                        </p>
                        <p className='text-sm text-gray-600'>{order.email}</p>
                        <p className='text-sm text-gray-600'>
                          {order.phoneNumber}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className='p-6 space-y-3'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Items:</span>
                        <span className='font-medium text-gray-900'>
                          {getTotalItems(order.items)}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Total Amount:</span>
                        <span className='font-bold text-gray-900 text-lg'>
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Payment Method:</span>
                        <span className='font-medium text-gray-900 capitalize'>
                          {order.paymentMethod?.replace('_', ' ') || 'N/A'}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Payment Status:</span>
                        <span
                          className={`font-medium capitalize ${
                            order.paymentStatus === 'paid'
                              ? 'text-green-600'
                              : order.paymentStatus === 'failed'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {order.paymentStatus || 'pending'}
                        </span>
                      </div>
                      <div className='pt-2'>
                        <p className='text-sm text-gray-600 mb-1'>
                          Shipping Address:
                        </p>
                        <p className='text-sm text-gray-800'>
                          {order.address}, {order.city}, {order.state}{' '}
                          {order.zipCode}, {order.country}
                        </p>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div className='pt-2 border-t border-gray-100'>
                          <p className='text-sm text-gray-600 mb-2'>
                            Order Items:
                          </p>
                          <div className='space-y-1'>
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className='flex justify-between text-sm'
                              >
                                <span className='text-gray-700'>
                                  {item.productName} x {item.quantity}
                                </span>
                                <span className='text-gray-900 font-medium'>
                                  ${item.subtotal?.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className='border-t border-gray-200 p-4'>
                      <button
                        onClick={() => handleEdit(order)}
                        className='btn-primary btn-full flex items-center justify-center gap-2 px-4 py-2'
                      >
                        <Edit className='w-4 h-4' />
                        Update Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className='mt-8 flex items-center justify-between bg-white rounded shadow-sm p-4'>
                  <div className='text-sm text-gray-600'>
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || isLoading}
                      className='btn-outline px-3 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2'
                    >
                      <ChevronLeft className='w-4 h-4' />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className='flex gap-1'>
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={isLoading}
                              className={`px-3 py-2 rounded transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } disabled:opacity-50`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span key={pageNum} className='px-2 text-gray-400'>
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages || isLoading}
                      className='btn-outline px-3 py-2 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2'
                    >
                      Next
                      <ChevronRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Edit Modal */}
          {editingOrder && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
              <div className='bg-white rounded shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Update Order - #{editingOrder._id?.slice(-8).toUpperCase()}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className='btn-ghost px-4 py-2'
                    disabled={isUpdating}
                  >
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
                      className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize'
                      disabled={isUpdating}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order Timeline */}
                  <div className='bg-white border border-gray-200 rounded p-4'>
                    <OrderTimeline
                      currentStatus={editingOrder.status}
                      createdAt={editingOrder.createdAt}
                      updatedAt={editingOrder.updatedAt}
                    />
                  </div>

                  {/* Order Information - Read Only */}
                  <div className='bg-gray-50 rounded p-4 space-y-3'>
                    <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                      Order Information (Read Only)
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-xs text-gray-600 mb-1'>
                          Customer Name
                        </label>
                        <p className='text-sm font-medium text-gray-900'>
                          {editingOrder.customerName}
                        </p>
                      </div>
                      <div>
                        <label className='block text-xs text-gray-600 mb-1'>
                          Email
                        </label>
                        <p className='text-sm font-medium text-gray-900'>
                          {editingOrder.email}
                        </p>
                      </div>
                      <div>
                        <label className='block text-xs text-gray-600 mb-1'>
                          Phone
                        </label>
                        <p className='text-sm font-medium text-gray-900'>
                          {editingOrder.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <label className='block text-xs text-gray-600 mb-1'>
                          Total Amount
                        </label>
                        <p className='text-sm font-bold text-gray-900'>
                          ${editingOrder.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className='block text-xs text-gray-600 mb-1'>
                        Shipping Address
                      </label>
                      <p className='text-sm text-gray-900'>
                        {editingOrder.address}, {editingOrder.city},{' '}
                        {editingOrder.state} {editingOrder.zipCode},{' '}
                        {editingOrder.country}
                      </p>
                    </div>

                    <div>
                      <label className='block text-xs text-gray-600 mb-1'>
                        Payment Method
                      </label>
                      <p className='text-sm text-gray-900 capitalize'>
                        {editingOrder.paymentMethod?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Payment Status - Editable */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                      Payment Status *
                    </label>
                    <select
                      value={editingOrder.paymentStatus}
                      onChange={(e) =>
                        handleInputChange('paymentStatus', e.target.value)
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize'
                      disabled={isUpdating}
                    >
                      <option value='pending'>Pending</option>
                      <option value='paid'>Paid</option>
                      <option value='failed'>Failed</option>
                      <option value='refunded'>Refunded</option>
                    </select>
                  </div>

                  {/* Order Items - Editable */}
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='block text-sm font-semibold text-gray-700'>
                        Order Items
                      </label>
                      <div className='text-sm font-semibold text-gray-900'>
                        Total: ${editingOrder.totalAmount?.toFixed(2)}
                      </div>
                    </div>

                    {editingOrder.items && editingOrder.items.length > 0 && (
                      <div className='border border-gray-200 rounded overflow-hidden mb-4'>
                        <table className='w-full text-sm'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th className='px-4 py-2 text-left text-gray-700'>
                                Product
                              </th>
                              <th className='px-4 py-2 text-center text-gray-700'>
                                Qty
                              </th>
                              <th className='px-4 py-2 text-right text-gray-700'>
                                Price
                              </th>
                              <th className='px-4 py-2 text-right text-gray-700'>
                                Subtotal
                              </th>
                              <th className='px-4 py-2 text-center text-gray-700'>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {editingOrder.items.map((item, index) => (
                              <tr
                                key={index}
                                className='border-t border-gray-200'
                              >
                                <td className='px-4 py-2 text-gray-900'>
                                  {item.productName}
                                </td>
                                <td className='px-4 py-2 text-center'>
                                  <input
                                    type='number'
                                    min='1'
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleItemQuantityChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    className='w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    disabled={isUpdating}
                                  />
                                </td>
                                <td className='px-4 py-2 text-right text-gray-900'>
                                  ${item.price?.toFixed(2)}
                                </td>
                                <td className='px-4 py-2 text-right font-medium text-gray-900'>
                                  ${item.subtotal?.toFixed(2)}
                                </td>
                                <td className='px-4 py-2 text-center'>
                                  <button
                                    onClick={() => handleRemoveItem(index)}
                                    className='text-red-600 hover:text-red-800 p-1'
                                    disabled={
                                      isUpdating ||
                                      editingOrder.items.length === 1
                                    }
                                    title='Remove item'
                                  >
                                    <X className='w-4 h-4' />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Add Product */}
                    <div className='flex items-center gap-2'>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddItem(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className='flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        disabled={isUpdating || isLoadingProducts}
                      >
                        <option value=''>
                          {isLoadingProducts
                            ? 'Loading products...'
                            : 'Add product to order...'}
                        </option>
                        {availableProducts
                          .filter(
                            (p) =>
                              !editingOrder.items.some(
                                (item) => item.productId === p._id
                              )
                          )
                          .map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.productName} - $
                              {product.price?.toFixed(2)} (Stock:{' '}
                              {product.quantity})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className='sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3'>
                  <button
                    onClick={handleCancel}
                    className='btn-outline flex-1 px-4 py-2'
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className='btn-success flex-1 flex items-center justify-center gap-2 px-4 py-2'
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className='w-4 h-4' />
                        Save Changes
                      </>
                    )}
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
