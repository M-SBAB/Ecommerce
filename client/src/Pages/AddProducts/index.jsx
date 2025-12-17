import React, { useState } from 'react';
import { AlertCircle, Check, Package, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  const addProduct = async (data) => {
    try {
      const res = await fetch('http://localhost:6001/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: data.addProductName,
          category: data.addProductCategory,
          price: data.addProductPrice,
          quantity: data.addProductQuantity,
          description: data.addProductDescription,
          userId: user._id,
        }),
      });
      const response = await res.json();
      if (response.message) {
        alert(response.message);
        // Navigate to list products page after successful addition
        navigate('/Dashboard/list');
        reset(); // Clear the form on success
      } else if (response.ErrorMessage) {
        alert(response.ErrorMessage);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className='min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='h-full'>
        {/* Page Header */}
        <div className='mb-6'>
          <div className='flex items-center gap-4 mb-3'>
            <div className='bg-gradient-to-br from-primary-600 to-primary-700 p-4 rounded-xl shadow-lg'>
              <Package className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-tight'>
                Add New Product
              </h1>
              <p className='text-base text-gray-600 mt-1'>
                Fill in the product details to add to your inventory
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden h-full'>
          <div className='p-6 sm:p-8 md:p-10 lg:p-12'>
            <form onSubmit={handleSubmit(addProduct)} className='space-y-7'>
              {/* Product Name */}
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-bold text-gray-900 mb-3 tracking-wide'
                >
                  Product Name <span className='text-error-500'>*</span>
                </label>
                <input
                  type='text'
                  name='name'
                  className={`w-full px-6 py-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                    errors.name
                      ? 'border-error-500 bg-error-50'
                      : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  placeholder='Enter product name'
                  {...register('addProductName', { required: true })}
                />
                {errors.addProductName && (
                  <div className='mt-2 flex items-center gap-2 text-error-600 text-sm'>
                    <AlertCircle className='w-4 h-4' />
                    <span>Product name is required</span>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor='category'
                  className='block text-sm font-bold text-gray-900 mb-3 tracking-wide'
                >
                  Category <span className='text-error-500'>*</span>
                </label>
                <select
                  id='category'
                  name='category'
                  className={`w-full px-6 py-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                    errors.category
                      ? 'border-error-500 bg-error-50'
                      : 'border-gray-300 bg-gray-50 focus:bg-white'
                  }`}
                  {...register('addProductCategory', { required: true })}
                >
                  <option value=''>Select a category</option>
                  <option value='electronics'>Electronics</option>
                  <option value='clothing'>Clothing</option>
                  <option value='food'>Food & Beverages</option>
                  <option value='books'>Books</option>
                  <option value='home'>Home & Garden</option>
                  <option value='sports'>Sports</option>
                </select>
                {errors.addProductCategory && (
                  <div className='mt-2 flex items-center gap-2 text-error-600 text-sm'>
                    <AlertCircle className='w-4 h-4' />
                    <span>Please select a category</span>
                  </div>
                )}
              </div>

              {/* Price and Quantity Row */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
                {/* Price */}
                <div>
                  <label
                    htmlFor='price'
                    className='block text-sm font-bold text-gray-900 mb-3 tracking-wide'
                  >
                    Price (Rs:) <span className='text-error-500'>*</span>
                  </label>
                  <input
                    type='number'
                    id='price'
                    name='price'
                    step='0.01'
                    className={`w-full px-6 py-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      errors.price
                        ? 'border-error-500 bg-error-50'
                        : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder='0.00'
                    {...register('addProductPrice', { required: true, min: 0 })}
                  />
                  {errors.addProductPrice && (
                    <div className='mt-2 flex items-center gap-2 text-error-600 text-sm'>
                      <AlertCircle className='w-4 h-4' />
                      <span>Valid price is required</span>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label
                    htmlFor='quantity'
                    className='block text-sm font-bold text-gray-900 mb-3 tracking-wide'
                  >
                    Quantity <span className='text-error-500'>*</span>
                  </label>
                  <input
                    type='number'
                    id='quantity'
                    name='quantity'
                    className={`w-full px-6 py-4 text-base border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 ${
                      errors.quantity
                        ? 'border-error-500 bg-error-50'
                        : 'border-gray-300 bg-gray-50 focus:bg-white'
                    }`}
                    placeholder='0'
                    {...register('addProductQuantity', {
                      required: true,
                      min: 1,
                    })}
                  />
                  {errors.addProductQuantity && (
                    <div className='mt-2 flex items-center gap-2 text-error-600 text-sm'>
                      <AlertCircle className='w-4 h-4' />
                      <span>Valid quantity is required</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-bold text-gray-900 mb-3 tracking-wide'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows='6'
                  className='w-full px-6 py-4 text-base border-2 border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white outline-none transition-all duration-200 resize-none'
                  placeholder='Enter product description (optional)'
                  {...register('addProductDescription')}
                />
                <p className='mt-2 text-sm text-gray-500'>
                  Provide a detailed description of the product
                </p>
              </div>

              {/* Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t-2 border-gray-200'>
                <button
                  type='submit'
                  className='btn-primary btn-xl flex-1 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl px-4 py-2'
                >
                  <Package className='w-5 h-5' />
                  Add Product
                </button>
                <button
                  type='button'
                  onClick={() => reset()}
                  className='btn-outline btn-xl flex-1 flex items-center justify-center gap-3 hover:shadow-md px-4 py-2'
                >
                  <X className='w-5 h-5' />
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Help Text - Moved inside form container */}
          <div className='px-6 sm:px-8 md:px-10 lg:px-12 pb-6 bg-gray-50 border-t border-gray-200'>
            <p className='text-sm text-gray-600 text-center py-4'>
              All fields marked with{' '}
              <span className='text-error-500 font-bold'>*</span> are required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
