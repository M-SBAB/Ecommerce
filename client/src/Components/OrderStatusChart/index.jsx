import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const OrderStatusChart = ({
  data,
  type = 'pie',
  title = 'Order Status Distribution',
}) => {
  // Status colors mapping
  const STATUS_COLORS = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#22c55e',
    cancelled: '#ef4444',
  };

  // Format data for charts
  const formattedData =
    data?.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
      status: item._id,
      color: STATUS_COLORS[item._id] || '#6b7280',
    })) || [];

  // Custom label for pie chart
  const renderCustomLabel = ({ name, percent }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 rounded shadow-lg border border-gray-200'>
          <p className='text-sm font-semibold text-gray-900 mb-1'>
            {payload[0].name}
          </p>
          <p className='text-sm' style={{ color: payload[0].payload.color }}>
            Orders: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Empty state check
  if (!data || data.length === 0 || formattedData.length === 0) {
    return (
      <div className='bg-white rounded shadow-md p-6'>
        <h3 className='text-xl font-bold text-gray-800 mb-4'>{title}</h3>
        <div className='flex flex-col items-center justify-center h-64 text-gray-400'>
          <svg
            className='w-16 h-16 mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
          <p className='text-lg font-medium'>No order data available</p>
          <p className='text-sm mt-2'>Orders will appear here once placed</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded shadow-md p-6'>
      <h3 className='text-xl font-bold text-gray-800 mb-4'>{title}</h3>

      <ResponsiveContainer width='100%' height={300}>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={formattedData}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : (
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey='name' stroke='#6b7280' tick={{ fontSize: 12 }} />
            <YAxis stroke='#6b7280' tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey='value' name='Orders' radius={[8, 8, 0, 0]}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Legend for pie chart */}
      {type === 'pie' && (
        <div className='mt-4 flex flex-wrap justify-center gap-4'>
          {formattedData.map((entry, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-sm text-gray-700'>
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatusChart;
