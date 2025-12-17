import React from 'react';

// Utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Order status colors mapping
const orderStatusColors = {
  pending: {
    bg: 'bg-warning-100',
    text: 'text-warning-800',
  },
  confirmed: {
    bg: 'bg-primary-100',
    text: 'text-primary-800',
  },
  processing: {
    bg: 'bg-primary-100',
    text: 'text-primary-800',
  },
  shipped: {
    bg: 'bg-secondary-100',
    text: 'text-secondary-800',
  },
  delivered: {
    bg: 'bg-success-100',
    text: 'text-success-800',
  },
  cancelled: {
    bg: 'bg-error-100',
    text: 'text-error-800',
  },
};

// Example component showcasing theme usage
const ThemeShowcase = () => {
  return (
    <div className='container-custom py-12'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
          Theme Showcase
        </h1>
        <p className='text-lg text-gray-600'>
          Preview of all available theme components and styles
        </p>
      </div>

      {/* Colors Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Color Palette</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          <ColorSwatch label='Primary' color='bg-primary-500' />
          <ColorSwatch label='Secondary' color='bg-secondary-500' />
          <ColorSwatch label='Success' color='bg-success-500' />
          <ColorSwatch label='Warning' color='bg-warning-500' />
          <ColorSwatch label='Error' color='bg-error-500' />
        </div>
      </section>

      {/* Buttons Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Buttons</h2>
        <div className='flex flex-wrap gap-4'>
          <button className='btn-primary px-4 py-2'>Primary Button</button>
          <button className='btn-secondary px-4 py-2'>Secondary Button</button>
          <button className='btn-success px-4 py-2'>Success Button</button>
          <button className='btn-danger px-4 py-2'>Danger Button</button>
          <button className='btn-outline px-4 py-2'>Outline Button</button>
          <button className='btn-ghost px-4 py-2'>Ghost Button</button>
          <button className='btn-primary px-4 py-2' disabled>
            Disabled
          </button>
        </div>
      </section>

      {/* Cards Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Cards</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Basic Card */}
          <div className='card p-6'>
            <h3 className='text-xl font-semibold mb-2'>Basic Card</h3>
            <p className='text-gray-600'>
              A simple card with shadow and padding.
            </p>
          </div>

          {/* Product Card */}
          <div className='card-product hover-lift p-6'>
            <div className='w-full h-48 bg-gradient-to-br from-primary-200 to-primary-400 rounded mb-4'></div>
            <h3 className='text-xl font-semibold mb-2'>Product Card</h3>
            <p className='text-gray-600 mb-4'>Product description goes here</p>
            <div className='flex items-center justify-between'>
              <span className='price'>$99.99</span>
              <span className='badge-success px-2.5 py-0.5'>In Stock</span>
            </div>
          </div>

          {/* Elevated Card */}
          <div className='card shadow-xl p-6'>
            <h3 className='text-xl font-semibold mb-2'>Elevated Card</h3>
            <p className='text-gray-600'>
              A card with extra elevation and shadow.
            </p>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Badges</h2>
        <div className='flex flex-wrap gap-3'>
          <span className='badge-primary px-2.5 py-0.5'>Primary</span>
          <span className='badge-success px-2.5 py-0.5'>Success</span>
          <span className='badge-warning px-2.5 py-0.5'>Warning</span>
          <span className='badge-error px-2.5 py-0.5'>Error</span>
          <span className='badge-gray px-2.5 py-0.5'>Gray</span>
        </div>
      </section>

      {/* Order Status Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Order Status</h2>
        <div className='flex flex-wrap gap-3'>
          {Object.keys(orderStatusColors).map((status) => (
            <span
              key={status}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                orderStatusColors[status].bg,
                orderStatusColors[status].text
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          ))}
        </div>
      </section>

      {/* Form Elements Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Form Elements</h2>
        <div className='max-w-md space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <input
              type='email'
              className='input-base px-4 py-2.5'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Error State
            </label>
            <input
              type='text'
              className='input-error px-4 py-2.5'
              placeholder='This field has an error'
            />
            <p className='text-sm text-error-600 mt-1'>
              Please enter a valid value
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Option
            </label>
            <select className='input-base px-4 py-2.5'>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Textarea
            </label>
            <textarea
              className='input-base px-4 py-2.5'
              rows='4'
              placeholder='Enter your message'
            ></textarea>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Typography</h2>
        <div className='space-y-4'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900'>
            Heading 1
          </h1>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
            Heading 2
          </h2>
          <h3 className='text-2xl md:text-3xl font-semibold text-gray-900'>
            Heading 3
          </h3>
          <h4 className='text-xl md:text-2xl font-semibold text-gray-900'>
            Heading 4
          </h4>
          <p className='text-base text-gray-700'>
            This is body text. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <p className='text-sm text-gray-600'>
            This is small text for less important information.
          </p>
          <p className='text-xs text-gray-500'>
            This is caption text for very small details.
          </p>
        </div>
      </section>

      {/* Loading States Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>
          Loading States
        </h2>
        <div className='flex items-center gap-8'>
          <div className='spinner w-8 h-8'></div>
          <div className='spinner w-12 h-12'></div>
          <div className='spinner w-16 h-16'></div>
        </div>
      </section>

      {/* Animations Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>Animations</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='card animate-fade-in p-6'>
            <p className='text-center font-medium'>Fade In</p>
          </div>
          <div className='card animate-slide-up p-6'>
            <p className='text-center font-medium'>Slide Up</p>
          </div>
          <div className='card hover-lift p-6'>
            <p className='text-center font-medium'>Hover Lift (hover me)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Color Swatch Component
const ColorSwatch = ({ label, color }) => (
  <div className='text-center'>
    <div className={cn('w-full h-24 rounded mb-2 shadow-md', color)}></div>
    <p className='text-sm font-medium text-gray-700'>{label}</p>
  </div>
);

export default ThemeShowcase;
