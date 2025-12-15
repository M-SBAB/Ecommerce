import React, { useState } from 'react';
import { AlertCircle, Check, Package, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
// import { useState } from 'react';

// code for data connection with backend

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const addProduct = async (data) => {
    const res = await fetch('http://localhost:5000/products/add', {
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
      }),
    });
    const response = await res.json();
    console.log(response);
    // console.log({name:data.addProductName,category:data.addProductCategory,
    //     price:data.addProductPrice,quantity:data.addProductQuantity,
    //     description:data.addProductDescription})
    // if(response.addProduct){
    // Navigate("/dashboard")

    // else if(response.ErrorMessage){
    //   alert(response.ErrorMessage)
    // }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          {/* Header */}
          <div className='flex items-center gap-3 mb-6'>
            <div className='bg-indigo-600 p-3 rounded-lg'>
              <Package className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                Add New Product
              </h1>
              <p className='text-sm text-gray-600'>
                Add product details to inventory
              </p>
            </div>
          </div>

          {/* Success Message */}
          {/* {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Product added successfully!</span>
            </div>
          )} */}

          {/* Form */}
          <form onSubmit={handleSubmit(addProduct)}>
            <div className='space-y-5'>
              {/* Product Name */}
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Product Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='name'
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Enter product name'
                  // code for backend
                  {...register('addProductName', { required: true })}
                />
                {/* {errors.name && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </div>
              )} */}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor='category'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Category <span className='text-red-500'>*</span>
                </label>
                <select
                  id='category'
                  name='category'
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
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
                  {/* coding for backend */}
                </select>
                {errors.category && (
                  <div className='mt-2 flex items-center gap-2 text-red-600 text-sm'>
                    <AlertCircle className='w-4 h-4' />
                    <span>{errors.category}</span>
                  </div>
                )}
              </div>

              {/* Price and Quantity Row */}
              <div className='grid grid-cols-2 gap-4'>
                {/* Price */}
                <div>
                  <label
                    htmlFor='price'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Price (Rs:) <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    id='price'
                    name='price'
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='0.00'
                    //code for backend
                    {...register('addProductPrice', { required: true })}
                  />
                  {errors.price && (
                    <div className='mt-2 flex items-center gap-2 text-red-600 text-sm'>
                      <AlertCircle className='w-4 h-4' />
                      <span>{errors.price}</span>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label
                    htmlFor='quantity'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Quantity <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    id='quantity'
                    name='quantity'
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
                      errors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='0'
                    // code for backend
                    {...register('addProductQuantity', { required: true })}
                  />
                  {errors.quantity && (
                    <div className='mt-2 flex items-center gap-2 text-red-600 text-sm'>
                      <AlertCircle className='w-4 h-4' />
                      <span>{errors.quantity}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows='4'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none'
                  placeholder='Enter product description (optional)'
                  // code for backend
                  {...register('addProductDescription', { required: true })}
                />
              </div>

              {/* Product Image */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Product Image
                </label>
              </div>

              {/* Buttons */}
              <div className='flex gap-4 pt-4'>
                <button type='submit' className='btn-primary btn-lg btn-full'>
                  Add product
                </button>
                <button type='button' className='btn-secondary btn-lg btn-full'>
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
