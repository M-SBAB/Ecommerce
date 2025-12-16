import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 * Displays temporary alert messages for user feedback
 *
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} props.duration - Duration in ms before auto-dismiss (default: 3000)
 * @param {function} props.onClose - Callback when toast is dismissed
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className='w-5 h-5 text-green-600' />,
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <XCircle className='w-5 h-5 text-red-600' />,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: <AlertCircle className='w-5 h-5 text-yellow-600' />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <Info className='w-5 h-5 text-blue-600' />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg p-4 flex items-center justify-between shadow-lg animate-in slide-in-from-top-5 duration-300`}
    >
      <div className='flex items-center gap-3'>
        {styles.icon}
        <span className={`${styles.text} font-medium`}>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${styles.text} hover:opacity-70 transition-opacity`}
        >
          <X className='w-5 h-5' />
        </button>
      )}
    </div>
  );
};

export default Toast;
