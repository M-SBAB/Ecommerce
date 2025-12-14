// Theme Configuration and Utility Functions
export const theme = {
  colors: {
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0369a1',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#d946ef',
      light: '#e879f9',
      dark: '#a21caf',
      contrast: '#ffffff',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#15803d',
      contrast: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#b45309',
      contrast: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#b91c1c',
      contrast: '#ffffff',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cardHover: '0 4px 16px rgba(0, 0, 0, 0.12)',
  },
  transitions: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
  },
};

// Common Component Styles (for use with className)
export const componentStyles = {
  // Button variants
  buttons: {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  },

  // Card variants
  cards: {
    base: 'card',
    product: 'card-product',
    elevated: 'card shadow-xl',
    flat: 'bg-white rounded-xl p-6',
  },

  // Input variants
  inputs: {
    base: 'input-base',
    error: 'input-error',
    large: 'input-base text-lg py-3',
    small: 'input-base text-sm py-1.5',
  },

  // Badge variants
  badges: {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    gray: 'badge-gray',
  },

  // Layout
  layout: {
    container: 'container-custom',
    section: 'py-12 md:py-16 lg:py-20',
    grid: {
      cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
      cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      cols4:
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    },
  },

  // Typography
  typography: {
    h1: 'text-4xl md:text-5xl font-bold text-gray-900',
    h2: 'text-3xl md:text-4xl font-bold text-gray-900',
    h3: 'text-2xl md:text-3xl font-semibold text-gray-900',
    h4: 'text-xl md:text-2xl font-semibold text-gray-900',
    h5: 'text-lg md:text-xl font-semibold text-gray-900',
    body: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500',
  },

  // Common patterns
  patterns: {
    hoverEffect:
      'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    loading: 'opacity-50 pointer-events-none animate-pulse',
  },
};

// Utility function to combine class names
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Status colors mapping
export const statusColors = {
  active: 'text-success-600 bg-success-50',
  inactive: 'text-gray-600 bg-gray-50',
  pending: 'text-warning-600 bg-warning-50',
  completed: 'text-success-600 bg-success-50',
  cancelled: 'text-error-600 bg-error-50',
  processing: 'text-primary-600 bg-primary-50',
};

// Order status colors
export const orderStatusColors = {
  pending: {
    bg: 'bg-warning-100',
    text: 'text-warning-800',
    border: 'border-warning-300',
  },
  confirmed: {
    bg: 'bg-primary-100',
    text: 'text-primary-800',
    border: 'border-primary-300',
  },
  processing: {
    bg: 'bg-primary-100',
    text: 'text-primary-800',
    border: 'border-primary-300',
  },
  shipped: {
    bg: 'bg-secondary-100',
    text: 'text-secondary-800',
    border: 'border-secondary-300',
  },
  delivered: {
    bg: 'bg-success-100',
    text: 'text-success-800',
    border: 'border-success-300',
  },
  cancelled: {
    bg: 'bg-error-100',
    text: 'text-error-800',
    border: 'border-error-300',
  },
};

// Product availability colors
export const availabilityColors = {
  'in-stock': { bg: 'bg-success-100', text: 'text-success-800' },
  'low-stock': { bg: 'bg-warning-100', text: 'text-warning-800' },
  'out-of-stock': { bg: 'bg-error-100', text: 'text-error-800' },
};

// Export default theme object
export default theme;
