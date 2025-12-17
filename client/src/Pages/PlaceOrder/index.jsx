import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, CreditCard, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../Components/Toast';
import OrderConfirmationModal from '../../Components/OrderConfirmationModal';

export default function PlaceOrderForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, isCartEmpty, getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'cash_on_delivery',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Redirect to cart if empty
  useEffect(() => {
    if (isCartEmpty()) {
      setToast({
        message: 'Your cart is empty. Please add items first.',
        type: 'warning',
      });
      setTimeout(() => {
        navigate('/Dashboard/products');
      }, 2000);
    }
  }, [isCartEmpty, navigate]);

  // Pre-populate form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCartEmpty()) {
      setToast({
        message: 'Your cart is empty!',
        type: 'error',
      });
      return;
    }

    if (!user || !user._id) {
      setToast({
        message: 'Please login to place an order',
        type: 'error',
      });
      return;
    }

    // Validate stock availability
    const stockIssues = cartItems.filter(
      (item) => item.stock !== undefined && item.quantity > item.stock
    );
    const outOfStockItems = cartItems.filter(
      (item) => item.stock !== undefined && item.stock === 0
    );

    if (outOfStockItems.length > 0) {
      setToast({
        message: `Some items are out of stock: ${outOfStockItems
          .map((item) => item.productName)
          .join(', ')}`,
        type: 'error',
      });
      return;
    }

    if (stockIssues.length > 0) {
      setToast({
        message: `Insufficient stock for: ${stockIssues
          .map((item) => item.productName)
          .join(', ')}`,
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order items from cart
      const orderItems = cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      // Prepare order data
      const orderData = {
        userId: user._id,
        customerName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        items: orderItems,
        paymentMethod: formData.paymentMethod,
      };

      // Call backend API
      const response = await fetch('http://localhost:6001/orders/placeOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.order) {
        // Success - clear cart and show confirmation modal
        clearCart();
        setConfirmedOrder(result.order);
        setShowConfirmation(true);
      } else {
        // Error from backend
        setToast({
          message: result.ErrorMessage || 'Failed to place order',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setToast({
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOrders = () => {
    setShowConfirmation(false);
    navigate('/Dashboard/MyOrder');
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate('/Dashboard/products');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showConfirmation}
        order={confirmedOrder}
        onClose={handleCloseConfirmation}
        onViewOrders={handleViewOrders}
      />

      {/* Toast Notification */}
      {toast && (
        <div className='fixed top-4 right-4 z-50 min-w-[300px]'>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
        <div className='max-w-4xl mx-auto space-y-6'>
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6'>
              <div className='flex items-center gap-3'>
                <ShoppingCart className='w-8 h-8 text-white' />
                <h1 className='text-3xl font-bold text-white'>
                  Place Your Order
                </h1>
              </div>
              <p className='text-blue-100 mt-2'>
                Fill in the details below to complete your purchase
              </p>
            </div>

            <form onSubmit={handleSubmit} className='p-6 sm:p-8 space-y-8'>
              {/* Personal Information */}
              <div>
                <div className='flex items-center gap-2 mb-4'>
                  <User className='w-5 h-5 text-blue-600' />
                  <h2 className='text-xl font-semibold text-gray-800'>
                    Personal Information
                  </h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Full Name *
                    </label>
                    <input
                      type='text'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email Address *
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <div className='flex items-center gap-2 mb-4'>
                  <MapPin className='w-5 h-5 text-blue-600' />
                  <h2 className='text-xl font-semibold text-gray-800'>
                    Shipping Address
                  </h2>
                </div>
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Street Address *
                    </label>
                    <input
                      type='text'
                      name='address'
                      value={formData.address}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        City *
                      </label>
                      <input
                        type='text'
                        name='city'
                        value={formData.city}
                        onChange={handleChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        State/Province *
                      </label>
                      <input
                        type='text'
                        name='state'
                        value={formData.state}
                        onChange={handleChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        ZIP Code *
                      </label>
                      <input
                        type='text'
                        name='zipCode'
                        value={formData.zipCode}
                        onChange={handleChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Country *
                    </label>
                    <input
                      type='text'
                      name='country'
                      value={formData.country}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className='flex items-center gap-2 mb-4'>
                  <Package className='w-5 h-5 text-blue-600' />
                  <h2 className='text-xl font-semibold text-gray-800'>
                    Order Summary
                  </h2>
                </div>
                <div className='bg-gray-50 rounded p-4 space-y-3'>
                  <div className='space-y-2'>
                    {cartItems.map((item) => {
                      const hasStockIssue =
                        item.stock !== undefined && item.quantity > item.stock;
                      const isOutOfStock =
                        item.stock !== undefined && item.stock === 0;
                      return (
                        <div key={item._id} className='space-y-1'>
                          <div className='flex justify-between items-center text-sm'>
                            <span
                              className={`text-gray-700 ${
                                hasStockIssue || isOutOfStock
                                  ? 'text-red-600 font-semibold'
                                  : ''
                              }`}
                            >
                              {item.productName} × {item.quantity}
                              {hasStockIssue && ' ⚠️'}
                              {isOutOfStock && ' ❌'}
                            </span>
                            <span className='font-semibold text-gray-900'>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {(hasStockIssue || isOutOfStock) && (
                            <p className='text-xs text-red-600'>
                              {isOutOfStock
                                ? 'Out of stock'
                                : `Only ${item.stock} available`}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className='border-t border-gray-200 pt-3 space-y-2'>
                    <div className='flex justify-between text-sm text-gray-600'>
                      <span>Subtotal</span>
                      <span>${getCartTotal().subtotal}</span>
                    </div>
                    <div className='flex justify-between text-sm text-gray-600'>
                      <span>Tax (10%)</span>
                      <span>${getCartTotal().tax}</span>
                    </div>
                    <div className='flex justify-between text-sm text-gray-600'>
                      <span>Shipping</span>
                      <span>${getCartTotal().shipping}</span>
                    </div>
                    <div className='flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200'>
                      <span>Total</span>
                      <span className='text-blue-600'>
                        ${getCartTotal().total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <div className='flex items-center gap-2 mb-4'>
                  <CreditCard className='w-5 h-5 text-blue-600' />
                  <h2 className='text-xl font-semibold text-gray-800'>
                    Payment Information
                  </h2>
                </div>
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Payment Method *
                  </label>
                  <select
                    name='paymentMethod'
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                    required
                  >
                    <option value='cash_on_delivery'>Cash on Delivery</option>
                    <option value='credit_card'>Credit Card</option>
                    <option value='debit_card'>Debit Card</option>
                    <option value='online'>Online Payment</option>
                  </select>
                </div>

                {(formData.paymentMethod === 'credit_card' ||
                  formData.paymentMethod === 'debit_card') && (
                  <div className='grid grid-cols-1 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Card Number *
                      </label>
                      <input
                        type='text'
                        name='cardNumber'
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder='1234 5678 9012 3456'
                        className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Expiry Date *
                        </label>
                        <input
                          type='text'
                          name='expiryDate'
                          value={formData.expiryDate}
                          onChange={handleChange}
                          placeholder='MM/YY'
                          className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          CVV *
                        </label>
                        <input
                          type='text'
                          name='cvv'
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder='123'
                          className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Additional Notes (Optional)
                </label>
                <textarea
                  name='notes'
                  value={formData.notes}
                  onChange={handleChange}
                  rows='4'
                  className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none'
                  placeholder='Any special instructions or comments...'
                />
              </div>

              {/* Submit Button */}
              <div className='flex gap-4'>
                <button
                  type='submit'
                  disabled={isSubmitting || isCartEmpty()}
                  className='btn-primary btn-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2'
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
                <button
                  type='button'
                  onClick={() => navigate('/Dashboard/AddToCart')}
                  className='btn-outline btn-lg px-4 py-2'
                  disabled={isSubmitting}
                >
                  Back to Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
