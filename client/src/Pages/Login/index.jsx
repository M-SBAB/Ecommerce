import { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [regData, setRegData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = () => {
    if (username && password) {
      console.log('Login attempted with:', { username, password });
      alert(`Login attempted with username: ${username}`);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleRegister = () => {
    if (regData.password !== regData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (regData.username && regData.email && regData.password) {
      console.log('Registration successful:', regData);
      alert('Registration successful!');
      setShowRegistration(false);
      setRegData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      alert('Please fill in all fields');
    }
  };

  if (showRegistration) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4'>
        <div className='bg-white p-8 rounded-lg shadow-2xl w-full max-w-md'>
          <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>
            Create Account
          </h2>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Username
              </label>
              <input
                type='text'
                value={regData.username}
                onChange={(e) =>
                  setRegData({ ...regData, username: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                placeholder='Choose a username'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={regData.email}
                onChange={(e) =>
                  setRegData({ ...regData, email: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                placeholder='Enter your email'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <input
                type='password'
                value={regData.password}
                onChange={(e) =>
                  setRegData({ ...regData, password: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                placeholder='Create a password'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Confirm Password
              </label>
              <input
                type='password'
                value={regData.confirmPassword}
                onChange={(e) =>
                  setRegData({ ...regData, confirmPassword: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition'
                placeholder='Confirm your password'
              />
            </div>
            <button onClick={handleRegister} className='btn-secondary btn-full'>
              Register
            </button>
          </div>
          <div className='mt-4 text-center'>
            <button
              onClick={() => setShowRegistration(false)}
              className='btn-ghost text-sm'
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4'>
      <div className='bg-white p-8 rounded-lg shadow-2xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>
          Welcome Back
        </h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
              placeholder='Enter your username'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
              placeholder='Enter your password'
            />
          </div>
          <button onClick={handleLogin} className='btn-primary btn-full'>
            Login
          </button>
        </div>
        <div className='mt-6 text-center'>
          <p className='text-gray-600 text-sm'>
            Don't have an account?{' '}
            <button
              onClick={() => setShowRegistration(true)}
              className='btn-ghost p-0 text-sm'
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
