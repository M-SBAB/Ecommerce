import { Search, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
export default function ProductList() {
  const [products, setProducts] = useState(null);

  const getAllProducts = async () => {
    const res = await fetch('http://localhost:5000/products/all', {
      method: 'GET',
    });
    const response = await res.json({});
    // console.log(response)
    if (response.products) {
      setProducts(response.products);
    } else if (response.ErrorMessage) {
      alert(response.ErrorMessage);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
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
              placeholder='Search by name or SKU...'
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
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                    Product Name
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
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {/* Sample Row 1 */}

                {products?.map((product) => (
                  <tr className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <img
                        src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
                        alt='Product'
                        className='w-12 h-12 rounded-lg object-cover border border-gray-200'
                      />
                    </td>

                    <td>{product._id}</td>
                    <td>{product.productName}</td>
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
  );
}
