import React from 'react'
import Sidebar from '../../Components/Sidebar'
import MainContent from '../../Components/MainContent'

const Dashboard = () => {
  return (
    <div className='flex'>
      <Sidebar/>
      <MainContent/>
    </div>
  )
}

export default Dashboard