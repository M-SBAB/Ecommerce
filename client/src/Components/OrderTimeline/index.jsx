import React from 'react';
import {
  CheckCircle,
  Circle,
  Clock,
  Truck,
  Package,
  XCircle,
} from 'lucide-react';

/**
 * OrderTimeline Component
 * Displays a visual timeline of order status progression
 *
 * @param {Object} props
 * @param {string} props.currentStatus - Current order status
 * @param {string} props.createdAt - Order creation date
 * @param {string} props.updatedAt - Order last update date
 */
const OrderTimeline = ({ currentStatus, createdAt, updatedAt }) => {
  const timelineSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'processing', label: 'Processing', icon: Clock },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  // Handle cancelled status separately
  if (currentStatus === 'cancelled') {
    return (
      <div className='py-4'>
        <div className='flex items-center gap-3 bg-red-50 border border-red-200 rounded p-4'>
          <div className='flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
            <XCircle className='w-6 h-6 text-red-600' />
          </div>
          <div>
            <p className='font-semibold text-red-800'>Order Cancelled</p>
            <p className='text-sm text-red-600'>
              This order has been cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getCurrentStepIndex = () => {
    return timelineSteps.findIndex((step) => step.status === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='py-6'>
      <h4 className='text-sm font-semibold text-gray-700 mb-4'>
        Order Timeline
      </h4>
      <div className='relative'>
        {/* Connection Line */}
        <div className='absolute left-5 top-8 bottom-8 w-0.5 bg-gray-200' />

        <div className='space-y-6'>
          {timelineSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={step.status}
                className='relative flex items-start gap-4'
              >
                {/* Icon Circle */}
                <div
                  className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600'
                      : isCurrent
                      ? 'bg-white border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className='w-5 h-5 text-white' />
                  ) : isCurrent ? (
                    <StepIcon className='w-5 h-5 text-blue-600' />
                  ) : (
                    <Circle className='w-5 h-5 text-gray-400' />
                  )}
                </div>

                {/* Content */}
                <div className='flex-1 pb-2'>
                  <div className='flex items-center justify-between'>
                    <p
                      className={`font-medium ${
                        isCompleted || isCurrent
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className='text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>
                        Current
                      </span>
                    )}
                  </div>
                  {isCompleted && (
                    <p className='text-xs text-gray-500 mt-1'>
                      {index === 0
                        ? formatDate(createdAt)
                        : formatDate(updatedAt)}
                    </p>
                  )}
                  {isPending && (
                    <p className='text-xs text-gray-400 mt-1'>Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
