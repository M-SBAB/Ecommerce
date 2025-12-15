import {
  SpaceIcon,
  ShoppingBag,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Auth = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [form, setForm] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const Navigate = useNavigate();
  const { login } = useAuth();

  const loginUser = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:6001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.loginusername,
          password: data.loginPassword,
        }),
      });

      const response = await res.json();

      if (res.ok && response.user) {
        setSuccess('Login successful! Redirecting...');
        // Use AuthContext login function to manage global state
        login(response.user);
        setTimeout(() => {
          Navigate('/dashboard');
        }, 1000);
      } else if (response.ErrorMessage) {
        setError(response.ErrorMessage);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const signUpUser = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:6001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.signUpusername,
          password: data.signUpPassword,
        }),
      });

      const response = await res.json();

      if (res.ok && response.message) {
        setSuccess('Account created successfully! Please login.');
        reset();
        setTimeout(() => {
          setForm('login');
          setSuccess('');
        }, 2000);
      } else if (response.ErrorMessage) {
        setError(response.ErrorMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-primary-500 to-secondary-500 p-4'>
      {form === 'login' && (
        <form
          onSubmit={handleSubmit(loginUser)}
          className='w-full max-w-md animate-fade-in'
        >
          <div className='card shadow-2xl space-y-6'>
            {/* Header */}
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4'>
                <ShoppingBag className='w-8 h-8 text-primary-600' />
              </div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Welcome Back
              </h2>
              <p className='text-gray-600'>Sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg flex items-center gap-2'>
                <AlertCircle className='w-5 h-5 flex-shrink-0' />
                <span className='text-sm'>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className='bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-lg flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 flex-shrink-0' />
                <span className='text-sm'>{success}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <User className='w-4 h-4 inline mr-2 mb-1' />
                  Username
                </label>
                <input
                  type='text'
                  placeholder='Enter your username'
                  disabled={loading}
                  className='input-base'
                  {...register('loginusername', {
                    required: 'Username is required',
                  })}
                />
                {errors.loginusername && (
                  <span className='text-sm text-error-600 block mt-1'>
                    {errors.loginusername.message}
                  </span>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Lock className='w-4 h-4 inline mr-2' />
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Enter your password'
                  disabled={loading}
                  className='input-base'
                  {...register('loginPassword', {
                    required: 'Password is required',
                  })}
                />
                {errors.loginPassword && (
                  <span className='text-sm text-error-600 block mt-1'>
                    {errors.loginPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='btn-primary w-full text-lg py-3 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <div className='spinner w-5 h-5'></div>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            {/* Register Link */}
            <div className='text-center pt-4 border-t border-gray-200'>
              <p className='text-gray-600 text-sm'>
                Don't have an account?{' '}
                <button
                  type='button'
                  disabled={loading}
                  className='link font-semibold'
                  onClick={() => {
                    setForm('register');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </form>
      )}

      {form === 'register' && (
        <form
          onSubmit={handleSubmit(signUpUser)}
          className='w-full max-w-md animate-fade-in'
        >
          <div className='card shadow-2xl space-y-6'>
            {/* Header */}
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4'>
                <ShoppingBag className='w-8 h-8 text-secondary-600' />
              </div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Create Account
              </h2>
              <p className='text-gray-600'>Join our e-commerce store</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg flex items-center gap-2'>
                <AlertCircle className='w-5 h-5 flex-shrink-0' />
                <span className='text-sm'>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className='bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-lg flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 flex-shrink-0' />
                <span className='text-sm'>{success}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <User className='w-4 h-4 inline mr-2' />
                  Username
                </label>
                <input
                  type='text'
                  placeholder='Choose a username'
                  disabled={loading}
                  className='input-base'
                  {...register('signUpusername', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                  })}
                />
                {errors.signUpusername && (
                  <span className='text-sm text-error-600 block mt-1'>
                    {errors.signUpusername.message}
                  </span>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Lock className='w-4 h-4 inline mr-2' />
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Create a password'
                  disabled={loading}
                  className='input-base'
                  {...register('signUpPassword', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.signUpPassword && (
                  <span className='text-sm text-error-600 block mt-1'>
                    {errors.signUpPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='btn-secondary w-full text-lg py-3 flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <div className='spinner w-5 h-5'></div>
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </button>

            {/* Login Link */}
            <div className='text-center pt-4 border-t border-gray-200'>
              <p className='text-gray-600 text-sm'>
                Already have an account?{' '}
                <button
                  type='button'
                  disabled={loading}
                  className='link font-semibold'
                  onClick={() => {
                    setForm('login');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Auth;
