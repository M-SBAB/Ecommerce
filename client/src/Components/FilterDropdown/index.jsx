import React, { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  onClear,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onClear();
  };

  const selectedOption = options.find((opt) => opt.value === value);
  const hasSelection = value !== null && value !== undefined && value !== '';

  return (
    <div className='relative'>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors min-w-[160px] ${
          hasSelection
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {Icon && <Icon className='w-4 h-4' />}
        <span className='text-sm flex-1 text-left'>
          {selectedOption?.label || label}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Clear Button */}
      {hasSelection && (
        <button
          onClick={handleClear}
          className='absolute -right-2 -top-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md z-10'
          title='Clear filter'
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

          {/* Options List */}
          <div className='absolute top-full left-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden min-w-full'>
            <div className='max-h-64 overflow-y-auto'>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      {option.icon && <option.icon className='w-4 h-4' />}
                      <span>{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check className='w-4 h-4 text-blue-600 flex-shrink-0' />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;
