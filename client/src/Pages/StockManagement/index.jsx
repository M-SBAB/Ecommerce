import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

export default function StockUpdate() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  // Watch form fields for real-time updates
  const selectedProductId = watch('ProductId');
  const selectedOperation = watch('Operation');
  const enteredQuantity = watch('UpdateStock');

  // Get selected product details
  const selectedProduct = products?.find((p) => p._id === selectedProductId);

  // Calculate preview quantity
  const calculatePreviewQuantity = () => {
    if (!selectedProduct || !enteredQuantity || !selectedOperation) return null;

    const currentQty = selectedProduct.quantity;
    const changeQty = Number(enteredQuantity) || 0;

    switch (selectedOperation) {
      case 'add':
        return currentQty + changeQty;
      case 'remove':
        return Math.max(0, currentQty - changeQty);
      case 'set':
        return changeQty;
      default:
        return null;
    }
  };

  const previewQuantity = calculatePreviewQuantity();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:6001/products/all', {
        method: 'GET',
      });
      const response = await res.json();
      if (response.products) {
        setProducts(response.products);
      } else if (response.ErrorMessage) {
        alert(response.ErrorMessage);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation dialog
  const handleConfirmation = (data) => {
    const product = products?.find((p) => p._id === data.ProductId);
    if (!product) return;

    setConfirmData({
      ...data,
      productName: product.productName,
      currentStock: product.quantity,
      newStock: calculatePreviewQuantity(),
    });
    setShowConfirmation(true);
  };

  // Perform actual stock update
  const updatestock = async () => {
    if (!confirmData) return;

    try {
      setIsUpdating(true);
      setSuccessMessage('');
      setErrorMessage('');
      setShowConfirmation(false);

      const res = await fetch(
        `http://localhost:6001/products/${confirmData.ProductId}/Update`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stock: confirmData.UpdateStock,
            operation: confirmData.Operation,
            userId: user._id,
          }),
        }
      );
      const response = await res.json();

      if (response.message) {
        setSuccessMessage(response.message);
        reset(); // Clear form
        await getAllProducts(); // Refresh product list with latest quantities
        setConfirmData(null);

        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else if (response.ErrorMessage) {
        setErrorMessage(response.ErrorMessage);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      setErrorMessage('Failed to update stock. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel confirmation
  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmData(null);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='max-w-2xl mx-auto space-y-6'>
          {/* Header */}
          <div>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-10 h-10 bg-gray-900 rounded flex items-center justify-center'>
                <Package className='w-5 h-5 text-white' />
              </div>
              <h1 className='text-3xl font-light text-gray-900'>
                Stock Update
              </h1>
            </div>
            <div className='h-0.5 w-16 bg-gray-900'></div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className='bg-green-50 border border-green-200 rounded p-4 animate-pulse'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <p className='text-green-800 font-medium'>{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className='bg-red-50 border border-red-200 rounded p-4'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
                <p className='text-red-800 font-medium'>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmation && confirmData && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded shadow-xl max-w-md w-full p-6 space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='w-10 h-10 bg-amber-100 rounded flex items-center justify-center flex-shrink-0'>
                    <svg
                      className='w-6 h-6 text-amber-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                      />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Confirm Stock Update
                    </h3>
                    <div className='space-y-3 text-sm'>
                      <p className='text-gray-700'>
                        {confirmData.Operation === 'add' &&
                          `Add ${confirmData.UpdateStock} units to `}
                        {confirmData.Operation === 'remove' &&
                          `Remove ${confirmData.UpdateStock} units from `}
                        {confirmData.Operation === 'set' &&
                          `Set stock to ${confirmData.UpdateStock} units for `}
                        <span className='font-semibold'>
                          {confirmData.productName}
                        </span>
                        ?
                      </p>
                      <div className='bg-gray-50 rounded p-3 space-y-2'>
                        <div className='flex justify-between items-center'>
                          <span className='text-gray-600'>Current Stock:</span>
                          <span className='font-semibold text-gray-900'>
                            {confirmData.currentStock} units
                          </span>
                        </div>
                        <div className='h-px bg-gray-200'></div>
                        <div className='flex justify-between items-center'>
                          <span className='text-gray-600'>New Stock:</span>
                          <span className='font-bold text-green-600 text-lg'>
                            {confirmData.newStock} units
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-xs'>
                          <span className='text-gray-500'>Change:</span>
                          <span
                            className={`font-medium ${
                              confirmData.newStock > confirmData.currentStock
                                ? 'text-green-600'
                                : confirmData.newStock <
                                  confirmData.currentStock
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {confirmData.newStock > confirmData.currentStock
                              ? '+'
                              : ''}
                            {confirmData.newStock - confirmData.currentStock}{' '}
                            units
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex gap-3 pt-2'>
                  <button
                    type='button'
                    onClick={cancelConfirmation}
                    disabled={isUpdating}
                    className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={updatestock}
                    disabled={isUpdating}
                    className='flex-1 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isUpdating ? 'Updating...' : 'Confirm Update'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(handleConfirmation)}>
            <div className='bg-white border border-gray-200 rounded p-6 sm:p-8'>
              {loading ? (
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                </div>
              ) : products && products.length === 0 ? (
                <div className='text-center py-12'>
                  <Package className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600 text-lg'>No products available</p>
                  <p className='text-gray-500 text-sm mt-2'>
                    Please add products first
                  </p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {/* Product Name */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Product Name <span className='text-red-500'>*</span>
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 ${
                        errors.ProductId
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-gray-900'
                      }`}
                      {...register('ProductId', {
                        required: 'Product selection is required',
                      })}
                    >
                      <option value=''>Select a product</option>
                      {products?.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                    {errors.ProductId && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.ProductId.message}
                      </p>
                    )}
                    {selectedProduct && (
                      <div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded'>
                        <p className='text-sm text-blue-900'>
                          <span className='font-semibold'>Current Stock:</span>{' '}
                          <span className='text-lg font-bold'>
                            {selectedProduct.quantity}
                          </span>{' '}
                          units
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Operation Type */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Operation Type <span className='text-red-500'>*</span>
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 ${
                        errors.Operation
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-gray-900'
                      }`}
                      {...register('Operation', {
                        required: 'Operation type is required',
                      })}
                    >
                      <option value=''>Select operation</option>
                      <option value='add'>Add Stock</option>
                      <option value='remove'>Remove Stock</option>
                      <option value='set'>Set Stock</option>
                    </select>
                    {errors.Operation && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.Operation.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Stock Quantity <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      min='0'
                      max='1000000'
                      step='1'
                      className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 ${
                        errors.UpdateStock
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-gray-900'
                      }`}
                      placeholder='Enter quantity (0 - 1,000,000)'
                      {...register('UpdateStock', {
                        required: 'Stock quantity is required',
                        min: {
                          value: 0,
                          message: 'Quantity cannot be negative',
                        },
                        max: {
                          value: 1000000,
                          message: 'Quantity cannot exceed 1,000,000',
                        },
                        validate: {
                          isInteger: (value) =>
                            Number.isInteger(Number(value)) ||
                            'Quantity must be a whole number',
                          isPositive: (value) =>
                            Number(value) >= 0 ||
                            'Quantity must be 0 or greater',
                        },
                      })}
                    />
                    {errors.UpdateStock && (
                      <p className='mt-1 text-sm text-red-600'>
                        {errors.UpdateStock.message}
                      </p>
                    )}
                    {previewQuantity !== null &&
                      selectedProduct &&
                      enteredQuantity &&
                      selectedOperation && (
                        <div className='mt-3 p-4 bg-green-50 border border-green-200 rounded'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <p className='text-sm text-green-900 mb-1'>
                                <span className='font-semibold'>Preview:</span>
                              </p>
                              <p className='text-xs text-green-700'>
                                {selectedOperation === 'add' &&
                                  `Adding ${enteredQuantity} units`}
                                {selectedOperation === 'remove' &&
                                  `Removing ${enteredQuantity} units`}
                                {selectedOperation === 'set' &&
                                  `Setting to ${enteredQuantity} units`}
                              </p>
                            </div>
                            <div className='text-right'>
                              <p className='text-xs text-green-700'>
                                New Stock
                              </p>
                              <p className='text-2xl font-bold text-green-900'>
                                {previewQuantity}
                              </p>
                            </div>
                          </div>
                          {selectedOperation === 'remove' &&
                            previewQuantity === 0 &&
                            selectedProduct.quantity >
                              Number(enteredQuantity) && (
                              <p className='mt-2 text-xs text-amber-600'>
                                ⚠️ Warning: Removing more than available stock.
                                Will set to 0.
                              </p>
                            )}
                        </div>
                      )}
                  </div>

                  {/* Update Button */}
                  <button
                    type='submit'
                    disabled={isUpdating}
                    className={`btn-primary btn-lg btn-full ${
                      isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUpdating ? 'Updating...' : 'Update Stock'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
