import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Choose the correct endpoint based on role
      let endpoint = 'http://localhost:5000/api/users/register';
      
      if (selectedRole === 'content-creator') {
        endpoint = 'http://localhost:5000/api/users/create-content-creator';
      }

      const response = await axios.post(endpoint, {
        username,
        email,
        password,
      });
      
      alert(response.data.message);
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6FFF5] to-[#B8F6D1] dark:from-[#0F1720] dark:to-[#153726] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Information Section */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-4">
                  🌿 Welcome to AYUSH
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  Join our community and embark on a journey through nature's healing wonders. Discover the ancient wisdom of Ayurvedic herbs and transform your wellness journey.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">🌱</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Explore Medicinal Herbs</h3>
                    <p className="text-gray-700 dark:text-gray-300">Discover 100+ medicinal herbs with detailed information</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">📚</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Learn Ancient Wisdom</h3>
                    <p className="text-gray-700 dark:text-gray-300">Access traditional Ayurvedic knowledge and practices</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl mt-1">🎯</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">3D Virtual Tours</h3>
                    <p className="text-gray-700 dark:text-gray-300">Experience herbs in an interactive 3D environment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="bg-white dark:bg-[#0F1720] rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-800">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-[#2ECC71] to-[#58E07A] bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Join the herbal garden community today
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 font-semibold">
                ✕ {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Choose your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71] transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71] transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71] transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ECC71] transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Role Selection Radio Buttons - ADMIN REMOVED */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Register as
                </label>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="register-role-content-creator"
                      name="register-role"
                      value="content-creator"
                      checked={selectedRole === 'content-creator'}
                      onChange={() => handleRoleChange('content-creator')}
                      disabled={loading}
                      className="w-4 h-4 text-[#2ECC71] bg-white dark:bg-[#1a2f24] border-gray-300 dark:border-gray-600 focus:ring-[#2ECC71] focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label 
                      htmlFor="register-role-content-creator" 
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Content Creator
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="register-role-user"
                      name="register-role"
                      value="user"
                      checked={selectedRole === 'user'}
                      onChange={() => handleRoleChange('user')}
                      disabled={loading}
                      className="w-4 h-4 text-[#2ECC71] bg-white dark:bg-[#1a2f24] border-gray-300 dark:border-gray-600 focus:ring-[#2ECC71] focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label 
                      htmlFor="register-role-user" 
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      User
                    </label>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] hover:from-[#27b666] hover:to-[#1a9a51] text-white py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Creating Account...' : '🌿 Join the Garden'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Already a Member Link */}
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#2ECC71] hover:text-[#1ea85a] transition-colors duration-200"
                >
                  Log in here
                </Link>
              </p>
            </div>

            {/* Back to Landing */}
            <div className="text-center mt-4">
              <Link
                to="/landing"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#2ECC71] transition-colors duration-200"
              >
                ← Back to Landing Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;