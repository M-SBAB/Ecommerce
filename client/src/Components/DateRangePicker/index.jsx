import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';

const DateRangePicker = ({ startDate, endDate, onDateChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Format date for input value (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (e) => {
    onDateChange({ startDate: e.target.value, endDate });
  };

  const handleEndDateChange = (e) => {
    onDateChange({ startDate, endDate: e.target.value });
  };

  const handleClear = () => {
    onClear();
    setIsOpen(false);
  };

  const hasDateRange = startDate || endDate;

  return (
    <div className='relative'>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
          hasDateRange
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Calendar className='w-4 h-4' />
        {hasDateRange ? (
          <span className='text-sm'>
            {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
          </span>
        ) : (
          <span className='text-sm'>Date Range</span>
        )}
      </button>

      {/* Clear Button */}
      {hasDateRange && (
        <button
          onClick={handleClear}
          className='absolute -right-2 -top-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md'
          title='Clear date range'
        >
          <X className='w-3 h-3' />
        </button>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className='absolute top-full left-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[300px]'>
            <h4 className='text-sm font-semibold text-gray-900 mb-3'>
              Select Date Range
            </h4>

            <div className='space-y-3'>
              {/* Start Date */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Start Date
                </label>
                <input
                  type='date'
                  value={formatDateForInput(startDate)}
                  onChange={handleStartDateChange}
                  max={formatDateForInput(endDate || new Date())}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                />
              </div>

              {/* End Date */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  End Date
                </label>
                <input
                  type='date'
                  value={formatDateForInput(endDate)}
                  onChange={handleEndDateChange}
                  min={formatDateForInput(startDate)}
                  max={formatDateForInput(new Date())}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                />
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className='mt-4 pt-3 border-t border-gray-200'>
              <p className='text-xs font-medium text-gray-700 mb-2'>
                Quick Select:
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - 7);
                    onDateChange({
                      startDate: start.toISOString().split('T')[0],
                      endDate: end.toISOString().split('T')[0],
                    });
                  }}
                  className='px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors'
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - 30);
                    onDateChange({
                      startDate: start.toISOString().split('T')[0],
                      endDate: end.toISOString().split('T')[0],
                    });
                  }}
                  className='px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors'
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 3);
                    onDateChange({
                      startDate: start.toISOString().split('T')[0],
                      endDate: end.toISOString().split('T')[0],
                    });
                  }}
                  className='px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors'
                >
                  Last 3 Months
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setMonth(start.getMonth() - 6);
                    onDateChange({
                      startDate: start.toISOString().split('T')[0],
                      endDate: end.toISOString().split('T')[0],
                    });
                  }}
                  className='px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors'
                >
                  Last 6 Months
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='mt-4 flex gap-2'>
              <button
                onClick={handleClear}
                className='flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className='flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors'
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
