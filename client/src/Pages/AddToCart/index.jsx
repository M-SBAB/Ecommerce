import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ShoppingCartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity: updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();

  // Check if any items have stock issues
  const hasStockIssues = cartItems.some(
    (item) => item.stock !== undefined && item.quantity > item.stock
  );

  // Check if any items are out of stock
  const hasOutOfStock = cartItems.some(
    (item) => item.stock !== undefined && item.stock === 0
  );

  const updateQuantity = (productId, change) => {
    const item = cartItems.find((item) => item._id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateCartQuantity(productId, newQuantity);
      }
    }
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/Dashboard/PlaceOrder');
  };

  const handleContinueShopping = () => {
    navigate('/Dashboard/products');
  };

  // Get cart totals from CartContext
  const totals = getCartTotal(0.1, 50);
  const subtotal = parseFloat(totals.subtotal);
  const tax = parseFloat(totals.tax);
  const shipping = parseFloat(totals.shipping);
  const total = parseFloat(totals.total);

  // Helper function to get product image
  const getProductImage = (category) => {
    const images = {
      electronics:
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop',
      clothing:
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop',
      food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
      books:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop',
      home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop',
      sports:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop',
    };
    return (
      images[category] ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
    );
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <ShoppingCart className='w-8 h-8 text-blue-600' />
              <h1 className='text-3xl font-bold text-gray-900'>
                Shopping Cart
              </h1>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className='btn-danger flex items-center gap-2 px-4 py-2'
              >
                <X className='w-4 h-4' />
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className='bg-white rounded shadow-sm p-12 text-center'>
              <ShoppingCart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                Your cart is empty
              </h2>
              <p className='text-gray-500 mb-6'>
                Add some products to get started!
              </p>
              <button
                onClick={handleContinueShopping}
                className='btn-primary btn-lg px-4 py-2'
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className='grid lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2 space-y-4'>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className='bg-white rounded shadow-sm p-6 flex gap-6 hover:shadow-md transition'
                  >
                    <img
                      src={item.image || getProductImage(item.category)}
                      alt={item.productName}
                      className='w-24 h-24 object-cover rounded'
                    />

                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                        {item.productName}
                      </h3>
                      {item.category && (
                        <span className='inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full mb-2 capitalize'>
                          {item.category}
                        </span>
                      )}
                      <p className='text-xl font-bold text-blue-600 mb-4'>
                        ${item.price.toFixed(2)}
                      </p>

                      <div className='space-y-2'>
                        <div className='flex items-center gap-3'>
                          <div className='flex items-center border border-gray-300 rounded'>
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              disabled={item.quantity <= 1}
                              className='p-2 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              <Minus className='w-4 h-4' />
                            </button>
                            <span className='px-4 py-2 font-semibold min-w-[3rem] text-center'>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              disabled={
                                item.stock && item.quantity >= item.stock
                              }
                              className='p-2 hover:bg-gray-100 rounded-r-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                              <Plus className='w-4 h-4' />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded transition'
                            title='Remove from cart'
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>

                          {item.stock !== undefined && (
                            <span
                              className={`text-sm ${
                                item.stock === 0
                                  ? 'text-red-600 font-semibold'
                                  : item.stock < 5
                                  ? 'text-orange-600 font-semibold'
                                  : 'text-gray-500'
                              }`}
                            >
                              {item.stock === 0
                                ? 'Out of stock'
                                : `${item.stock} available`}
                            </span>
                          )}
                        </div>
                        {/* Stock Warning */}
                        {item.stock !== undefined && item.stock === 0 && (
                          <div className='bg-red-50 border border-red-200 rounded p-2 flex items-start gap-2'>
                            <span className='text-red-600 text-xs font-medium'>
                              ⚠️ This item is out of stock. Please remove it to
                              proceed with checkout.
                            </span>
                          </div>
                        )}
                        {item.stock !== undefined &&
                          item.stock > 0 &&
                          item.quantity > item.stock && (
                            <div className='bg-orange-50 border border-orange-200 rounded p-2 flex items-start gap-2'>
                              <span className='text-orange-600 text-xs font-medium'>
                                ⚠️ Requested quantity exceeds available stock.
                                Adjust to {item.stock} or less.
                              </span>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className='text-right'>
                      <p className='text-sm text-gray-500 mb-1'>Subtotal</p>
                      <p className='text-xl font-bold text-gray-900'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='lg:col-span-1'>
                <div className='bg-white rounded shadow-sm p-6 sticky top-8'>
                  <h2 className='text-xl font-bold text-gray-900 mb-6'>
                    Order Summary
                  </h2>

                  <div className='space-y-3 mb-6'>
                    <div className='flex justify-between text-gray-600'>
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className='font-semibold'>
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                      <span>Shipping</span>
                      <span className='font-semibold'>
                        ${shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                      <span>Tax (10%)</span>
                      <span className='font-semibold'>${tax.toFixed(2)}</span>
                    </div>
                    <div className='border-t pt-3 mt-3'>
                      <div className='flex justify-between text-lg font-bold text-gray-900'>
                        <span>Total</span>
                        <span className='text-blue-600'>
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Issues Warning */}
                  {(hasStockIssues || hasOutOfStock) && (
                    <div className='mb-4 bg-red-50 border border-red-200 rounded p-3'>
                      <p className='text-sm font-semibold text-red-700 mb-1'>
                        ⚠️ Cannot proceed to checkout
                      </p>
                      <p className='text-xs text-red-600'>
                        {hasOutOfStock
                          ? 'Remove out-of-stock items from your cart.'
                          : 'Adjust quantities to match available stock.'}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={hasStockIssues || hasOutOfStock}
                    className='btn-primary btn-lg btn-full mb-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 px-4 py-2'
                  >
                    {hasStockIssues || hasOutOfStock
                      ? 'Fix Stock Issues'
                      : 'Proceed to Checkout'}
                  </button>

                  <button
                    onClick={handleContinueShopping}
                    className='btn-outline btn-lg btn-full px-4 py-2'
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
