import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  growth,
  icon: Icon,
  color = 'primary',
  prefix = '',
  suffix = '',
  onClick,
}) => {
  const isPositiveGrowth = growth >= 0;

  // Color mapping for cards
  const colorClasses = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600',
    success: 'bg-gradient-to-br from-green-500 to-green-600',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600',
    error: 'bg-gradient-to-br from-red-500 to-red-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
  };

  const iconBgClasses = {
    primary: 'bg-blue-400/30',
    success: 'bg-green-400/30',
    warning: 'bg-amber-400/30',
    error: 'bg-red-400/30',
    purple: 'bg-purple-400/30',
    indigo: 'bg-indigo-400/30',
  };

  return (
    <div
      onClick={onClick}
      className={`${
        colorClasses[color]
      } text-white rounded shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        onClick ? 'cursor-pointer active:scale-100' : ''
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-white/80 mb-1'>{title}</p>
          <h3 className='text-3xl font-bold mb-2'>
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </h3>

          {growth !== undefined && (
            <div
              className={`flex items-center text-sm ${
                isPositiveGrowth ? 'text-green-100' : 'text-red-100'
              }`}
            >
              {isPositiveGrowth ? (
                <TrendingUp className='w-4 h-4 mr-1' />
              ) : (
                <TrendingDown className='w-4 h-4 mr-1' />
              )}
              <span className='font-semibold'>
                {isPositiveGrowth ? '+' : ''}
                {growth}%
              </span>
              <span className='ml-1 text-white/80'>vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`${iconBgClasses[color]} p-3 rounded-full`}>
            <Icon className='w-6 h-6 text-white' />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
