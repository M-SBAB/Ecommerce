import { Search, Package, Edit, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProductList() {
  const [products, setProducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
  });
  const { user } = useAuth();

  const getAllProducts = async () => {
    try {
      let url = 'http://localhost:5000/products/all';
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      }
      const res = await fetch(url, {
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
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getAllProducts();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );
      const response = await res.json();
      if (response.message) {
        alert(response.message);
        getAllProducts(); // Refresh the list
      } else if (response.ErrorMessage) {
        alert(response.ErrorMessage);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/products/${editingProduct._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userId: user._id,
          }),
        }
      );
      const response = await res.json();
      if (response.message) {
        alert(response.message);
        setShowEditModal(false);
        setEditingProduct(null);
        getAllProducts(); // Refresh the list
      } else if (response.ErrorMessage) {
        alert(response.ErrorMessage);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <Package className='w-8 h-8 text-blue-600' />
              <h1 className='text-3xl font-bold text-gray-900'>Products</h1>
            </div>
            <p className='text-gray-600'>Manage your product inventory</p>
          </div>

          {/* Search Bar */}
          <div className='mb-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search by product name...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
              />
            </div>
          </div>

          {/* Product Table */}
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            {/* Mobile scroll hint */}
            <div className='lg:hidden bg-blue-50 border-b border-blue-100 px-4 py-2 text-sm text-blue-600 flex items-center gap-2'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 5l7 7-7 7M5 5l7 7-7 7'
                />
              </svg>
              Scroll horizontally to see all columns
            </div>
            <div className='overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
              <table className='w-full min-w-[800px]'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                      Image
                    </Product Name
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                      Category
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                      Price
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                      Stock
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                      Action
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {/* Sample Row 1 */}
key={product._id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <img
                          src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
                          alt='Product'
                          className='w-12 h-12 rounded-lg object-cover border border-gray-200'
                        />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {product.productName}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize'>
                          {product.category}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ${product.price}
                      </td>

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Modal Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Edit Product
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateProduct} className='p-6 space-y-4'>
              {/* Product Name */}
              <div>
                <label
                  htmlFor='productName'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Product Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='productName'
                  name='productName'
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                />
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
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                >
                  <option value=''>Select a category</option>
                  <option value='electronics'>Electronics</option>
                  <option value='clothing'>Clothing</option>
                  <option value='food'>Food & Beverages</option>
                  <option value='books'>Books</option>
                  <option value='home'>Home & Garden</option>
                  <option value='sports'>Sports</option>
                </select>
              </div>

              {/* Price and Quantity Row */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='price'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Price <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    id='price'
                    name='price'
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min='0'
                    step='0.01'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>

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
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min='0'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows='4'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none'
                />
              </div>

              {/* Modal Footer */}
              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {product.quantity}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {product.quantity > 0 ? (
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800'>
                            In Stock
                          </span>
                        ) : (
                          <span className='px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800'>
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleEditClick(product)}
                            className='text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors'
                            title='Edit product'
                          >
                            <Edit className='w-5 h-5' />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className='text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors'
                            title='Delete product'
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>
                        </div>
                      me}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
