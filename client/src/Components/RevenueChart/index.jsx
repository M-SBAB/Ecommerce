import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const RevenueChart = ({ data, title = 'Revenue Trends', type = 'area' }) => {
  // Format data for chart (expecting data with year, month, revenue)
  const formattedData =
    data?.map((item) => ({
      ...item,
      name: `${getMonthName(item.month)} ${item.year}`,
      revenue: item.revenue || 0,
      orders: item.orders || 0,
    })) || [];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
          <p className='text-sm font-semibold text-gray-900 mb-1'>
            {payload[0].payload.name}
          </p>
          <p className='text-sm text-blue-600 font-medium'>
            Revenue: ${payload[0].value.toLocaleString()}
          </p>
          {payload[0].payload.orders && (
            <p className='text-sm text-gray-600'>
              Orders: {payload[0].payload.orders}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-bold text-gray-800 mb-4'>{title}</h3>

      <ResponsiveContainer width='100%' height={300}>
        {type === 'area' ? (
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#0ea5e9' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#0ea5e9' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              dataKey='name'
              stroke='#6b7280'
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <YAxis
              stroke='#6b7280'
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
            <Area
              type='monotone'
              dataKey='revenue'
              stroke='#0ea5e9'
              strokeWidth={2}
              fillOpacity={1}
              fill='url(#colorRevenue)'
              name='Revenue'
            />
          </AreaChart>
        ) : (
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              dataKey='name'
              stroke='#6b7280'
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor='end'
              height={80}
            />
            <YAxis
              stroke='#6b7280'
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
            <Line
              type='monotone'
              dataKey='revenue'
              stroke='#0ea5e9'
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name='Revenue'
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// Helper function to get month name
const getMonthName = (monthNumber) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[monthNumber - 1] || '';
};

export default RevenueChart;
