import React from 'react'
import { Outlet } from 'react-router-dom'

const MainContent = () => {
  return (
    <div className='flex-1 bg-yellow-200 overflow-scroll h-screen'>
        <Outlet/>
    </div>
  )
}

export default MainContent