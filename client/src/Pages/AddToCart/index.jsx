import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 79.99,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    },
    {
      id: 3,
      name: 'Laptop Stand',
      price: 45.0,
      quantity: 2,
      image:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <ShoppingCart className='w-8 h-8 text-blue-600' />
            <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className='btn-danger flex items-center gap-2'
            >
              <X className='w-4 h-4' />
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
            <ShoppingCart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              Your cart is empty
            </h2>
            <p className='text-gray-500'>Add some products to get started!</p>
          </div>
        ) : (
          <div className='grid lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-4'>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className='bg-white rounded-lg shadow-sm p-6 flex gap-6 hover:shadow-md transition'
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-24 h-24 object-cover rounded-lg'
                  />

                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                      {item.name}
                    </h3>
                    <p className='text-xl font-bold text-blue-600 mb-4'>
                      ${item.price.toFixed(2)}
                    </p>

                    <div className='flex items-center gap-3'>
                      <div className='flex items-center border border-gray-300 rounded-lg'>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className='p-2 hover:bg-gray-100 rounded-l-lg transition'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <span className='px-4 py-2 font-semibold min-w-[3rem] text-center'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className='p-2 hover:bg-gray-100 rounded-r-lg transition'
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                      >
                        <Trash2 className='w-5 h-5' />
                      </button>
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
              <div className='bg-white rounded-lg shadow-sm p-6 sticky top-8'>
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
                      <span className='text-blue-600'>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className='btn-primary btn-lg btn-full mb-3'>
                  Proceed to Checkout
                </button>

                <button className='btn-outline btn-lg btn-full'>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
