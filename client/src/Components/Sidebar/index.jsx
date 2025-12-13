import React from 'react'

const Sidebar = () => {
  return (
    <div className='h-screen w-[300px] bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl'>
        <h1 className='text-2xl text-center text-white font-bold py-8 px-4 border-b border-slate-700'> 
          Inventory Management
        </h1>

        <ul className='px-4 mt-6 space-y-2'>
            <li>
              <a href="" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>📊</span>
                Dashboard
              </a>
            </li>
            <li>
              <a href="AddProducts" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>➕</span>
                Add Products
              </a>
            </li>
            <li>
              <a href="list" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>📋</span>
                List Products
              </a>
            </li>
            <li>
              <a href="ViewOrder" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>👁️</span>
                View Order
              </a>
            </li>
            <li>
              <a href="ManageOrder" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>⚙️</span>
                Manage Order
              </a>
            </li>
            <li>
              <a href="StockManagement" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>📦</span>
                Stock Management
              </a>
            </li>
            <li>
              <a href="PlaceOrder" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>🛒</span>
                Place Order
              </a>
            </li>
            <li>
              <a href="SearchProduct" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>🔍</span>
                Search Product
              </a>
            </li>
            <li>
              <a href="AddToCart" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>🛍️</span>
                Add To Cart
              </a>
            </li>
            <li>
              <a href="MyOrder" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>📝</span>
                My Order
              </a>
            </li>
            <li>
              <a href="Auth" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>🔐</span>
                Auth
              </a>
            </li>
            <li>
              <a href="FrontPage" className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200 ease-in-out'>
                <span className='mr-3'>🏠</span>
                Front Page
              </a>
            </li>
        </ul>
    </div>
  )
}

export default Sidebar